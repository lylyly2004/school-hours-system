# Dashboard Script Structure

当前后台页面脚本已经从单文件拆成多文件结构，后续开发只维护本目录。

## 目录说明

- `core/state.js`
  放页面共享状态、示例数据、DOM 引用。

- `core/utils.js`
  放公共工具函数，例如日期、金额、剩余课时、弹窗开关、删除确认。

- `modules/common.js`
  放页面切换、顶部标题、菜单折叠、公共下拉填充等跨模块逻辑。

- `modules/charge.js`
  放收费模式展示逻辑。

- `modules/course.js`
  放课程管理列表、改名、删除、课程使用检查。

- `modules/class.js`
  放班级管理列表与新增班级逻辑。

- `modules/management-editor.js`
  放课程/班级类型共用弹窗的打开、关闭、保存逻辑。

- `modules/teacher.js`
  放教师管理相关渲染与操作。

- `modules/renewal.js`
  放续费提醒、续费弹窗、续费计算逻辑。

- `modules/enrollment.js`
  放新生报名、学员生日、今日办理相关逻辑。

- `modules/retail.js`
  放教材零售相关逻辑。

- `modules/student.js`
  放学员管理、转班、换老师、停课、退费相关逻辑。

- `modules/session.js`
  放上课管理、记录上课、课时联动相关逻辑。

- `modules/transaction.js`
  放流水管理相关逻辑。

- `app.js`
  只保留初始化和事件绑定入口。

## 维护规则

1. 新功能优先放进对应模块，不要再写回旧 `js/dashboard.js`。
2. 一个功能只保留一个生效版本，确认旧逻辑废弃后再清理。
3. 每次只改一个模块，改完立即自检并提交 Git。
4. 涉及多个模块联动时，先写清楚会影响哪些数据字段再动代码。

## 建议开发顺序

1. `course.js`
2. `class.js`
3. `enrollment.js`
4. `student.js`
5. `session.js`
6. `transaction.js`

先把课程管理、班级管理、新生报名这条主链做稳，再继续扩展其他功能。
