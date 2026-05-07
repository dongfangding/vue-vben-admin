import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchDictOptionsByCode } from '#/api/system/dict';

import DictSelect from '../dict-select.vue';
import DictTag from '../dict-tag.vue';
import DictText from '../dict-text.vue';
import { clearDictCache } from '../use-dict';

vi.mock('#/api/system/dict', () => ({
  fetchDictOptionsByCode: vi.fn(),
}));

const mockedFetchDictOptionsByCode = vi.mocked(fetchDictOptionsByCode);

describe('dict components', () => {
  beforeEach(() => {
    clearDictCache();
    mockedFetchDictOptionsByCode.mockReset();
    mockedFetchDictOptionsByCode.mockResolvedValue([
      {
        detailCode: 'enabled',
        dictCode: 'enabled',
        dictId: 1,
        dictSort: 1,
        label: '启用',
        value: '1',
      },
      {
        detailCode: 'disabled',
        dictCode: 'enabled',
        dictId: 1,
        dictSort: 0,
        label: '禁用',
        value: '0',
      },
    ]);
  });

  it('renders dict label and falls back to raw value when item is missing', async () => {
    const wrapper = mount(DictText, {
      props: {
        dictCode: 'enabled',
        value: 'enabled',
      },
    });

    await flushPromises();
    expect(wrapper.text()).toContain('启用');

    await wrapper.setProps({
      value: 'unknown',
    });
    await flushPromises();
    expect(wrapper.text()).toContain('unknown');
  });

  it('renders dict tag label', async () => {
    const wrapper = mount(DictTag, {
      props: {
        dictCode: 'enabled',
        value: 'disabled',
      },
    });

    await flushPromises();
    expect(wrapper.text()).toContain('禁用');
  });

  it('emits optionsChange and uses detailCode as default option value', async () => {
    const wrapper = mount(DictSelect, {
      props: {
        dictCode: 'enabled',
      },
    });

    await flushPromises();

    const emittedOptions = wrapper.emitted('optionsChange') ?? [];

    expect(emittedOptions.at(-1)?.[0]).toEqual([
      {
        label: '启用',
        value: 'enabled',
      },
      {
        label: '禁用',
        value: 'disabled',
      },
    ]);
  });

  it('supports value/update:value contract used by form adapter', async () => {
    const wrapper = mount(DictSelect, {
      props: {
        dictCode: 'enabled',
        value: 'enabled',
      },
    });

    await flushPromises();

    await wrapper.findComponent({ name: 'ASelect' }).vm.$emit('update:value', 'disabled');

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['disabled']);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['disabled']);
  });
});
