// lib/constants/z-index.ts

export const Z_INDEX = {
    // === 0-9: 基础层 ===
    BACKGROUND: 0,
    DEFAULT: 1,

    // === 10-39: 页面内容层 ===
    CONTENT: 10,
    STICKY: 30, // 比如页面内的吸顶标题

    // === 40-99: 顶部导航体系 (Header System) ===
    NOTICE: 40,          // 最底层：公告栏 (必须比导航低)
    NAVIGATION: 50,      // 中间层：导航栏主体 (必须压住 Notice)
    DROPDOWN: 60,        // 最上层：PC端下拉菜单 (必须压住导航栏主体)

    // === 100-199: 遮罩与弹窗体系 (Overlay System) ===
    OVERLAY: 100,        // 黑色半透明遮罩 (必须盖住导航栏)
    DRAWER: 110,         // 侧滑抽屉：移动端菜单、购物车、筛选器 (必须在遮罩之上)
    MODAL: 120,          // 居中弹窗：登录框、搜索框

    // === 900+: 强制最高层 ===
    AGE_VERIFICATION: 900, // 年龄验证 (必须盖住一切，除了 Toast)
    TOAST: 999,            // 全局提示 (成功/失败消息)
    MAX: 9999              // 调试或极端情况
} as const;