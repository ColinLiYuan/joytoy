'use client'

import { useAuth } from '@/contexts/authContext'

/**
 * 权限检查 Hook
 *
 * 使用方式：
 * const { canEdit, canDelete, isOperator, isAdmin, isSuperAdmin } = usePermission()
 *
 * 角色权限层级：
 * - SUPER_ADMIN: 全部权限（含管理其他管理员）
 * - ADMIN: 增删改查
 * - OPERATOR: 只读 + 部分写入（订单状态变更、评论审核、库存管理）
 * - CUSTOMER: 无后台权限
 */
export function usePermission() {
    const { userInfo } = useAuth()
    const role = userInfo?.role

    const isSuperAdmin = role === 'SUPER_ADMIN'
    const isAdmin = role === 'ADMIN' || isSuperAdmin
    const isOperator = role === 'OPERATOR'

    // OPERATOR 只能查看，不能增删改（订单和评论除外）
    const canEdit = isAdmin || isSuperAdmin   // 编辑/新增/删除
    const canDelete = isAdmin || isSuperAdmin // 删除
    const canManageUsers = isAdmin || isSuperAdmin // 用户管理

    return {
        role,
        isSuperAdmin,
        isAdmin,
        isOperator,
        canEdit,
        canDelete,
        canManageUsers,
    } as const
}
