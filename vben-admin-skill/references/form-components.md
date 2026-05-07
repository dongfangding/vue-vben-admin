# 表单组件参考

## 基础用法

### useVbenForm

```typescript
import { useVbenForm } from '@vben-core/form-ui';

const [Form, formApi] = useVbenForm({
  // 通用配置
  commonConfig: {
    // 标签宽度
    labelWidth: 120,
    // 组件通用属性
    componentProps: {
      placeholder: '请输入',
      style: { width: '100%' },
    },
  },
  // 表单布局
  layout: 'grid',
  // 提交按钮
  showActions: true,
  // 重置按钮
  showResetButton: true,
  // 表单字段定义
  schema: [
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
      // 校验规则
      rules: 'required',
      // 组件属性
      componentProps: {
        prefix: 'lucide:user',
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'gender',
      label: '性别',
      componentProps: {
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'birthday',
      label: '生日',
      componentProps: {
        type: 'date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'dateRange',
      label: '日期范围',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'age',
      label: '年龄',
      componentProps: {
        min: 0,
        max: 150,
      },
    },
    {
      component: 'Switch',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        checkedValue: 1,
        unCheckedValue: 0,
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'type',
      label: '类型',
      componentProps: {
        options: [
          { label: '类型A', value: 'a' },
          { label: '类型B', value: 'b' },
        ],
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'hobbies',
      label: '爱好',
      componentProps: {
        options: [
          { label: '篮球', value: 'basketball' },
          { label: '足球', value: 'football' },
          { label: '游泳', value: 'swimming' },
        ],
      },
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        rows: 3,
      },
    },
    {
      component: 'TreeSelect',
      fieldName: 'deptId',
      label: '部门',
      componentProps: {
        data: [
          {
            label: '总部',
            value: '1',
            children: [
              { label: '研发部', value: '1-1' },
              { label: '运营部', value: '1-2' },
            ],
          },
        ],
      },
    },
    {
      component: 'Upload',
      fieldName: 'avatar',
      label: '头像',
      componentProps: {
        accept: 'image/*',
        maxCount: 1,
      },
    },
  ],
});

// 获取表单值
const formValues = formApi.getValues();
// 设置表单值
formApi.setValues({ username: 'admin' });
// 校验表单
const valid = await formApi.validate();
// 提交表单
const data = await formApi.submit();
// 重置表单
formApi.resetForm();
```

## 支持的组件类型

| 组件名 | 说明 |
|--------|------|
| Input | 单行文本输入 |
| InputPassword | 密码输入 |
| InputNumber | 数字输入 |
| Textarea | 多行文本 |
| Select | 下拉选择 |
| TreeSelect | 树形选择 |
| Radio | 单选 |
| RadioGroup | 单选组 |
| Checkbox | 复选 |
| CheckboxGroup | 复选组 |
| Switch | 开关 |
| DatePicker | 日期选择 |
| RangePicker | 日期范围 |
| TimePicker | 时间选择 |
| TimeRangePicker | 时间范围 |
| Upload | 文件上传 |
| Cascader | 级联选择 |

## 表单布局

```typescript
// 栅格布局
const [Form] = useVbenForm({
  layout: 'grid',
  gridConfig: {
    cols: 2, // 2列
    // 或使用响应式
    cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  },
});

// 垂直布局
const [Form] = useVbenForm({
  layout: 'vertical',
});
```

## 动态表单

```typescript
const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Select',
      fieldName: 'type',
      label: '类型',
      componentProps: {
        options: [
          { label: '类型A', value: 'a' },
          { label: '类型B', value: 'b' },
        ],
      },
    },
    // 动态字段 - 根据 type 显示不同字段
    {
      component: 'Input',
      fieldName: 'fieldA',
      label: '字段A',
      vif: (values) => values.type === 'a',
    },
    {
      component: 'Input',
      fieldName: 'fieldB',
      label: '字段B',
      vif: (values) => values.type === 'b',
    },
  ],
});
```

## 表单操作

```typescript
// 提交前处理
const [Form, formApi] = useVbenForm({
  handleSubmit: async (values) => {
    console.log('提交数据:', values);
    // 可以在这里添加 loading 状态
    return true; // 返回 true 表示成功
  },
});

// 重置前处理
const [Form, formApi] = useVbenForm({
  handleReset: async () => {
    console.log('重置表单');
  },
});
```
