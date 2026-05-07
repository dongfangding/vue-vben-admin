import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@vben/common-ui', async () => {
  const { defineComponent } = await import('vue');

  return {
    Page: defineComponent({
      name: 'PageStub',
      props: ['description', 'title'],
      template:
        '<section><h1>{{ title }}</h1><p>{{ description }}</p><slot /></section>',
    }),
  };
});

vi.mock('#/adapter/form', async () => {
  const { defineComponent } = await import('vue');

  return {
    useVbenForm: vi.fn(() => [
      defineComponent({
        name: 'DemoFormStub',
        template: '<div data-test="demo-form">DemoForm</div>',
      }),
      {},
    ]),
  };
});

vi.mock('#/adapter/vxe-table', async () => {
  const { defineComponent } = await import('vue');

  return {
    useVbenVxeGrid: vi.fn(() => [
      defineComponent({
        name: 'DemoGridStub',
        template: '<div data-test="demo-grid">DemoGrid</div>',
      }),
      {},
    ]),
  };
});

vi.mock('#/components/dict', async () => {
  const { defineComponent } = await import('vue');

  return {
    DictSelect: defineComponent({
      name: 'DictSelectStub',
      template: '<div class="dict-select-stub">DictSelect</div>',
    }),
    DictTag: defineComponent({
      name: 'DictTagStub',
      props: ['value'],
      template: '<span class="dict-tag-stub">{{ value }}</span>',
    }),
    DictText: defineComponent({
      name: 'DictTextStub',
      props: ['value'],
      template: '<span class="dict-text-stub">{{ value }}</span>',
    }),
  };
});

describe('dict basic demo page', () => {
  it('renders schema, template, and grid demo sections', async () => {
    const { default: DictBasicExample } = await import('../basic.vue');
    const wrapper = mount(DictBasicExample);

    expect(wrapper.text()).toContain('字典基础示例');
    expect(wrapper.text()).toContain('表单 Schema 接入');
    expect(wrapper.text()).toContain('模板组件渲染');
    expect(wrapper.text()).toContain('表格列渲染');
    expect(wrapper.text()).toContain('CellDictText');
    expect(wrapper.find('[data-test="demo-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="demo-grid"]').exists()).toBe(true);
  });
});
