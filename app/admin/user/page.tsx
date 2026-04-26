// app/admin/user/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { UserResponse } from '@/types/auth'
import {
    Search,
    Filter,
    MoreHorizontal,
    UserCheck,
    UserX,
    Mail,
    Award,
    Loader2
} from 'lucide-react';

export default function AdminUserListPage() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('');
    
    // 升级联盟成员状态
    const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; user: UserResponse | null }>({ open: false, user: null });
    const [commissionRate, setCommissionRate] = useState('0.15'); // 默认15%
    const [upgrading, setUpgrading] = useState(false);
    
    // 联盟ID和优惠码
    const [affiliateId, setAffiliateId] = useState('');
    const [couponCode, setCouponCode] = useState('');
    
    // 优惠券配置
    const [createCoupon, setCreateCoupon] = useState(true);
    const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
    const [discountValue, setDiscountValue] = useState('10'); // 默认10%
    const [minOrderAmount, setMinOrderAmount] = useState('');
    const [validDays, setValidDays] = useState('365');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.adminList(
                currentPage,
                10,
                keyword || undefined,
                status || undefined
            );
            setUsers(data.content);
            setTotalPages(data.totalPages);
        } catch (error: any) {
            // ✅ 401 错误会触发自动登录框，不需要重复报错
            if (error.response?.status !== 401) {
                console.error('Fetch users failed', error);
            }
        } finally {
            setLoading(false);
        }
    };

    // 打开升级弹窗
    const handleOpenUpgrade = (user: UserResponse) => {
        setUpgradeModal({ open: true, user });
        setCommissionRate('0.15'); // 默认15%
        setAffiliateId(''); // 清空联盟ID
        setCouponCode(''); // 清空优惠码
        setCreateCoupon(true); // 默认创建优惠券
        setDiscountType('PERCENTAGE'); // 默认百分比
        setDiscountValue('10'); // 默认10%
        setMinOrderAmount(''); // 无门槛
        setValidDays('365'); // 默认1年
    };

    // 升级用户为联盟成员
    const handleUpgradeToAffiliate = async () => {
        if (!upgradeModal.user) return;
        
        // 验证必填字段
        if (!affiliateId.trim()) {
            alert('请输入联盟ID');
            return;
        }
        if (!couponCode.trim()) {
            alert('请输入优惠码');
            return;
        }
        
        setUpgrading(true);
        try {
            const requestBody: any = {
                commissionRate: parseFloat(commissionRate),
                affiliateId: affiliateId, // 必填
                couponCode: couponCode // 必填
            };
            
            // 优惠券配置
            requestBody.couponConfig = {
                discountType,
                discountValue: discountType === 'PERCENTAGE' ? parseFloat(discountValue) / 100 : parseFloat(discountValue),
                minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
                validDays: parseInt(validDays)
            };
            
            console.log('[Upgrade] Sending request:', requestBody);
            
            // ✅ 管理端接口直接使用 /api/admin/V1 路径
            const response = await fetch(`/api/admin/V1/users/${upgradeModal.user.id}/upgrade-to-affiliate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(requestBody)
            });
            
            const result = await response.json();
            console.log('[Upgrade] Response:', result);
            
            if (!result.success) {
                throw new Error(result.message || '升级失败');
            }
            
            alert(`升级成功！\n联盟ID: ${result.data.affiliateId}\n佣金比例: ${(result.data.commissionRate * 100).toFixed(0)}%\n优惠券码: ${result.data.couponCode}`);
            setUpgradeModal({ open: false, user: null });
            fetchUsers(); // 刷新列表
        } catch (error: any) {
            console.error('Upgrade failed:', error);
            alert('升级失败: ' + error.message);
        } finally {
            setUpgrading(false);
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
                                <div className="flex items-center justify-end gap-2">
                                    {/* 升级联盟成员按钮 */}
                                    {!user.affiliateId && (
                                        <button 
                                            onClick={() => handleOpenUpgrade(user)}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            title="升级为联盟成员"
                                        >
                                            <Award className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreHorizontal className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>
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
            
            {/* 升级联盟成员弹窗 */}
            {upgradeModal.open && upgradeModal.user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setUpgradeModal({ open: false, user: null })} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="h-5 w-5 text-emerald-600" />
                                升级为联盟成员
                            </h3>
                            
                            {/* 用户信息 */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-sm text-gray-600 mb-1">用户: <span className="font-bold">{`${upgradeModal.user.firstName} ${upgradeModal.user.lastName}`}</span></p>
                                <p className="text-sm text-gray-600">邮箱: <span className="font-mono">{upgradeModal.user.email}</span></p>
                            </div>
                            
                            {/* 联盟ID和优惠码 */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">联盟ID（小写）</label>
                                    <input
                                        type="text"
                                        value={affiliateId}
                                        onChange={(e) => setAffiliateId(e.target.value.toLowerCase())}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                                        placeholder="例如: aff3k9m2x7p"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">优惠码（大写）</label>
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                                        placeholder="例如: MYTHWELCOME10"
                                    />
                                </div>
                            </div>
                            
                            {/* 佣金比例 */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">佣金比例 (0-1)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        value={commissionRate}
                                        onChange={(e) => setCommissionRate(e.target.value)}
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="0.15"
                                    />
                                    <span className="text-sm text-gray-500">= {(parseFloat(commissionRate) * 100).toFixed(0)}%</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">默认15%，范围0-100%</p>
                            </div>
                            
                            {/* 优惠券配置 */}
                            <div className="mb-4 border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">创建专属优惠券</label>
                                    <button
                                        type="button"
                                        onClick={() => setCreateCoupon(!createCoupon)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${createCoupon ? 'bg-emerald-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${createCoupon ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                
                                {createCoupon && (
                                    <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                        {/* 折扣类型 */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">折扣类型</label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setDiscountType('PERCENTAGE')}
                                                    className={`flex-1 px-3 py-2 text-sm rounded-lg border ${discountType === 'PERCENTAGE' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600'}`}
                                                >
                                                    百分比
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDiscountType('FIXED_AMOUNT')}
                                                    className={`flex-1 px-3 py-2 text-sm rounded-lg border ${discountType === 'FIXED_AMOUNT' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600'}`}
                                                >
                                                    固定金额
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* 折扣值 */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                折扣值 {discountType === 'PERCENTAGE' ? '(%)' : '($)'}
                                            </label>
                                            <input
                                                type="number"
                                                step={discountType === 'PERCENTAGE' ? "1" : "0.01"}
                                                min="0"
                                                max={discountType === 'PERCENTAGE' ? "100" : undefined}
                                                value={discountValue}
                                                onChange={(e) => setDiscountValue(e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                placeholder={discountType === 'PERCENTAGE' ? "15" : "10.00"}
                                            />
                                        </div>
                                        
                                        {/* 最低消费 */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">最低消费金额 ($) - 选填</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={minOrderAmount}
                                                onChange={(e) => setMinOrderAmount(e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                placeholder="0 (无门槛)"
                                            />
                                        </div>
                                        
                                        {/* 有效期 */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">有效期 (天)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={validDays}
                                                onChange={(e) => setValidDays(e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                placeholder="365"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button 
                                onClick={() => setUpgradeModal({ open: false, user: null })}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleUpgradeToAffiliate}
                                disabled={upgrading || parseFloat(commissionRate) <= 0 || parseFloat(commissionRate) > 1}
                                className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {upgrading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        升级中...
                                    </>
                                ) : (
                                    <>
                                        <Award className="h-4 w-4" />
                                        确认升级
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}export const dynamic = 'force-dynamic'; 
