import { describe, expect, it } from 'vitest';

import enExamples from '#/locales/langs/en-US/examples.json';
import zhExamples from '#/locales/langs/zh-CN/examples.json';

import routes from '../examples';

function findRouteByName(items: any[], name: string): any {
  for (const item of items) {
    if (item.name === name) {
      return item;
    }

    if (item.children) {
      const matched = findRouteByName(item.children, name);
      if (matched) {
        return matched;
      }
    }
  }

  return null;
}

describe('examples dict route', () => {
  it('registers the dict basic example route under examples', () => {
    const dictRoute = findRouteByName(routes, 'DictExample');
    const basicRoute = findRouteByName(routes, 'DictBasicExample');

    expect(dictRoute?.path).toBe('/examples/dict');
    expect(basicRoute?.path).toBe('/examples/dict/basic');
  });

  it('provides locale keys for dict example menu titles', () => {
    expect(zhExamples.dict.title).toBeDefined();
    expect(zhExamples.dict.basic).toBeDefined();
    expect(enExamples.dict.title).toBeDefined();
    expect(enExamples.dict.basic).toBeDefined();
  });
});
