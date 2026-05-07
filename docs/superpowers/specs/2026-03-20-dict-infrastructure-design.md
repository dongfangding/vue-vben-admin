# 前端通用字典基础设施设计

## 1. 背景

当前项目已经具备字典维护能力：

- 前端存在字典管理页面：`/system/dict`
- 后端提供字典与字典明细查询接口
- 业务页面中存在大量“状态值/枚举值/下拉选项”类场景

现状问题在于，字典能力还停留在“维护页可用”，没有形成业务页面可复用的前端基础设施，导致以下问题：

- 下拉框数据源需要每个页面单独处理
- 列表字段渲染名称需要每个页面手动映射
- 相同字典在多个页面重复请求、重复转换
- 表单、表格、详情页缺少统一接入方式

本次目标是在前端项目 `D:\IdeaWorkspaces\vue-vben-admin` 中补齐一套通用字典基础设施，使业务侧只需绑定 `dictCode`，即可完成选项加载与值渲染。

## 2. 目标

### 2.1 核心目标

构建“数据层 + 能力层 + 表现层”的前端通用字典体系，覆盖以下场景：

- 下拉框选项自动读取字典明细
- 列表字段根据字典值自动渲染名称
- 列表字段根据字典值自动渲染标签
- 表单 schema 与表格列配置支持声明式接入

### 2.2 预期使用方式

业务页面应尽量接近以下模式：

- 表单字段声明 `component: 'DictSelect'`，并传入 `dictCode`
- 列表列声明 `cellRender: { name: 'CellDictText' | 'CellDictTag' }`
- 详情或普通模板中直接使用 `DictText`、`DictTag`

业务代码不应重复处理以下逻辑：

- 如何调用字典接口
- 如何将接口结果转成 options
- 如何按 `detailCode` 或 `value` 查找名称
- 如何做缓存与并发复用

## 3. 非目标

第一版不处理以下内容：

- 多级字典或级联字典
- 本地持久化缓存
- TTL 自动过期刷新
- 基于业务主题的复杂标签颜色平台化
- 修改后端现有字典管理数据结构
- 重构底层通用表单库或 vxe-table 库源码

## 4. 现状分析

### 4.1 前端现有基础

当前前端已具备可复用的两个扩展点：

1. `ApiSelect`
   - 已支持通过 `api + params + resultField` 动态拉取 options
   - 已支持懒加载、参数联动、自动选择等能力

2. vxe-table 自定义渲染器
   - 已存在 `CellTag`、`CellOperation` 等扩展模式
   - 说明表格渲染器扩展路径清晰稳定

这意味着字典能力不需要另起炉灶，而是应复用当前组件适配层与表格渲染层。

### 4.2 后端现有基础

后端已提供：

- `GET /sys-dict/list`
- `GET /sys-dict-detail/list`
- 字典维护与字典明细维护能力

从当前需求看，前端字典基础设施可以直接复用现有 `getDictDetailList`，无需额外新建专用字典查询接口。

## 5. 总体设计

整体采用三层结构：

### 5.1 字典数据层

职责：

- 按 `dictCode` 懒加载字典明细
- 对同一 `dictCode` 建立缓存
- 对同一 `dictCode` 的并发请求进行复用
- 维护字典明细数组与双索引结构

该层不关心 UI，不直接处理组件渲染。

### 5.2 字典能力层

职责：

- 向上提供统一查询接口
- 统一处理 `detailCode` / `value` 两种匹配模式
- 输出下拉可用 options
- 输出展示可用 label / item

建议对外暴露以下能力：

- `ensureDictLoaded(dictCode)`
- `refreshDict(dictCode)`
- `clearDictCache(dictCode?)`
- `getDictOptions(dictCode, config?)`
- `getDictLabel(dictCode, value, config?)`
- `getDictItem(dictCode, value, config?)`
- `useDictOptions(dictCode, config?)`

默认匹配策略为 `detailCode`，特殊业务可显式切换为 `value`。

### 5.3 字典表现层

职责：

- 将能力层接入表单、表格与普通页面模板

建议提供以下表现组件与渲染器：

- `DictSelect`
- `DictText`
- `DictTag`
- `CellDictText`
- `CellDictTag`

## 6. 数据模型设计

### 6.1 字典项标准结构

前端内部统一使用标准字典项结构，字段来源于后端字典明细：

- `dictCode`
- `detailCode`
- `label`
- `value`
- `dictSort`
- 其他原始字段

### 6.2 缓存结构

按 `dictCode` 维护缓存桶，每个桶建议包含：

- `loading`: 是否正在加载
- `loaded`: 是否已加载成功
- `error`: 最近一次加载错误
- `items`: 当前字典项数组
- `fetchedAt`: 最近一次加载时间
- `detailCodeMap`: 基于 `detailCode` 的索引
- `valueMap`: 基于 `value` 的索引
- `pendingPromise`: 当前进行中的请求

其中双索引的目的如下：

- 默认业务按 `detailCode` 匹配
- 部分业务字段实际存储 `value`
- 避免每次渲染都线性遍历数组

## 7. 加载与缓存策略

### 7.1 懒加载

采用用户确认的默认策略：懒加载。

行为如下：

- 首次访问某个 `dictCode` 时发起请求
- 已有缓存时直接复用
- 正在加载时复用同一个 Promise，避免重复请求
- 加载成功后，所有依赖该字典的组件自动消费缓存结果

### 7.2 不采用的策略

第一版明确不采用：

- 页面级预加载
- TTL 自动刷新
- localStorage 持久化

原因：

- 当前目标是先稳定打通主链路
- 过度引入刷新与持久化策略会增加脏数据与状态不一致风险
- 字典数据规模通常较小，按需懒加载即可满足首版需求

### 7.3 刷新策略

提供显式刷新能力，不做自动过期：

- `refreshDict(dictCode)`：重新请求某个字典
- `clearDictCache(dictCode?)`：清理单个或全部缓存

适用场景：

- 字典维护页保存成功后刷新对应字典
- 调试场景下手动清缓存

## 8. 匹配策略设计

### 8.1 默认匹配字段

默认匹配字段为 `detailCode`。

原因：

- 当前用户明确说明，很多业务接口返回的是字典明细编码
- `detailCode` 具有更明确的业务语义
- 作为默认值更符合当前项目实际场景

### 8.2 可切换匹配字段

所有能力函数、组件、渲染器都应支持：

- `matchField: 'detailCode' | 'value'`

默认值：

- `matchField = 'detailCode'`

用途：

- 同一套字典基础设施兼容“返回编码”和“返回实际值”两种业务模型

### 8.3 下拉选项输出策略

对于 `DictSelect` 与 `getDictOptions`：

- `label` 统一使用字典项 `label`
- `value` 默认使用 `detailCode`
- 当配置 `matchField = 'value'` 时，`value` 改为字典项 `value`

## 9. 表现层设计

### 9.1 DictSelect

用途：

- 通用字典下拉组件

职责：

- 根据 `dictCode` 自动加载字典
- 输出适配现有表单体系的 options
- 支持 `matchField`
- 支持透传原始 `Select` / `ApiSelect` 常用属性

推荐业务写法：

- `component: 'DictSelect'`
- `componentProps: { dictCode: 'enabled' }`

### 9.2 DictText

用途：

- 普通文本展示场景

职责：

- 根据 `dictCode + value` 渲染字典名称
- 查不到时回退原始值

### 9.3 DictTag

用途：

- 标签展示场景

职责：

- 根据 `dictCode + value` 渲染标签
- 查不到时回退原始值
- 第一版不强制引入平台级颜色规则，默认使用基础标签展示

### 9.4 CellDictText / CellDictTag

用途：

- 列表表格渲染

职责：

- 让业务列配置只需声明 `dictCode`
- 沿用现有 vxe-table renderer 扩展机制

推荐列配置方式：

- `CellDictText`
- `CellDictTag`

并通过 `props` 或 `attrs` 传入：

- `dictCode`
- `matchField`

## 10. 表单与表格接入策略

### 10.1 表单接入

不改动底层通用库源码，优先在 `playground` 侧扩展组件适配层。

接入方式：

- 在 `playground/src/adapter/component/index.ts` 中注册 `DictSelect`
- 业务 schema 使用 `component: 'DictSelect'`

这样可以保证：

- 接入方式简单
- 风险局限在当前项目
- 不污染通用公共组件行为

### 10.2 不采用的方案

不建议直接魔改 `ApiSelect` 增加“字典模式”。

原因：

- 会使 `ApiSelect` 同时承担远程通用拉取与字典专用语义
- 组件职责变混乱
- 后续问题难排查

### 10.3 表格接入

在 `playground/src/adapter/vxe-table.ts` 中新增字典渲染器。

原因：

- 当前项目已采用 renderer 扩展模式
- 与 `CellTag` 等现有实现风格一致
- 不需要对业务表格做侵入式重构

## 11. 异常与降级策略

字典加载失败时，不应导致业务页面整体不可用。

### 11.1 DictSelect

- 显示空选项
- 输出加载失败提示或警告信息

### 11.2 DictText / CellDictText

- 查不到字典项时直接回退原始值

### 11.3 DictTag / CellDictTag

- 查不到字典项时渲染默认标签
- 标签内容回退为原始值

### 11.4 仓库层

- 保留最近一次错误状态
- 不因一次失败清空已有成功缓存

## 12. 字典维护页联动

字典基础设施落地后，需要处理一个关键问题：字典维护页修改数据后，业务页面不能一直读旧缓存。

建议策略：

- 在字典维护页保存字典明细成功后，调用 `refreshDict(dictCode)` 或 `clearDictCache(dictCode)`
- 保证后续业务页面再次使用时拿到最新数据

第一版只处理当前页面内的显式刷新，不做跨标签页同步。

## 13. 文件分布建议

建议新增或调整以下文件：

### 13.1 API 层

- `playground/src/api/system/dict.ts`

说明：

- 复用现有 `getDictDetailList`
- 如有必要，补充字典基础设施专用的轻量封装函数

### 13.2 字典基础设施目录

建议新增目录：

- `playground/src/components/dict/`

建议包含：

- `types.ts`
- `dict-store.ts` 或 `use-dict-store.ts`
- `use-dict.ts`
- `dict-select.vue`
- `dict-text.vue`
- `dict-tag.vue`
- `index.ts`

### 13.3 组件适配层

- `playground/src/adapter/component/index.ts`

新增：

- `DictSelect` 组件类型注册

### 13.4 表格适配层

- `playground/src/adapter/vxe-table.ts`

新增：

- `CellDictText`
- `CellDictTag`

### 13.5 测试文件

建议新增：

- 字典仓库测试
- 字典组件测试
- 表格渲染器测试

## 14. 测试设计

第一版至少覆盖以下测试：

### 14.1 仓库层

- 首次访问会发起请求
- 同一 `dictCode` 重复访问命中缓存
- 并发访问只发起一次请求
- `detailCode` 匹配正确
- `value` 匹配正确
- 刷新后能更新缓存

### 14.2 能力层

- `getDictOptions` 输出符合预期
- `getDictLabel` 命中时返回标签
- `getDictLabel` 未命中时回退原始值
- `getDictItem` 返回完整字典项

### 14.3 表现层

- `DictSelect` 能正确生成下拉 options
- `DictText` 能正确显示标签
- `DictTag` 在未命中时不报错
- `CellDictText`、`CellDictTag` 能正确渲染

## 15. 风险与控制

### 15.1 风险

- 字典基础设施引入全局缓存，容易产生隐性状态
- 字典维护后若不刷新缓存，会出现旧数据
- 若表现层直接耦合接口请求，后续维护成本会升高

### 15.2 控制措施

- 缓存集中在单一字典仓库中管理
- 提供显式刷新与清缓存能力
- 表现层统一依赖能力层，不直接访问接口
- 第一版保持范围可控，不叠加 TTL 与持久化机制

## 16. 实施建议

建议分三步实施：

1. 先完成字典仓库与能力函数
2. 再完成 `DictSelect`、`DictText`、`DictTag` 与表格渲染器
3. 最后挑选 1 至 2 个真实业务字段做接入验证，并补齐测试

## 17. 结论

本方案不是实现“一个字典组件”，而是建立一套前端通用字典基础设施。

其核心价值在于：

- 统一字典数据加载入口
- 统一字典缓存与查找能力
- 统一表单、表格、普通展示场景的接入方式
- 降低业务页面重复代码与后续维护成本

在当前项目结构下，该方案可最大程度复用现有 `ApiSelect`、组件适配层与 `vxe-table` 渲染器机制，风险可控，收益明确，适合作为第一版落地方案。
