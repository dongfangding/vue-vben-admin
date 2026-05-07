# 字典示例页 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `playground` 的 `Examples` 菜单下新增独立的字典示例页 `Examples -> Dict -> Basic`，集中演示 `DictSelect`、`DictText`、`DictTag`、`CellDictText`、`CellDictTag` 的标准使用方式。

**Architecture:** 在现有 `examples` 路由体系中新增一个 `dict` 分组和一个 `basic` 页面。页面本身使用静态业务数据配合真实字典组件与渲染器，分区展示默认 `detailCode` 匹配与 `value` 匹配两种模式，并通过最小测试覆盖路由注册和页面渲染。

**Tech Stack:** Vue 3、TypeScript、`@vben/common-ui`、ant-design-vue、vxe-table、Vitest、pnpm、Windows PowerShell

---

## 环境说明

- 终端环境：Windows PowerShell
- 前端项目根目录：`D:\IdeaWorkspaces\vue-vben-admin`
- 包管理器：`pnpm`
- 测试命令风格：`cmd /c pnpm vitest run ... --dom`

## 文件结构与职责

### 计划创建或修改的文件

- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\router\routes\modules\examples.ts`
  - 新增 `Examples -> Dict -> Basic` 路由节点
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\basic.vue`
  - 字典示例主页面
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\data.ts`
  - 示例页静态表格数据与列配置
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\locales\langs\zh-CN\examples.json`
  - 补充字典示例中文文案
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\locales\langs\en-US\examples.json`
  - 补充字典示例英文文案
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\__tests__\basic.test.ts`
  - 覆盖页面基础渲染与关键示例区块
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\router\routes\modules\__tests__\examples-dict.test.ts`
  - 覆盖新路由节点注册

---

## Chunk 1: 路由与文案

### Task 1: 为字典示例补路由失败测试

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\router\routes\modules\__tests__\examples-dict.test.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\router\routes\modules\examples.ts`

- [ ] **Step 1: 写失败测试，约束 `Examples -> Dict -> Basic` 路由存在**

```ts
it('registers the dict basic example route under examples', async () => {
  const dictRoute = findRouteByName(routes, 'DictExample');
  const basicRoute = findRouteByName(routes, 'DictBasicExample');
  expect(dictRoute?.path).toBe('/examples/dict');
  expect(basicRoute?.path).toBe('/examples/dict/basic');
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/router/routes/modules/__tests__/examples-dict.test.ts --dom`
Expected: FAIL，提示 `DictExample` 或 `DictBasicExample` 不存在

- [ ] **Step 3: 新建最小路由测试文件**

```ts
import routes from '../examples';
```

- [ ] **Step 4: 再次运行测试，确认路由红灯稳定**

Run: `cmd /c pnpm vitest run playground/src/router/routes/modules/__tests__/examples-dict.test.ts --dom`
Expected: FAIL，失败点聚焦在缺少字典示例路由

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/router/routes/modules/__tests__/examples-dict.test.ts
git commit -m "test: add dict example route coverage"
```

### Task 2: 注册字典示例路由

**Files:**
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\router\routes\modules\examples.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\router\routes\modules\__tests__\examples-dict.test.ts`

- [ ] **Step 1: 保持测试不变，先运行确认当前仍然失败**

Run: `cmd /c pnpm vitest run playground/src/router/routes/modules/__tests__/examples-dict.test.ts --dom`
Expected: FAIL

- [ ] **Step 2: 在 `examples.ts` 中新增 `dict` 分组与 `basic` 子路由**

```ts
{
  name: 'DictExample',
  path: '/examples/dict',
  meta: {
    icon: 'mdi:book-open-variant-outline',
    title: $t('examples.dict.title'),
  },
  children: [
    {
      name: 'DictBasicExample',
      path: '/examples/dict/basic',
      component: () => import('#/views/examples/dict/basic.vue'),
      meta: {
        title: $t('examples.dict.basic'),
      },
    },
  ],
}
```

- [ ] **Step 3: 运行测试，确认路由注册通过**

Run: `cmd /c pnpm vitest run playground/src/router/routes/modules/__tests__/examples-dict.test.ts --dom`
Expected: PASS

- [ ] **Step 4: 检查新节点在 `Examples` 菜单中的位置合理，避免破坏现有排序**

Run: 手工阅读 `examples.ts`
Expected: `dict` 节点与现有示例分组风格一致

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/router/routes/modules/examples.ts playground/src/router/routes/modules/__tests__/examples-dict.test.ts
git commit -m "feat: add dict example route"
```

### Task 3: 补充字典示例文案

**Files:**
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\locales\langs\zh-CN\examples.json`
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\locales\langs\en-US\examples.json`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\router\routes\modules\__tests__\examples-dict.test.ts`

- [ ] **Step 1: 写失败测试，约束 `examples.dict.title` 与 `examples.dict.basic` 存在**

```ts
it('provides locale keys for dict example menu titles', () => {
  expect(zhExamples.dict.title).toBeDefined();
  expect(enExamples.dict.basic).toBeDefined();
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/router/routes/modules/__tests__/examples-dict.test.ts --dom`
Expected: FAIL，提示 `dict` 国际化字段不存在

- [ ] **Step 3: 在中英文 examples 文案中新增 `dict` 分组**

```json
"dict": {
  "title": "字典示例",
  "basic": "基础示例"
}
```

```json
"dict": {
  "title": "Dict",
  "basic": "Basic"
}
```

- [ ] **Step 4: 运行测试，确认文案键值通过**

Run: `cmd /c pnpm vitest run playground/src/router/routes/modules/__tests__/examples-dict.test.ts --dom`
Expected: PASS

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/locales/langs/zh-CN/examples.json playground/src/locales/langs/en-US/examples.json playground/src/router/routes/modules/__tests__/examples-dict.test.ts
git commit -m "feat: add dict example locale entries"
```

---

## Chunk 2: 字典示例页面

### Task 4: 为示例页写失败测试

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\__tests__\basic.test.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\basic.vue`

- [ ] **Step 1: 写失败测试，约束页面四个核心区块存在**

```ts
it('renders dict example sections', async () => {
  const wrapper = mount(DictBasicExample);
  expect(wrapper.text()).toContain('字典基础说明');
  expect(wrapper.text()).toContain('字典下拉示例');
  expect(wrapper.text()).toContain('字典文本与标签示例');
  expect(wrapper.text()).toContain('字典表格示例');
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/views/examples/dict/__tests__/basic.test.ts --dom`
Expected: FAIL，提示 `basic.vue` 不存在

- [ ] **Step 3: 新建最小页面测试文件**

```ts
import DictBasicExample from '../basic.vue';
```

- [ ] **Step 4: 再次运行测试，确认页面红灯稳定**

Run: `cmd /c pnpm vitest run playground/src/views/examples/dict/__tests__/basic.test.ts --dom`
Expected: FAIL，失败点聚焦在示例页面尚未实现

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/views/examples/dict/__tests__/basic.test.ts
git commit -m "test: add dict example page coverage"
```

### Task 5: 实现字典示例页静态数据与表格配置

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\data.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\__tests__\basic.test.ts`

- [ ] **Step 1: 写失败测试，约束表格示例数据同时覆盖 `detailCode` 与 `value`**

```ts
it('provides table rows for detailCode and value matching demos', () => {
  expect(dictDemoRows).toHaveLength(2);
  expect(dictDemoRows[0]).toMatchObject({
    statusByCode: 'enabled',
    statusByValue: '1',
  });
});
```

- [ ] **Step 2: 运行测试，确认失败原因正确**

Run: `cmd /c pnpm vitest run playground/src/views/examples/dict/__tests__/basic.test.ts --dom`
Expected: FAIL，提示 `dictDemoRows` 或相关导出不存在

- [ ] **Step 3: 新建数据文件，提供静态行数据与列配置**

```ts
export const dictDemoRows = [
  { id: 1, statusByCode: 'enabled', statusByValue: '1' },
  { id: 2, statusByCode: 'disabled', statusByValue: '0' },
];
```

- [ ] **Step 4: 运行测试，确认静态数据通过**

Run: `cmd /c pnpm vitest run playground/src/views/examples/dict/__tests__/basic.test.ts --dom`
Expected: PASS 或进入下一个失败断言

- [ ] **Step 5: 提交当前最小变更**

```bash
git add playground/src/views/examples/dict/data.ts playground/src/views/examples/dict/__tests__/basic.test.ts
git commit -m "feat: add dict example demo data"
```

### Task 6: 实现字典示例页面

**Files:**
- Create: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\basic.vue`
- Modify: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\data.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\__tests__\basic.test.ts`

- [ ] **Step 1: 保持测试不变，运行确认页面仍然失败**

Run: `cmd /c pnpm vitest run playground/src/views/examples/dict/__tests__/basic.test.ts --dom`
Expected: FAIL

- [ ] **Step 2: 用四个卡片区块实现单页示例**

```vue
<Page title="字典示例页" description="集中展示 DictSelect、DictText、DictTag 与表格字典列的标准接入方式">
  <Card title="字典基础说明">...</Card>
  <Card title="字典下拉示例">...</Card>
  <Card title="字典文本与标签示例">...</Card>
  <Card title="字典表格示例">...</Card>
</Page>
```

- [ ] **Step 3: 在页面中接入以下真实能力**

```vue
<DictSelect dict-code="enabled" />
<DictSelect dict-code="enabled" match-field="value" />
<DictText dict-code="enabled" value="enabled" />
<DictTag dict-code="enabled" value="enabled" />
```

- [ ] **Step 4: 用 `useVbenVxeGrid` 或项目现有表格方式接入 `CellDictText` / `CellDictTag`**

```ts
columns: [
  { field: 'statusByCode', cellRender: { name: 'CellDictText', props: { dictCode: 'enabled' } } },
  { field: 'statusByValue', cellRender: { name: 'CellDictTag', props: { dictCode: 'enabled', matchField: 'value' } } },
]
```

- [ ] **Step 5: 运行测试，确认页面基础渲染通过**

Run: `cmd /c pnpm vitest run playground/src/views/examples/dict/__tests__/basic.test.ts --dom`
Expected: PASS

- [ ] **Step 6: 提交当前最小变更**

```bash
git add playground/src/views/examples/dict/basic.vue playground/src/views/examples/dict/data.ts playground/src/views/examples/dict/__tests__/basic.test.ts
git commit -m "feat: add dict example page"
```

---

## Chunk 3: 统一验证

### Task 7: 运行示例相关验证

**Files:**
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\router\routes\modules\__tests__\examples-dict.test.ts`
- Test: `D:\IdeaWorkspaces\vue-vben-admin\playground\src\views\examples\dict\__tests__\basic.test.ts`

- [ ] **Step 1: 运行新增示例相关单测**

Run: `cmd /c pnpm vitest run playground/src/router/routes/modules/__tests__/examples-dict.test.ts playground/src/views/examples/dict/__tests__/basic.test.ts --dom`
Expected: PASS

- [ ] **Step 2: 回归字典基础设施已有单测**

Run: `cmd /c pnpm vitest run playground/src/components/dict/__tests__/use-dict-store.test.ts playground/src/components/dict/__tests__/use-dict.test.ts playground/src/components/dict/__tests__/dict-components.test.ts playground/src/adapter/__tests__/dict-renderer.test.ts --dom`
Expected: PASS

- [ ] **Step 3: 运行 `playground` 类型校验**

Run: `cmd /c pnpm -F @vben/playground exec vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 4: 提交最终实现**

```bash
git add playground/src/router/routes/modules/examples.ts playground/src/views/examples/dict playground/src/locales/langs/zh-CN/examples.json playground/src/locales/langs/en-US/examples.json playground/src/router/routes/modules/__tests__/examples-dict.test.ts
git commit -m "feat: add dict usage demo page"
```

---

## 备注

- 页面文案、说明、注释统一使用中文。
- 示例页优先展示“标准接入方式”，不要为了演示而加入额外抽象。
- 若 `basic.vue` 体量过大，可将表格数据与列配置抽到 `data.ts`，但不要过度拆分。
- 示例页使用静态业务数据，不新增真实业务接口依赖。

Plan complete and saved to `docs/superpowers/plans/2026-03-20-dict-demo-implementation.md`. Ready to execute?
