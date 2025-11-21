// lib/constants/z-index.ts
export const Z_INDEX = {
    // 基础内容
    BACKGROUND: 0,
    DEFAULT: 1,
    CONTENT: 10,

    // 交互元素
    DROPDOWN: 20,
    STICKY: 30,

    // 遮罩层 - 所有遮罩使用同一层级
    OVERLAY: 40,

    // 在遮罩层之上的内容
    NAVIGATION: 45,      // 导航栏在遮罩层之上
    NOTICE: 45,
    MODAL: 50,           // 模态框在导航之上

    // 最高层级
    TOAST: 60,
    MAX: 9999
} as const;