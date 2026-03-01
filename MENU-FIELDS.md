# 菜单后端接口字段说明

本文档详细说明前端动态菜单树接口的每个字段含义，帮助后端开发人员正确返回菜单数据。

---

## 接口说明

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取菜单列表 | GET | `/menu/list` 或 `/sys-menu/menu/list` |
| 创建菜单 | POST | `/system/menu` |
| 更新菜单 | PUT | `/system/menu/{id}` |
| 删除菜单 | DELETE | `/system/menu/{id}` |

---

## 菜单数据结构

```json
{
  "id": "1001",
  "pid": "0",
  "name": "SystemUser",
  "path": "/system/user",
  "type": "menu",
  "component": "/system/user/list",
  "permission": "sys:user:list",
  "meta": {
    "title": "用户管理",
    "icon": "mdi:user",
    "order": 1,
    "keepAlive": true,
    "hideInMenu": false
  },
  "children": []
}
```

---

## 字段详解

### 一、基础字段

| 字段 | 类型 | 必填 | 说明 | 后端示例 |
|------|------|------|------|----------|
| **id** | string | 是 | 菜单唯一标识 | `"1001"` |
| **pid** | string | 是 | 父级菜单 ID，根菜单为 `"0"` | `"0"`, `"1001"` |
| **name** | string | 是 | 路由名称（Vue Router） | `"SystemUser"` |
| **path** | string | 是 | 路由路径（URL 地址栏显示的路径） | `"/system/user"` |
| **type** | string | 是 | 菜单类型 | 见下表 |

---

### 二、菜单类型 (type)

| 类型值 | 说明 | 是否生成路由 | 示例 |
|--------|------|-------------|------|
| `catalog` | 目录（父级菜单） | 否 | 系统管理 |
| `menu` | 菜单（具体页面） | 是 | 用户列表 |
| `button` | 按钮（无页面） | 否 | 新增、编辑、删除 |
| `link` | 外链（跳转外部 URL） | 是 | 官网文档 |
| `embedded` | 内嵌（iframe 嵌入） | 是 | 内部系统 |

---

### 三、component 组件路径 ⭐最重要

**作用**：指定菜单对应的 Vue 组件路径

**转换规则**：

```
前端组件路径:  #/views/system/user/list.vue
后端应返回:   "/system/user/list"
              ↓
            去掉 /views/ 前缀和 .vue 后缀
```

| 前端静态路由写法 | 后端应返回的 component |
|----------------|----------------------|
| `component: () => import('#/views/system/user/list.vue')` | `"/system/user/list"` |
| `component: () => import('#/views/dashboard/workspace/index.vue')` | `"/dashboard/workspace/index"` |
| `component: IFrameView`（外链组件） | `"IFrameView"` |

**注意**：如果 component 错误，前端控制台会报错：
```
route component is invalid: /system/user/list
```

---

### 四、元数据字段 (meta)

#### 1. 显示相关

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| **title** | string | 菜单显示标题 | `"用户管理"` |
| **icon** | string | 菜单图标（Iconify 格式） | `"mdi:user"`, `"ion:settings"` |
| **activeIcon** | string | 激活状态图标 | `"mdi:user-fill"` |
| **order** | number | 菜单排序（数字越小越靠前） | `1`, `2`, `3` |
| **badge** | string | 徽标内容 | `"99+"`, `"new"` |
| **badgeType** | string | 徽标类型 | `"dot"` 红点, `"normal"` 文字 |
| **badgeVariants** | string | 徽标颜色 | `"primary"`, `"success"`, `"warning"`, `"destructive"` |

**图标对应**：使用 [Iconify](https://icon-sets.iconify.design/) 图标库

---

#### 2. 隐藏控制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| **hideInMenu** | boolean | `false` | 在左侧菜单中隐藏 |
| **hideInTab** | boolean | `false` | 在顶部标签栏中隐藏 |
| **hideInBreadcrumb** | boolean | `false` | 在面包屑中隐藏 |
| **hideChildrenInMenu** | boolean | `false` | 在菜单中隐藏子级（目录类型用） |

---

#### 3. 路由行为

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| **keepAlive** | boolean | 页面缓存（切换标签不刷新） | `true` |
| **affixTab** | boolean | 固定在标签栏（不可关闭） | `true` |
| **openInNewWindow** | boolean | 新窗口打开 | `true` |
| **activePath** | string | 激活路径（高亮菜单） | `"/user/list"` |
| **redirect** | string | 默认重定向路径 | `"/user/list"` |

---

#### 4. 外链相关

| 字段 | 用于类型 | 说明 | 示例 |
|------|---------|------|------|
| **link** | `link` | 外链 URL | `"https://vben.pro"` |
| **iframeSrc** | `embedded` | iframe 嵌入的 URL | `"/internal/xxx"` |

---

### 五、权限字段

#### permission - 后端权限标识

**作用**：按钮级权限控制

**前端使用方式**：

```vue
<!-- 方式1：指令方式 -->
<Button v-has="'sys:user:add'">新增</Button>

<!-- 方式2：函数方式 -->
<Button v-if="hasAccessByCodes(['sys:user:add'])">新增</Button>
```

---

## path 路径详解

### path 就是 URL 地址栏显示的路径

```
浏览器地址栏: http://localhost:5173/system/user
               ↓
path:         /system/user
```

### 不同类型的 path 写法

| 类型 | path 写法 | 示例 |
|------|----------|------|
| **catalog**（目录） | 以 `/` 开头 | `/system` |
| **menu**（页面） | 以 `/` 开头 | `/system/user` |
| **button**（按钮） | **空字符串** | `""` |
| **link**（外链） | 以 `/` 开头 | `/external` |
| **embedded**（内嵌） | 以 `/` 开头 | `/iframe/xxx` |

### 路径层级规则

```
一级目录:  pid: "0",        path: "/system"
二级菜单:  pid: "1001",     path: "/system/user"
三级按钮: pid: "1002",     path: ""   <!-- 按钮为空 -->
```

---

## activePath 作用

**作用**：当访问某个子路由时，高亮指定的主菜单。

### 使用场景

当详情页不在左侧菜单中显示，但需要高亮父菜单时使用。

```
左侧菜单:
├── 用户管理 (path: /system/user, activePath: /system/user/***)

访问 /system/user/100 时：
- path 是 /system/user/100，匹配不到菜单
- 但 activePath 是 /system/user/***，能匹配上
- 所以"用户管理"菜单保持高亮
```

### 示例

```json
{
  "path": "/system/user",
  "meta": {
    "title": "用户管理",
    "activePath": "/system/user/detail"
  }
}
```

---

## 完整返回示例

```json
[
  {
    "id": "1001",
    "pid": "0",
    "name": "System",
    "path": "/system",
    "type": "catalog",
    "meta": {
      "title": "系统管理",
      "icon": "mdi:cog",
      "order": 1
    },
    "children": [
      {
        "id": "1002",
        "pid": "1001",
        "name": "SystemUser",
        "path": "/system/user",
        "type": "menu",
        "component": "/system/user/list",
        "permission": "sys:user:list",
        "meta": {
          "title": "用户管理",
          "icon": "mdi:account",
          "keepAlive": true
        },
        "children": [
          {
            "id": "1003",
            "pid": "1002",
            "name": "UserAdd",
            "path": "",
            "type": "button",
            "permission": "sys:user:add",
            "meta": {
              "title": "新增用户"
            }
          },
          {
            "id": "1004",
            "pid": "1002",
            "name": "UserEdit",
            "path": "",
            "type": "button",
            "permission": "sys:user:edit",
            "meta": {
              "title": "编辑用户"
            }
          },
          {
            "id": "1005",
            "pid": "1002",
            "name": "UserDelete",
            "path": "",
            "type": "button",
            "permission": "sys:user:delete",
            "meta": {
              "title": "删除用户"
            }
          }
        ]
      },
      {
        "id": "1006",
        "pid": "1001",
        "name": "SystemRole",
        "path": "/system/role",
        "type": "menu",
        "component": "/system/role/list",
        "meta": {
          "title": "角色管理",
          "icon": "mdi:account-group"
        }
      },
      {
        "id": "1007",
        "pid": "1001",
        "name": "ExternalDocs",
        "path": "/external/docs",
        "type": "link",
        "meta": {
          "title": "官方文档",
          "icon": "mdi:web",
          "link": "https://vben.pro"
        }
      }
    ]
  }
]
```

---

## 前后端字段对应表

| 前端写法 | 后端对应字段 | 说明 |
|---------|-------------|------|
| `name: 'SystemUser'` | `name` | 路由名称 |
| `path: '/system/user'` | `path` | 路由路径（URL 地址栏） |
| `component: () => import('#/views/system/user/list.vue')` | `component: "/system/user/list"` | 组件路径 |
| `meta: { icon: 'mdi:user' }` | `meta.icon: "mdi:user"` | 图标 |
| `meta: { title: '用户管理' }` | `meta.title: "用户管理"` | 标题 |
| `v-has="'sys:user:add'"` | `permission: "sys:user:add"` | 权限标识 |

---

## 注意事项

1. **path 必须以 `/` 开头**：一级和二级菜单都必须以 `/` 开头
2. **按钮 path 为空字符串**：`"path": ""`
3. **component 必须对应**：去掉 `/views/` 前缀和 `.vue` 后缀
4. **name 必须唯一**：不能重复
5. **tree 结构**：必须返回树形结构，包含 `children` 数组
