// app/admin/user/route.ts
'use client'

import { useState, useEffect } from 'react';
import authService from '@/services/authService';
import { UserResponse } from '@/types/auth'
import {
    Search,
    Filter,
    MoreHorizontal,
    UserCheck,
    UserX,
    Mail
} from 'lucide-react';

export default function AdminUserListPage() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await authService.adminList({
                page: currentPage,
                size: 10,
                status: status || undefined,
                keyword: keyword || undefined
            });
            setUsers(data.content);
            setTotalPages(data.totalPages);
            console.log('users: ', users)
        } catch (error) {
            console.error('Fetch users failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, status]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            </div>

            {/* 搜索栏与过滤器 */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by email, name or Affiliate ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                    />
                </div>
                <select
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="BANNED">Banned</option>
                </select>
            </div>

            {/* 用户列表表格 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                    <tr>
                        <th className="px-6 py-4">用户</th>
                        <th className="px-6 py-4">国家</th>
                        <th className="px-6 py-4">联盟ID</th>
                        <th className="px-6 py-4">创建时间</th>
                        <th className="px-6 py-4">上次登录时间</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {user.firstName?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            {/*<td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                        user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                                            user.status === 'BANNED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {user.status}
                                    </span>
                            </td>*/}
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {user.displayName}
                            </td>
                            <td className="px-6 py-4 font-mono text-sm text-indigo-600 font-bold">
                                {user.affiliateId || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* 分页 */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={currentPage + 1 >= totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}