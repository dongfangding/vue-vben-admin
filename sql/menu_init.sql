-- 菜单数据初始化SQL
-- 根据后端返回格式生成
-- type: menu-菜单 catelog-目录 button-按钮
-- enable: bit(1) 类型 (1-启用 0-禁用)

INSERT INTO sys_menu (id, pid, name, permission, type, path, component, icon, enable, meta, title, create_time, update_time, sub_count) VALUES
-- Dashboard 目录 (id=1)
(1, 0, 'Dashboard', '', 'catalog', '/dashboard', NULL, '', b'1', '{"order": -1}', 'Dashboard', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 2),
-- Dashboard -> Analytics (id=101)
(101, 1, 'Analytics', '', 'menu', '/analytics', '/dashboard/analytics/index', '', b'1', '{"affixTab": true}', 'Analytics', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),
-- Dashboard -> Workspace (id=102)
(102, 1, 'Workspace', '', 'menu', '/workspace', '/dashboard/workspace/index', '', b'1', '{"affixTab": true}', 'Workspace', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),

-- System 系统目录 (id=2)
(2, 0, 'System', '', 'catalog', '/system', NULL, 'carbon:settings', b'1', '{"order": 9998, "badge": "new", "badgeType": "normal", "badgeVariants": "primary"}', 'System', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 2),
-- System -> 菜单管理 (id=201)
(201, 2, 'SystemMenu', 'System:Menu:List', 'menu', '/system/menu', '/system/menu/list', 'carbon:menu', b'1', '{}', '菜单管理', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 3),
-- 菜单管理 -> 新增按钮 (id=20101)
(20101, 201, 'SystemMenuCreate', 'System:Menu:Create', 'button', '', NULL, '', b'1', '{}', '新增', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),
-- 菜单管理 -> 编辑按钮 (id=20102)
(20102, 201, 'SystemMenuEdit', 'System:Menu:Edit', 'button', '', NULL, '', b'1', '{}', '编辑', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),
-- 菜单管理 -> 删除按钮 (id=20103)
(20103, 201, 'SystemMenuDelete', 'System:Menu:Delete', 'button', '', NULL, '', b'1', '{}', '删除', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),
-- System -> 部门管理 (id=202)
(202, 2, 'SystemDept', 'System:Dept:List', 'menu', '/system/dept', '/system/dept/list', 'carbon:container-services', b'1', '{}', '部门管理', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 3),
-- 部门管理 -> 新增按钮 (id=20201)
(20201, 202, 'SystemDeptCreate', 'System:Dept:Create', 'button', '', NULL, '', b'1', '{}', '新增', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),
-- 部门管理 -> 编辑按钮 (id=20202)
(20202, 202, 'SystemDeptEdit', 'System:Dept:Edit', 'button', '', NULL, '', b'1', '{}', '编辑', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),
-- 部门管理 -> 删除按钮 (id=20203)
(20203, 202, 'SystemDeptDelete', 'System:Dept:Delete', 'button', '', NULL, '', b'1', '{}', '删除', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),

-- Project 项目目录 (id=9)
(9, 0, 'Project', '', 'catalog', '/vben-admin', NULL, 'carbon:data-center', b'1', '{"order": 9998}', 'Project', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 3),
-- Project -> 文档 (id=901)
(901, 9, 'VbenDocument', '', 'menu', '/vben-admin/document', 'IFrameView', 'carbon:book', b'1', '{"iframeSrc": "https://doc.vben.pro"}', '文档', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),
-- Project -> Github (id=902)
(902, 9, 'VbenGithub', '', 'menu', '/vben-admin/github', 'IFrameView', 'carbon:logo-github', b'1', '{"link": "https://github.com/vbenjs/vue-vben-admin"}', 'Github', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),
-- Project -> AntDV (id=903, 禁用)
(903, 9, 'VbenAntdv', '', 'menu', '/vben-admin/antdv', 'IFrameView', 'carbon:hexagon-vertical-solid', b'0', '{"link": "https://ant.vben.pro", "badgeType": "dot"}', 'AntDV', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0),

-- About 关于 (id=10)
(10, 0, 'About', '', 'menu', '/about', '_core/about/index', 'lucide:copyright', b'1', '{"order": 9999}', '关于', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0);
