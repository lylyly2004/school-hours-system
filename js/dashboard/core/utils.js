function showToast(message) {
  if (!refs.toast) return;
  refs.toast.textContent = message;
  refs.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  persistAppData();
  showToast.timer = window.setTimeout(() => {
    refs.toast.classList.add("hidden");
  }, 2200);
}

function uid() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

const LOCAL_DATA_STORAGE_KEY = "school-hours-system-data-v1";
const LOCAL_DATA_BACKUP_KEY = "school-hours-system-backups-v1";
const LOCAL_DATA_BACKUP_LIMIT = 5;
const DATA_FILE_DB_NAME = "school-hours-system-file-db";
const DATA_FILE_STORE_NAME = "handles";
const DATA_FILE_HANDLE_KEY = "main-data-file";
const LOCAL_DATA_FILE_META_KEY = "school-hours-system-data-file-meta-v1";

function getPersistedStatePayload() {
  return {
    campusOptions: campusOptions.filter(Boolean),
    retailCategoryOptions: retailCategoryOptions.filter(Boolean),
    chargePackages,
    courses,
    classTypeOptions,
    teachers,
    classes,
    enrollmentRecords,
    retailRecords,
    birthdayNotes,
    todayRecords,
    sessionRecords,
    transactions,
    selectedSessionTeacherName,
    selectedSessionClassName
  };
}

function isFileSystemAccessSupported() {
  return typeof window.showSaveFilePicker === "function";
}

function getExportEnvelope() {
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    data: getPersistedStatePayload()
  };
}

function getDataFileMeta() {
  try {
    const raw = window.localStorage.getItem(LOCAL_DATA_FILE_META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to read data file meta:", error);
    return null;
  }
}

function saveDataFileMeta(meta) {
  try {
    window.localStorage.setItem(LOCAL_DATA_FILE_META_KEY, JSON.stringify(meta));
  } catch (error) {
    console.warn("Failed to save data file meta:", error);
  }
}

function formatStatusDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function idbRequestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDataFileDb() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATA_FILE_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DATA_FILE_STORE_NAME)) {
        db.createObjectStore(DATA_FILE_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveBoundDataFileHandle(handle) {
  const db = await openDataFileDb();
  try {
    const transaction = db.transaction(DATA_FILE_STORE_NAME, "readwrite");
    transaction.objectStore(DATA_FILE_STORE_NAME).put(handle, DATA_FILE_HANDLE_KEY);
    await idbRequestToPromise(transaction.objectStore(DATA_FILE_STORE_NAME).get(DATA_FILE_HANDLE_KEY));
  } finally {
    db.close();
  }
}

async function getBoundDataFileHandle() {
  const db = await openDataFileDb();
  try {
    const transaction = db.transaction(DATA_FILE_STORE_NAME, "readonly");
    return await idbRequestToPromise(transaction.objectStore(DATA_FILE_STORE_NAME).get(DATA_FILE_HANDLE_KEY));
  } finally {
    db.close();
  }
}

async function ensureFileHandlePermission(handle, mode = "readwrite") {
  if (!handle) return false;
  if (typeof handle.queryPermission === "function") {
    const current = await handle.queryPermission({ mode });
    if (current === "granted") return true;
  }
  if (typeof handle.requestPermission === "function") {
    const result = await handle.requestPermission({ mode });
    return result === "granted";
  }
  return true;
}

async function readAppDataFromBoundFile(handle) {
  if (!handle) return null;
  const file = await handle.getFile();
  const rawText = await file.text();
  if (!rawText.trim()) return null;
  const parsed = JSON.parse(rawText);
  return unwrapPersistedPayload(parsed);
}

async function refreshDataFileStatus() {
  if (!refs.dataFileStatus) return;

  if (!isFileSystemAccessSupported()) {
    refs.dataFileStatus.textContent = "当前环境不支持固定数据文件";
    return;
  }

  const handle = await getBoundDataFileHandle().catch(() => null);
  const meta = getDataFileMeta();

  if (!handle) {
    refs.dataFileStatus.textContent = "未绑定数据文件";
    return;
  }

  const fileName = meta?.name || handle.name || "未命名数据文件";
  const syncText = formatStatusDateTime(meta?.lastSyncedAt);
  refs.dataFileStatus.textContent = syncText
    ? `已绑定：${fileName}｜最近同步：${syncText}`
    : `已绑定：${fileName}`;
}

async function writeAppDataToBoundFile(handle) {
  if (!handle) return false;
  const writer = await handle.createWritable();
  await writer.write(JSON.stringify(getExportEnvelope(), null, 2));
  await writer.close();
  return true;
}

async function persistBoundDataFile() {
  if (!isFileSystemAccessSupported()) return false;
  try {
    const handle = await getBoundDataFileHandle();
    if (!handle) return false;
    const granted = await ensureFileHandlePermission(handle, "readwrite");
    if (!granted) return false;
    await writeAppDataToBoundFile(handle);
    saveDataFileMeta({
      name: handle.name || "school-hours-data.json",
      lastSyncedAt: new Date().toISOString()
    });
    void refreshDataFileStatus();
    return true;
  } catch (error) {
    console.warn("Failed to persist bound data file:", error);
    return false;
  }
}

async function bindDataFile() {
  if (!isFileSystemAccessSupported()) {
    window.alert("当前环境不支持固定数据文件，请继续使用导出/导入方式备份数据。");
    return;
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: "school-hours-data.json",
      types: [
        {
          description: "JSON 数据文件",
          accept: { "application/json": [".json"] }
        }
      ]
    });

    await saveBoundDataFileHandle(handle);
    const granted = await ensureFileHandlePermission(handle, "readwrite");
    if (!granted) {
      showToast("未获得数据文件读写权限");
      return;
    }

    const existingPayload = await readAppDataFromBoundFile(handle);
    if (hasMeaningfulAppData(existingPayload)) {
      const shouldImport = window.confirm("检测到该数据文件已有内容。点击“确定”加载文件数据；点击“取消”则用当前系统数据覆盖文件。");
      if (shouldImport) {
        applyPersistedData(existingPayload);
        normalizeSharedData();
        persistAppData();
        showToast("已绑定并加载数据文件");
        window.location.reload();
        return;
      }
    }

    await writeAppDataToBoundFile(handle);
    showToast("数据文件已绑定，后续会自动写入");
  } catch (error) {
    if (error && error.name === "AbortError") return;
    console.warn("Failed to bind data file:", error);
    window.alert("绑定数据文件失败，请重试。");
  }
}

async function syncFromBoundDataFile(showSuccessToast = true) {
  if (!isFileSystemAccessSupported()) {
    if (showSuccessToast) {
      window.alert("当前环境不支持固定数据文件同步，请继续使用导出/导入方式。");
    }
    return false;
  }

  try {
    const handle = await getBoundDataFileHandle();
    if (!handle) {
      if (showSuccessToast) {
        showToast("请先绑定数据文件");
      }
      return false;
    }

    const granted = await ensureFileHandlePermission(handle, showSuccessToast ? "readwrite" : "read");
    if (!granted) {
      if (showSuccessToast) {
        showToast("未获得数据文件读取权限");
      }
      return false;
    }

    const payload = await readAppDataFromBoundFile(handle);
    if (!payload || !hasMeaningfulAppData(payload)) {
      if (showSuccessToast) {
        showToast("数据文件中暂无可用数据");
      }
      return false;
    }

    applyPersistedData(payload);
    persistAppData();
    if (showSuccessToast) {
      showToast("已从数据文件同步最新数据");
      window.location.reload();
    }
    return true;
  } catch (error) {
    console.warn("Failed to sync from bound data file:", error);
    if (showSuccessToast) {
      window.alert("从数据文件同步失败，请检查文件是否可访问。");
    }
      return false;
    }
  }

const originalBindDataFile = bindDataFile;
bindDataFile = async function (...args) {
  const result = await originalBindDataFile.apply(this, args);
  const handle = await getBoundDataFileHandle().catch(() => null);
  if (handle) {
    const meta = getDataFileMeta() || {};
    saveDataFileMeta({
      name: meta.name || handle.name || "school-hours-data.json",
      lastSyncedAt: meta.lastSyncedAt || new Date().toISOString()
    });
  }
  await refreshDataFileStatus();
  return result;
};

const originalSyncFromBoundDataFile = syncFromBoundDataFile;
syncFromBoundDataFile = async function (...args) {
  const result = await originalSyncFromBoundDataFile.apply(this, args);
  const handle = await getBoundDataFileHandle().catch(() => null);
  if (result && handle) {
    saveDataFileMeta({
      name: handle.name || "school-hours-data.json",
      lastSyncedAt: new Date().toISOString()
    });
  }
  await refreshDataFileStatus();
  return result;
};

function unwrapPersistedPayload(rawValue) {
  if (!rawValue || typeof rawValue !== "object") return null;
  return rawValue && typeof rawValue === "object" && rawValue.data ? rawValue.data : rawValue;
}

function hasMeaningfulAppData(payload) {
  const data = unwrapPersistedPayload(payload);
  if (!data || typeof data !== "object") return false;

  const meaningfulArrayKeys = [
    "chargePackages",
    "courses",
    "teachers",
    "classes",
    "enrollmentRecords",
    "retailRecords",
    "todayRecords",
    "sessionRecords",
    "transactions"
  ];

  if (meaningfulArrayKeys.some((key) => Array.isArray(data[key]) && data[key].length > 0)) {
    return true;
  }

  if (data.birthdayNotes && typeof data.birthdayNotes === "object" && Object.keys(data.birthdayNotes).length > 0) {
    return true;
  }

  const customCampuses = Array.isArray(data.campusOptions)
    ? data.campusOptions.filter((item) => item && item !== "全部校区" && item !== "总部校区")
    : [];
  if (customCampuses.length > 0) return true;

  const customClassTypes = Array.isArray(data.classTypeOptions)
    ? data.classTypeOptions.filter(
      (item) => !["1对1", "1对2", "小组课", "班制课"].includes(String(item || "").trim())
    )
    : [];
  if (customClassTypes.length > 0) return true;

  const customRetailCategories = Array.isArray(data.retailCategoryOptions)
    ? data.retailCategoryOptions.filter(
      (item) => !["教材", "配件", "乐器", "学习用品"].includes(String(item || "").trim())
    )
    : [];
  return customRetailCategories.length > 0;
}

function persistAppData() {
  try {
    const payload = getPersistedStatePayload();
    const envelope = {
      savedAt: new Date().toISOString(),
      version: 1,
      data: payload
    };
    window.localStorage.setItem(LOCAL_DATA_STORAGE_KEY, JSON.stringify(envelope));

    if (!hasMeaningfulAppData(payload)) return;

    const existingBackups = (() => {
      try {
        const raw = window.localStorage.getItem(LOCAL_DATA_BACKUP_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.warn("Failed to read local app backups:", error);
        return [];
      }
    })();

    const previousLatest = existingBackups[existingBackups.length - 1];
    const sameAsLatest = previousLatest
      && JSON.stringify(unwrapPersistedPayload(previousLatest)) === JSON.stringify(payload);

    if (sameAsLatest) return;

    const nextBackups = [...existingBackups, envelope].slice(-LOCAL_DATA_BACKUP_LIMIT);
    window.localStorage.setItem(LOCAL_DATA_BACKUP_KEY, JSON.stringify(nextBackups));
    void persistBoundDataFile();
  } catch (error) {
    console.warn("Failed to persist local app data:", error);
  }
}

function loadPersistedData() {
  try {
    const raw = window.localStorage.getItem(LOCAL_DATA_STORAGE_KEY);
    const primary = raw ? JSON.parse(raw) : null;
    const primaryPayload = unwrapPersistedPayload(primary);

    if (hasMeaningfulAppData(primaryPayload)) {
      applyPersistedData(primaryPayload);
      return true;
    }

    const backupRaw = window.localStorage.getItem(LOCAL_DATA_BACKUP_KEY);
    const backups = backupRaw ? JSON.parse(backupRaw) : [];
    if (!Array.isArray(backups) || backups.length === 0) return false;

    const fallback = [...backups]
      .reverse()
      .map((item) => unwrapPersistedPayload(item))
      .find((item) => hasMeaningfulAppData(item));

    if (!fallback) return false;

    applyPersistedData(fallback);
    window.__schoolHoursRecoveredFromBackup = true;
    persistAppData();
    return true;
  } catch (error) {
    console.warn("Failed to load local app data:", error);
    return false;
  }
}

function applyPersistedData(saved) {
  if (!saved || typeof saved !== "object") return;

  if (Array.isArray(saved.campusOptions) && saved.campusOptions.length > 0) {
    campusOptions.splice(0, campusOptions.length, ...saved.campusOptions);
  }
  if (Array.isArray(saved.retailCategoryOptions) && saved.retailCategoryOptions.length > 0) {
    retailCategoryOptions.splice(0, retailCategoryOptions.length, ...saved.retailCategoryOptions);
  }
  if (Array.isArray(saved.chargePackages)) chargePackages = saved.chargePackages;
  if (Array.isArray(saved.courses)) courses = saved.courses;
  if (Array.isArray(saved.classTypeOptions)) classTypeOptions = saved.classTypeOptions;
  if (Array.isArray(saved.teachers)) teachers = saved.teachers;
  if (Array.isArray(saved.classes)) classes = saved.classes;
  if (Array.isArray(saved.enrollmentRecords)) enrollmentRecords = saved.enrollmentRecords;
  if (Array.isArray(saved.retailRecords)) retailRecords = saved.retailRecords;
  if (saved.birthdayNotes && typeof saved.birthdayNotes === "object") birthdayNotes = saved.birthdayNotes;
  if (Array.isArray(saved.todayRecords)) todayRecords = saved.todayRecords;
  if (Array.isArray(saved.sessionRecords)) sessionRecords = saved.sessionRecords;
  if (Array.isArray(saved.transactions)) transactions = saved.transactions;
  if (typeof saved.selectedSessionTeacherName === "string") selectedSessionTeacherName = saved.selectedSessionTeacherName;
  if (typeof saved.selectedSessionClassName === "string") selectedSessionClassName = saved.selectedSessionClassName;
}

function exportAppData() {
  const payload = getExportEnvelope();
  const fileName = `school-hours-data-${getTodayString()}.json`;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);
  showToast("数据已导出。");
}

function importAppDataFromFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      const payload = parsed && typeof parsed === "object" && parsed.data ? parsed.data : parsed;
      if (!payload || typeof payload !== "object") {
        throw new Error("Invalid data payload");
      }
      applyPersistedData(payload);
      normalizeSharedData();
      persistAppData();
      await persistBoundDataFile();
      window.alert("数据已导入，页面将刷新以加载最新内容。");
      window.location.reload();
    } catch (error) {
      console.warn("Failed to import local app data:", error);
      window.alert("导入失败，请确认选择的是系统导出的 JSON 数据文件。");
    }
  };
  reader.readAsText(file, "utf-8");
}

function getTodayString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMoney(value) {
  return Number(value || 0).toFixed(0);
}

function findPackage(identifier, fallbackName = "") {
  if (identifier !== undefined && identifier !== null && identifier !== "") {
    const matchedById = chargePackages.find((item) => String(item.id) === String(identifier));
    if (matchedById) return matchedById;
    const matchedByName = chargePackages.find((item) => item.name === String(identifier));
    if (matchedByName) return matchedByName;
  }

  if (fallbackName) {
    return chargePackages.find((item) => item.name === fallbackName);
  }

  return undefined;
}

function getPackageHours(identifier, fallbackName = "") {
  return Number(findPackage(identifier, fallbackName)?.hours || 0);
}

function getPackagePrice(identifier, fallbackName = "") {
  return Number(findPackage(identifier, fallbackName)?.price || 0);
}

function isCourseEnabled(course) {
  return course?.status !== "inactive";
}

function isClassEnabled(classItem) {
  return classItem?.status !== "inactive";
}

function isStudentActive(record) {
  return (record.studentStatus || "active") === "active";
}

function getEnrollmentUsedHours(record) {
  if (!record) return 0;
  return sessionRecords.reduce((total, session) => {
    const matched = Array.isArray(session.students)
      ? session.students.filter((item) => Number(item.enrollmentId) === Number(record.id))
      : [];
    return total + matched.reduce((sum, item) => sum + Number(item.deductedHours || 0), 0);
  }, 0);
}

function getEnrollmentTotalHours(record) {
  if (!record) return 0;
  return Number(record.paidHours || 0) + Number(record.giftHoursTotal || 0);
}

function getEnrollmentRemainingHours(record) {
  if (!record) return 0;
  if ((record.studentStatus || "active") === "refunded") return 0;
  const remaining = getEnrollmentTotalHours(record) - getEnrollmentUsedHours(record);
  return remaining;
}

function getTeacherMonthlyHours(teacherName) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return sessionRecords.reduce((total, record) => {
    if (record.teacherName !== teacherName) return total;
    const recordDate = new Date(record.date);
    if (Number.isNaN(recordDate.getTime())) return total;
    if (recordDate.getFullYear() !== year || recordDate.getMonth() !== month) return total;
    return total + Number(record.hours || 0);
  }, 0);
}

function getCurrentClassTeacher(className) {
  const matchedTeachers = Array.from(new Set(
    enrollmentRecords
      .filter((record) => isStudentActive(record) && record.className === className)
      .map((record) => record.teacherName)
      .filter(Boolean)
  ));
  return matchedTeachers.length > 0 ? matchedTeachers.join(" / ") : "\u5F85\u5206\u914D";
}

function getCurrentClassStudentCount(className) {
  return enrollmentRecords.filter((record) => isStudentActive(record) && record.className === className).length;
}

function normalizeSharedData() {
  Object.assign(pageMeta, {
    enrollment: { tag: "\u524D\u53F0\u4E1A\u52A1", title: "\u65B0\u751F\u62A5\u540D\u7BA1\u7406" },
    teacher: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u6559\u5E08\u7BA1\u7406" },
    course: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u5B66\u79D1\u7BA1\u7406" },
    class: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u73ED\u7EA7\u7BA1\u7406" },
    student: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u5B66\u5458\u7BA1\u7406" },
    session: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u4E0A\u8BFE\u7BA1\u7406" },
    charge: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u6536\u8D39\u6A21\u5F0F" },
    transaction: { tag: "\u8D22\u52A1\u7BA1\u7406", title: "\u6D41\u6C34\u7BA1\u7406" }
  });

  const normalizedCampuses = Array.isArray(campusOptions)
    ? campusOptions.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
    : [];
  const filteredCampuses = normalizedCampuses.filter((item) => item !== "\u5168\u90E8\u6821\u533A");
  campusOptions.splice(
    0,
    campusOptions.length,
    "\u5168\u90E8\u6821\u533A",
    ...(filteredCampuses.length > 0 ? filteredCampuses : ["\u603B\u90E8\u6821\u533A"])
  );

  const normalizedRetailCategories = Array.isArray(retailCategoryOptions)
    ? retailCategoryOptions.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
    : [];
  retailCategoryOptions.splice(
    0,
    retailCategoryOptions.length,
    ...(normalizedRetailCategories.length > 0
      ? Array.from(new Set(normalizedRetailCategories))
      : ["\u6559\u6750", "\u914D\u4EF6", "\u4E50\u5668", "\u5B66\u4E60\u7528\u54C1"])
  );

  const normalizedClassTypes = Array.isArray(classTypeOptions)
    ? classTypeOptions.filter(Boolean)
    : [];
  classTypeOptions = Array.from(new Set(normalizedClassTypes));
  if (classTypeOptions.length === 0) {
    classTypeOptions = ["1\u5BF91", "1\u5BF92", "\u5C0F\u7EC4\u8BFE", "\u73ED\u5236\u8BFE"];
  }

  chargePackages = Array.isArray(chargePackages)
    ? chargePackages.map((item) => ({
      ...item,
      hours: Number(item.hours || 0),
      price: Number(item.price || 0)
    }))
    : [];

  courses = Array.isArray(courses)
    ? courses.map((item) => ({
      ...item,
      status: item.status || "active"
    }))
    : [];

  teachers = Array.isArray(teachers)
    ? teachers.map((item) => ({
      ...item,
      nickname: item.nickname || item.name || "",
      subject: item.subject || "",
      phone: item.phone || ""
    }))
    : [];

  classes = Array.isArray(classes)
    ? classes.map((item) => ({
      ...item,
      status: item.status || "active"
    }))
    : [];

  enrollmentRecords = Array.isArray(enrollmentRecords)
    ? enrollmentRecords.map((record) => ({
      ...record,
      campus: record.campus || "\u603B\u90E8\u6821\u533A",
      studentStatus: record.studentStatus || "active",
      changeLogs: Array.isArray(record.changeLogs) ? record.changeLogs : [],
      lifecycleLogs: Array.isArray(record.lifecycleLogs) ? record.lifecycleLogs : [],
      renewalLogs: Array.isArray(record.renewalLogs) ? record.renewalLogs : []
    }))
    : [];

  retailRecords = Array.isArray(retailRecords)
    ? retailRecords.map((record) => ({
      ...record,
      campus: record.campus || "\u603B\u90E8\u6821\u533A",
      quantity: Number(record.quantity || 0),
      unitPrice: Number(record.unitPrice || 0),
      amount: Number(record.amount || 0)
    }))
    : [];

  birthdayNotes = birthdayNotes && typeof birthdayNotes === "object" ? birthdayNotes : {};

  todayRecords = Array.isArray(todayRecords) ? todayRecords : [];
  sessionRecords = Array.isArray(sessionRecords) ? sessionRecords : [];

  transactions = Array.isArray(transactions)
    ? transactions.map((record) => ({
      ...record,
      campus: record.campus || "\u603B\u90E8\u6821\u533A",
      amount: Number(record.amount || 0),
      category: record.category || "\u5B66\u8D39",
      itemName: record.itemName || ""
    }))
    : [];
}

function closeModal(modal) {
  modal?.classList.add("hidden");
}

function openModal(modal) {
  modal?.classList.remove("hidden");
}

function confirmDelete(label) {
  return window.confirm(`\u786E\u8BA4\u5220\u9664${label}\u5417\uFF1F\u5220\u9664\u540E\u5C06\u65E0\u6CD5\u6062\u590D\u3002`);
}
