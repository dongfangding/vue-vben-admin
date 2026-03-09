# 布局组件参考

## 基础布局

项目使用 `VbenLayout` 作为根布局组件：

```vue
<script setup lang="ts">
import { VbenLayout } from '@vben-core/layout-ui';
import LayoutHeader from '@vben-core/layout-ui/src/components/layout-header.vue';
import LayoutSidebar from '@vben-core/layout-ui/src/components/layout-sidebar.vue';
import LayoutContent from '@vben-core/layout-ui/src/components/layout-content.vue';
import LayoutFooter from '@vben-core/layout-ui/src/components/layout-footer.vue';
</script>

<template>
  <VbenLayout>
    <LayoutHeader>头部内容</LayoutHeader>
    <LayoutSidebar>侧边栏</LayoutSidebar>
    <LayoutContent>主内容</LayoutContent>
    <LayoutFooter>底部</LayoutFooter>
  </VbenLayout>
</template>
```

## useLayout Hook

```typescript
import { useLayout } from '@vben-core/layout-ui';

const {
  // 布局模式
  layout,
  // 侧边栏状态
  siderVisible,
  // 侧边栏折叠
  siderCollapsed,
  // 切换侧边栏
  toggleSider,
  // 切换移动端侧边栏
  toggleMobileSider,
} = useLayout();
```

## 侧边栏配置

```typescript
// 在页面中使用
const { siderCollapsed, toggleSider } = useLayout();

<template>
  <Button @click="toggleSider">
    <Icon :icon="siderCollapsed ? 'lucide:menu' : 'lucide:panel-left-close'" />
  </Button>
</template>
```

## 标签页组件

```vue
<script setup lang="ts">
import LayoutTabbar from '@vben-core/layout-ui/src/components/layout-tabbar.vue';
</script>

<template>
  <LayoutTabbar />
</template>
```

## Header 头部

```vue
<script setup lang="ts">
import LayoutHeader from '@vben-core/layout-ui/src/components/layout-header.vue';
</script>

<template>
  <LayoutHeader>
    <template #left>
      <!-- 左侧内容 -->
    </template>
    <template #right>
      <!-- 右侧内容，如用户信息、设置等 -->
    </template>
  </LayoutHeader>
</template>
```

## Breadcrumb 面包屑

```vue
<script setup lang="ts">
import { Breadcrumb } from '@vben-core/shadcn-ui';
</script>

<template>
  <Breadcrumb />
</template>
```

## Content 内容区域

```vue
<script setup lang="ts">
import { useContentMaximize } from '@vben-core/hooks';

const { isMaximized, toggleMaximize } = useContentMaximize();
</script>

<template>
  <div class="content-wrapper">
    <div class="content-header">
      <Button @click="toggleMaximize">
        <Icon :icon="isMaximized ? 'lucide:minimize' : 'lucide:maximize'" />
      </Button>
    </div>
    <LayoutContent>
      <router-view />
    </LayoutContent>
  </div>
</template>
```

## FullScreen 全屏

```vue
<script setup lang="ts">
import { FullScreen } from '@vben-core/shadcn-ui';
</script>

<template>
  <FullScreen />
</template>
```
