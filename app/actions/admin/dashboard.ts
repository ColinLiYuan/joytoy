// app/actions/admin/dashboard.ts
'use server'

import { ADMIN_CONFIG } from '@/lib/api-config'
import { getToken } from '@/lib/token-utils'

export interface DashboardStats {
    todaySales: number
    totalOrders: number
    totalProducts: number
    totalUsers: number
    salesChange: string
    ordersChange: string
    productsChange: string
    usersChange: string
}

export interface RecentOrder {
    id: string
    customer: string
    amount: number
    status: string
    date: string
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const token = await getToken()
        const baseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:9356'
        
        // 并行获取所有统计数据
        const [ordersRes, productsRes, usersRes] = await Promise.all([
            fetch(`${baseUrl}/api/admin/V1/order/list?page=0&size=1000`, {
                cache: 'no-store',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }),
            fetch(`${baseUrl}/api/admin/V1/product/list?page=0&size=1000`, {
                cache: 'no-store',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }),
            fetch(`${baseUrl}/api/admin/V1/user/list?page=0&size=1000`, {
                cache: 'no-store',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
        ])

        const ordersData = await ordersRes.json()
        const productsData = await productsRes.json()
        const usersData = await usersRes.json()

        // 计算统计数据
        const orders = ordersData.success ? ordersData.data.content || [] : []
        const products = productsData.success ? productsData.data.content || [] : []
        const users = usersData.success ? usersData.data.content || [] : []

        // 计算今日销售额
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayOrders = orders.filter((order: any) => {
            const orderDate = new Date(order.createdAt)
            return orderDate >= today
        })
        
        const todaySales = todayOrders.reduce((sum: number, order: any) => {
            return sum + (order.totalAmount || 0)
        }, 0)

        // 模拟增长率（实际应该对比昨天/上周的数据）
        const stats: DashboardStats = {
            todaySales,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalUsers: users.length,
            salesChange: '+12%',
            ordersChange: '+8%',
            productsChange: '+3%',
            usersChange: '+5%'
        }

        return stats
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        // 返回默认值
        return {
            todaySales: 0,
            totalOrders: 0,
            totalProducts: 0,
            totalUsers: 0,
            salesChange: '+0%',
            ordersChange: '+0%',
            productsChange: '+0%',
            usersChange: '+0%'
        }
    }
}

export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    try {
        const token = await getToken()
        const baseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:9356'
        
        const response = await fetch(`${baseUrl}/api/admin/V1/order/list?page=0&size=${limit}`, {
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        
        if (!data.success || !data.data?.content) {
            return []
        }

        return data.data.content.map((order: any) => ({
            id: `#${order.orderNumber || order.id}`,
            customer: `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim() || '未知客户',
            amount: order.totalAmount || 0,
            status: order.status || '待处理',
            date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('zh-CN') : '-'
        }))
    } catch (error) {
        console.error('Error fetching recent orders:', error)
        return []
    }
}
