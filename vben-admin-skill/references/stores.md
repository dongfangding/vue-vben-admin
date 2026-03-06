# 状态管理参考

## Stores 目录

状态管理使用 Pinia，核心 stores 位于 `packages/stores/src/modules/`

## useAccessStore - 权限存储

```typescript
import { useAccessStore } from '@vben/stores';

// 创建实例
const accessStore = useAccessStore();

// 状态
accessStore.accessToken;        // 访问令牌
accessStore.refreshToken;       // 刷新令牌
accessStore.accessCodes;        // 权限码
accessStore.accessMenus;        // 菜单权限
accessStore.accessRoutes;       // 路由权限
accessStore.isAccessChecked;   // 权限检查完成
accessStore.isLockScreen;      // 是否锁屏
accessStore.loginExpired;       // 登录过期

// 方法
accessStore.setAccessToken(token);           // 设置 Token
accessStore.setRefreshToken(token);          // 设置刷新 Token
accessStore.setAccessCodes(codes);           // 设置权限码
accessStore.setAccessMenus(menus);           // 设置菜单
accessStore.setAccessRoutes(routes);         // 设置路由
accessStore.lockScreen(password);            // 锁屏
accessStore.unlockScreen(password);          // 解锁
accessStore.clearAccessToken();               // 清除 Token
```

## useUserStore - 用户存储

```typescript
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();

// 状态
userStore.userInfo;           // 用户信息
userStore.accessToken;        // 访问令牌

// 方法
// 登录
await userStore.authLogin({
  username: 'admin',
  password: '123456',
  code: '1234',           // 验证码（如需要）
  uuid: 'xxx',            // 验证码ID（如需要）
});

// 登出
await userStore.logout();

// 获取用户信息
await userStore.fetchUserInfo();

// 更新用户信息
await userStore.updateUserInfo(data);

// 修改密码
await userStore.updatePassword({
  oldPassword: 'old123',
  newPassword: 'new123',
});
```

## useTabbarStore - 标签页存储

```typescript
import { useTabbarStore } from '@vben/stores';

const tabbarStore = useTabbarStore();

// 状态
tabbarStore.tabs;           // 标签页列表
tabbarStore.cachedTabs;     // 缓存的标签页

// 方法
// 添加标签页
tabbarStore.addTab({
  name: 'Dashboard',
  path: '/dashboard',
  title: '仪表盘',
  icon: 'lucide:layout-dashboard',
  keepAlive: true,
});

// 关闭标签页
tabbarStore.closeTab(tab, router);

// 关闭所有
tabbarStore.closeAllTabs(router);

// 关闭左侧
tabbarStore.closeLeftTabs(tab);

// 关闭右侧
tabbarStore.closeRightTabs(tab);

// 关闭其他
tabbarStore.closeOtherTabs(tab);

// 刷新
tabbarStore.refresh(router);

// 固定
tabbarStore.pinTab(tab);
tabbarStore.unpinTab(tab);

// 排序
tabbarStore.sortTabs(oldIndex, newIndex);
```

## auth.ts 认证

项目在 `playground/src/store/auth.ts` 封装了认证逻辑：

```typescript
import { auth } from '@/store/auth';

// 登录
await auth.login(
  { username: 'admin', password: '123456' },
  () => {
    // 登录成功回调
    router.push('/');
  }
);

// 登出
await auth.logout();

// 获取用户信息
await auth.fetchUserInfo();
```

## 本地缓存

项目提供了缓存工具：

```typescript
import { Local, Session } from '@vben-core/shared/cache';

// Local 存储（持久化）
Local.get('key');
Local.set('key', 'value');
Local.remove('key');
Local.clear();

// Session 存储（会话级）
Session.get('key');
Session.set('key', 'value');
Session.remove('key');
Session.clear();
```

## 状态持久化

Token 等敏感信息会自动处理持久化，无需手动存储。

## 使用示例：需要登录才能访问的页面

```typescript
import { useAccessStore } from '@vben/stores';
import { useUserStore } from '@vben/stores';
import { router } from '@/router';

const accessStore = useAccessStore();
const userStore = useUserStore();

// 检查是否已登录
if (!accessStore.accessToken) {
  // 跳转登录
  router.push('/login');
  throw new Error('请先登录');
}

// 获取用户信息
if (!userStore.userInfo) {
  await userStore.fetchUserInfo();
}
```
