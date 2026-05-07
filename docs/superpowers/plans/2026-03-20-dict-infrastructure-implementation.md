# 字典基础设施 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `playground` 前端中实现可复用的字典基础设施，支持按 `dictCode` 懒加载缓存字典明细，并提供表单下拉、普通文本/标签渲染、vxe-table 声明式渲染能力。

**Architecture:** 采用“字典仓库 + 查询能力 + 表现层组件/渲染器”三层结构。底层统一复用现有 `/sys-dict-detail/list` 接口，按 `dictCode` 做单例缓存和并发复用；上层通过 `DictSelect`、`DictText`、`DictTag` 以及 `CellDictText`、`CellDictTag` 暴露给业务页面，默认按 `detailCode` 匹配，必要时支持切换到 `value`。

**Tech Stack:** Vue 3、TypeScript、`@vben/common-ui`、ant-design-vue、vxe-table、Vitest、pnpm、Windows PowerShell

---

## 环境说明

- 终端环境：Windows PowerShell
- 前端项目根目录：`D:\IdeaWorkspaces\vue-vben-admin`
- 后端项目根目录：`D:\IdeaWorkspaces\capable-admin`
- 包管理器：`pnpm`
- 测试命令风格：`cmd /c pnpm vitest run ... --dom`
- 本计划不涉及 Maven 执行，不涉及 `settings.xml`

## 文件结构与职责

### 计划创建或修改的文件

- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\api\system\dict.ts`
  - 补充字典基础设施复用的轻量查询函数与类型导出
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\types.ts`
  - 定义字典项、缓存桶、匹配字段、组件 props 类型
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\use-dict-store.ts`
  - 实现按 `dictCode` 的懒加载缓存、并发复用、显式刷新与清缓存
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\use-dict.ts`
  - 对外提供 `useDictOptions`、`getDictLabel`、`getDictItem` 等能力
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\dict-select.vue`
  - 通用字典下拉组件
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\dict-text.vue`
  - 通用字典文本渲染组件
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\dict-tag.vue`
  - 通用字典标签渲染组件
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\index.ts`
  - 统一导出字典基础设施模块
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\adapter\component\index.ts`
  - 注册 `DictSelect` 表单组件类型
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\adapter\vxe-table.ts`
  - 注册 `CellDictText`、`CellDictTag`
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\system\dict\list.vue`
  - 字典维护成功后触发对应缓存刷新/清理
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict-store.test.ts`
  - 测试仓库层缓存、并发、刷新逻辑
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict.test.ts`
  - 测试匹配字段、label 回退、options 输出
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\dict-components.test.ts`
  - 测试 `DictText`、`DictTag` 等表现层行为
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\adapter\__tests__\dict-renderer.test.ts`
  - 测试 `CellDictText`、`CellDictTag`

---

## Chunk 1: 字典数据层

### Task 1: 补齐字典 API 与类型入口

**Files:**
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\api\system\dict.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict-store.test.ts`

- [ ] **Step 1: 写失败测试，约束按 `dictCode` 查询字典明细时的接口入参与返回格式**

```ts
it('should request dict details with dictCode and normalize list data', async () => {
  const response = await fetchDictOptionsByCode('enabled');
  expect(response[0]).toMatchObject({
    detailCode: 'enabled',
    dictCode: 'enabled',
    label: '启用',
  });
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: FAIL，提示 `fetchDictOptionsByCode` 或相关导出不存在

- [ ] **Step 3: 在 `dict.ts` 中补充字典基础设施所需的轻量查询函数**

```ts
export async function fetchDictOptionsByCode(dictCode: string) {
  const result = await getDictDetailList({ dictCode, pageNum: 1, pageSize: 999 });
  return result?.content || result?.list || [];
}
```

- [ ] **Step 4: 运行测试，确认基础 API 已可被仓库层消费**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: PASS 或进入下一个失败断言

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/api/system/dict.ts playground/src/components/dict/__tests__/use-dict-store.test.ts
git commit -m "feat: add dict options api helper"
```

### Task 2: 建立字典类型定义

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\types.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict-store.test.ts`

- [ ] **Step 1: 写失败测试，约束仓库层状态结构与匹配字段类型**

```ts
it('should support detailCode as default match field and value as optional match field', () => {
  const config: DictMatchConfig = { matchField: 'detailCode' };
  expect(config.matchField).toBe('detailCode');
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: FAIL，提示 `DictMatchConfig` 不存在

- [ ] **Step 3: 新建字典类型文件**

```ts
export type DictMatchField = 'detailCode' | 'value';

export interface DictMatchConfig {
  matchField?: DictMatchField;
}

export interface DictOptionItem {
  dictCode?: string;
  detailCode?: string;
  label: string;
  value: string;
  dictSort?: number;
  [key: string]: any;
}
```

- [ ] **Step 4: 运行测试，确认类型约束生效**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: PASS 或进入下一个失败断言

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/components/dict/types.ts playground/src/components/dict/__tests__/use-dict-store.test.ts
git commit -m "feat: add dict infrastructure types"
```

### Task 3: 实现字典仓库的懒加载缓存与并发复用

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\use-dict-store.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict-store.test.ts`

- [ ] **Step 1: 写失败测试，覆盖首次加载、缓存命中、并发只请求一次**

```ts
it('should only request once for the same dictCode while loading', async () => {
  const promiseA = ensureDictLoaded('enabled');
  const promiseB = ensureDictLoaded('enabled');
  await Promise.all([promiseA, promiseB]);
  expect(fetchDictOptionsByCode).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: FAIL，提示 `ensureDictLoaded`、缓存桶或并发逻辑不存在

- [ ] **Step 3: 实现最小仓库层**

```ts
const dictBuckets = reactive<Record<string, DictBucket>>({});

export async function ensureDictLoaded(dictCode: string) {
  const bucket = getOrCreateBucket(dictCode);
  if (bucket.loaded) return bucket;
  if (bucket.pendingPromise) return bucket.pendingPromise;
  bucket.pendingPromise = loadBucket(dictCode, bucket);
  await bucket.pendingPromise;
  return bucket;
}
```

- [ ] **Step 4: 运行测试，确认缓存与并发行为通过**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/components/dict/use-dict-store.ts playground/src/components/dict/__tests__/use-dict-store.test.ts
git commit -m "feat: add dict store lazy cache"
```

### Task 4: 实现显式刷新与清缓存

**Files:**
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\use-dict-store.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict-store.test.ts`

- [ ] **Step 1: 写失败测试，覆盖 `refreshDict` 与 `clearDictCache`**

```ts
it('should refresh bucket data when refreshDict is called', async () => {
  await ensureDictLoaded('enabled');
  await refreshDict('enabled');
  expect(fetchDictOptionsByCode).toHaveBeenCalledTimes(2);
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: FAIL，提示刷新或清缓存方法不存在

- [ ] **Step 3: 实现刷新与清缓存**

```ts
export async function refreshDict(dictCode: string) {
  const bucket = getOrCreateBucket(dictCode);
  bucket.loaded = false;
  bucket.pendingPromise = undefined;
  return await ensureDictLoaded(dictCode);
}

export function clearDictCache(dictCode?: string) {
  if (dictCode) delete dictBuckets[dictCode];
  else Object.keys(dictBuckets).forEach((key) => delete dictBuckets[key]);
}
```

- [ ] **Step 4: 运行测试，确认刷新能力通过**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/components/dict/use-dict-store.ts playground/src/components/dict/__tests__/use-dict-store.test.ts
git commit -m "feat: add dict store refresh controls"
```

---

## Chunk 2: 字典能力层与组件层

### Task 5: 实现字典查询能力函数

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\use-dict.ts`
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\index.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict.test.ts`

- [ ] **Step 1: 写失败测试，覆盖 `detailCode` 默认匹配、`value` 可选匹配、未命中回退**

```ts
it('should return label by detailCode by default and raw value when not found', async () => {
  expect(await getDictLabel('enabled', 'enabled')).toBe('启用');
  expect(await getDictLabel('enabled', 'unknown')).toBe('unknown');
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict.test.ts --dom`
Expected: FAIL，提示 `getDictLabel` 或 `getDictOptions` 不存在

- [ ] **Step 3: 实现能力层最小闭环**

```ts
export async function getDictItem(dictCode: string, value: unknown, config?: DictMatchConfig) {
  const bucket = await ensureDictLoaded(dictCode);
  const matchField = config?.matchField ?? 'detailCode';
  return matchField === 'value'
    ? bucket.valueMap.get(String(value))
    : bucket.detailCodeMap.get(String(value));
}
```

- [ ] **Step 4: 运行测试，确认查询能力通过**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/components/dict/use-dict.ts playground/src/components/dict/index.ts playground/src/components/dict/__tests__/use-dict.test.ts
git commit -m "feat: add dict lookup composables"
```

### Task 6: 实现 `DictText` 与 `DictTag`

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\dict-text.vue`
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\dict-tag.vue`
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\index.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\dict-components.test.ts`

- [ ] **Step 1: 写失败测试，覆盖命中渲染与未命中回退**

```ts
it('should render dict label and fallback to raw value when item is missing', async () => {
  const wrapper = renderDictText({ dictCode: 'enabled', value: 'enabled' });
  expect(wrapper.text()).toContain('启用');
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/dict-components.test.ts --dom`
Expected: FAIL，提示组件不存在

- [ ] **Step 3: 实现最小表现层组件**

```vue
<script setup lang="ts">
const label = ref(String(props.value ?? ''));
watchEffect(async () => {
  label.value = await getDictLabel(props.dictCode, props.value, props);
});
</script>
```

- [ ] **Step 4: 运行测试，确认文本与标签组件通过**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/dict-components.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/components/dict/dict-text.vue playground/src/components/dict/dict-tag.vue playground/src/components/dict/index.ts playground/src/components/dict/__tests__/dict-components.test.ts
git commit -m "feat: add dict display components"
```

### Task 7: 实现 `DictSelect`

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\dict-select.vue`
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\index.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\dict-components.test.ts`

- [ ] **Step 1: 写失败测试，约束 `dictCode` 下拉 options 与 `matchField` 行为**

```ts
it('should expose options from dictCode and use detailCode as default value field', async () => {
  const wrapper = renderDictSelect({ dictCode: 'enabled' });
  expect(wrapper.emitted('optionsChange')?.[0]?.[0][0]).toMatchObject({
    label: '启用',
    value: 'enabled',
  });
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/dict-components.test.ts --dom`
Expected: FAIL，提示 `DictSelect` 不存在

- [ ] **Step 3: 实现最小字典下拉组件**

```vue
<template>
  <ApiComponent
    :component="Select"
    :options="options"
    :model-prop-name="'value'"
    v-bind="$attrs"
  />
</template>
```

- [ ] **Step 4: 运行测试，确认下拉组件通过**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/dict-components.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/components/dict/dict-select.vue playground/src/components/dict/index.ts playground/src/components/dict/__tests__/dict-components.test.ts
git commit -m "feat: add dict select component"
```

### Task 8: 在表单组件适配层注册 `DictSelect`

**Files:**
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\adapter\component\index.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\dict-components.test.ts`

- [ ] **Step 1: 写失败测试，约束 `component: 'DictSelect'` 可以被表单系统识别**

```ts
it('should register DictSelect as a supported component type', () => {
  expect(componentTypes).toContain('DictSelect');
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/dict-components.test.ts --dom`
Expected: FAIL，提示 `DictSelect` 未注册

- [ ] **Step 3: 修改组件适配层注册**

```ts
type ComponentType = 'DictSelect' | ...existing;

components.DictSelect = withDefaultPlaceholder(DictSelect, 'select');
```

- [ ] **Step 4: 运行测试，确认表单组件注册通过**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/dict-components.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/adapter/component/index.ts playground/src/components/dict/__tests__/dict-components.test.ts
git commit -m "feat: register dict select adapter"
```

---

## Chunk 3: 表格渲染与业务联动

### Task 9: 注册 `CellDictText` 与 `CellDictTag`

**Files:**
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\adapter\vxe-table.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\adapter\__tests__\dict-renderer.test.ts`

- [ ] **Step 1: 写失败测试，覆盖表格渲染器按 `dictCode` 输出文本与标签**

```ts
it('should render dict label in CellDictText renderer', async () => {
  const content = await renderCellDictText({ dictCode: 'enabled' }, { status: 'enabled' });
  expect(content).toContain('启用');
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/adapter/__tests__/dict-renderer.test.ts --dom`
Expected: FAIL，提示字典渲染器不存在

- [ ] **Step 3: 在 `vxe-table` 适配层实现最小渲染器**

```ts
vxeUI.renderer.add('CellDictText', {
  renderTableDefault({ props }, { column, row }) {
    return h(DictText, { dictCode: props?.dictCode, value: row[column.field], ...props });
  },
});
```

- [ ] **Step 4: 运行测试，确认表格渲染器通过**

Run: `cmd /c pnpm vitest run playground/src/adapter/__tests__/dict-renderer.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/adapter/vxe-table.ts playground/src/adapter/__tests__/dict-renderer.test.ts
git commit -m "feat: add dict table renderers"
```

### Task 10: 在字典维护页接入缓存刷新

**Files:**
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\system\dict\list.vue`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict-store.test.ts`

- [ ] **Step 1: 写失败测试，约束字典维护成功后触发刷新或清缓存**

```ts
it('should refresh dict cache after dict detail changes', async () => {
  await onDictDetailSaved({ dictCode: 'enabled' });
  expect(refreshDict).toHaveBeenCalledWith('enabled');
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: FAIL，提示维护页未联动刷新逻辑

- [ ] **Step 3: 在字典维护页成功回调中接入刷新**

```ts
async function onDictDetailSaved(payload: { dictCode?: string }) {
  if (payload.dictCode) {
    await refreshDict(payload.dictCode);
  }
  onRefreshDetail();
}
```

- [ ] **Step 4: 运行测试，确认维护页与缓存联动通过**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/views/system/dict/list.vue playground/src/components/dict/__tests__/use-dict-store.test.ts
git commit -m "feat: refresh dict cache after maintenance"
```

### Task 11: 运行聚合验证

**Files:**
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict-store.test.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\use-dict.test.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\components\dict\__tests__\dict-components.test.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\adapter\__tests__\dict-renderer.test.ts`

- [ ] **Step 1: 运行字典基础设施全部单测**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts playground/src/components/dict/__tests__/use-dict.test.ts playground/src/components/dict/__tests__/dict-components.test.ts playground/src/adapter/__tests__/dict-renderer.test.ts --dom`
Expected: PASS，所有新增字典能力测试通过

- [ ] **Step 2: 运行现有字典页面相关测试，确认未回归**

Run: `cmd /c pnpm vitest run playground/src/views/system/dict/__tests__/data.test.ts --dom`
Expected: PASS

- [ ] **Step 3: 运行针对 `playground` 的最小类型或 lint 验证**

Run: `cmd /c pnpm -F @vben/playground exec vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 4: 整理变更并提交最终实现**

```bash
git add playground/src/api/system/dict.ts playground/src/components/dict playground/src/adapter/component/index.ts playground/src/adapter/vxe-table.ts playground/src/views/system/dict/list.vue playground/src/adapter/__tests__/dict-renderer.test.ts
git commit -m "feat: add reusable dict infrastructure"
```

---

## 备注

- 所有新增代码、注释、测试命名与文档说明统一使用中文。
- 若 `playground/src/adapter/component/index.ts` 文件内已有较大体量代码，新增组件注册时应沿用现有结构，不做无关重构。
- 若测试过程中发现 `DictSelect` 直接依赖 `ApiComponent` 成本过高，可退一步改为基于现有 `Select` 组件包装，但必须保持对业务暴露的 `component: 'DictSelect'` 不变。
- 若字典维护页当前成功事件没有携带 `dictCode`，应先在最小范围内补齐事件数据，再接入刷新逻辑。

## 执行顺序建议

1. 先完成 Chunk 1，确保缓存与并发语义稳定。
2. 再完成 Chunk 2，输出统一能力与组件。
3. 最后完成 Chunk 3，把表格和维护页联动接上并做整体验证。

Plan complete and saved to `docs/superpowers/plans/2026-03-20-dict-infrastructure-implementation.md`. Ready to execute?
