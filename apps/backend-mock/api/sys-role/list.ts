import { faker } from '@faker-js/faker';
import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { getMenuIds, MOCK_MENU_LIST } from '~/utils/mock-data';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const menuIds = getMenuIds(MOCK_MENU_LIST);

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function generateMockDataList(count: number) {
  const dataList = [];

  for (let i = 0; i < count; i++) {
    const createDate = faker.date.between({
      from: '2022-01-01',
      to: '2025-01-01',
    });
    const updateDate = faker.date.between({
      from: createDate,
      to: '2025-01-01',
    });
    const dataItem: Record<string, any> = {
      roleId: i + 1,
      name: faker.commerce.product(),
      enabled: faker.datatype.boolean(),
      createTime: Math.floor(createDate.getTime() / 1000),
      updateTime: Math.floor(updateDate.getTime() / 1000),
      formatCreateTime: formatDate(createDate),
      formatUpdateTime: formatDate(updateDate),
      description: faker.lorem.sentence(),
      level: faker.number.int({ max: 10, min: 1 }),
      ipLimit: '',
      sort: faker.number.int({ max: 100, min: 1 }),
      isAdmin: faker.datatype.boolean(),
      createBy: faker.person.fullName(),
      updateBy: faker.person.fullName(),
      menuIds: faker.helpers.arrayElements(menuIds),
    };

    dataList.push(dataItem);
  }

  return dataList;
}

const mockData = generateMockDataList(100);

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const {
    pageNum = 1,
    pageSize = 20,
    name,
    roleId,
    description,
    startTime,
    endTime,
    enabled,
  } = getQuery(event);
  let listData = structuredClone(mockData);
  if (name) {
    listData = listData.filter((item) =>
      item.name.toLowerCase().includes(String(name).toLowerCase()),
    );
  }
  if (roleId) {
    listData = listData.filter((item) =>
      String(item.roleId).includes(String(roleId)),
    );
  }
  if (description) {
    listData = listData.filter((item) =>
      item.description
        ?.toLowerCase()
        ?.includes(String(description).toLowerCase()),
    );
  }
  if (startTime) {
    listData = listData.filter((item) => item.createTime >= startTime);
  }
  if (endTime) {
    listData = listData.filter((item) => item.createTime <= endTime);
  }
  if (['false', 'true'].includes(enabled as string)) {
    listData = listData.filter((item) => item.enable === (enabled === 'true'));
  }
  return usePageResponseSuccess(
    pageNum as string,
    pageSize as string,
    listData,
  );
});
