'use client'

import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Tag,
    Loader2
} from 'lucide-react';

interface Coupon {
    id: number;
    code: string;
    description: string | null;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number;
    minSpend: number | null;
    usageLimit: number | null;
    onlyForFirstOrder: boolean;
    applicableProductNames: string | null;
    affiliateId: string | null;
    isActive: boolean;
    startAt: string;
    endAt: string | null;
    createdAt: string;
}

export default function AdminCouponListPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [isActiveFilter, setIsActiveFilter] = useState('');
    const [affiliateId, setAffiliateId] = useState('');

    // 弹窗状态
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [saving, setSaving] = useState(false);

    // 表单数据
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
        discountValue: '10',
        minOrderAmount: '',
        usageLimit: '',
        onlyForFirstOrder: false,
        applicableProductNames: '',
        affiliateId: '',
        validDays: '365'
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                size: '10'
            });
            
            if (keyword) params.append('keyword', keyword);
            if (isActiveFilter) params.append('isActive', isActiveFilter);
            if (affiliateId) params.append('affiliateId', affiliateId);

            const response = await fetch(`/api/admin/V1/coupons/list?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const result = await response.json();
            if (result.success) {
                setCoupons(result.data.content);
                setTotalPages(result.data.totalPages);
            }
        } catch (error) {
            console.error('Fetch coupons failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [currentPage, isActiveFilter, affiliateId]);

    const handleOpenCreate = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            description: '',
            discountType: 'PERCENTAGE',
            discountValue: '10',
            minOrderAmount: '',
            usageLimit: '',
            onlyForFirstOrder: false,
            applicableProductNames: '',
            affiliateId: '',
            validDays: '365'
        });
        setShowModal(true);
    };

    const handleOpenEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discountType: coupon.type,
            discountValue: (coupon.type === 'PERCENTAGE' ? coupon.value * 100 : coupon.value).toString(),
            minOrderAmount: coupon.minSpend ? coupon.minSpend.toString() : '',
            usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : '',
            onlyForFirstOrder: coupon.onlyForFirstOrder,
            applicableProductNames: coupon.applicableProductNames || '',
            affiliateId: coupon.affiliateId || '',
            validDays: '365'
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.code) {
            alert('优惠码不能为空');
            return;
        }

        setSaving(true);
        try {
            const requestBody: any = {
                code: formData.code,
                description: formData.description || null,
                discountType: formData.discountType,
                discountValue: formData.discountType === 'PERCENTAGE' 
                    ? parseFloat(formData.discountValue) / 100 
                    : parseFloat(formData.discountValue),
                minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                onlyForFirstOrder: formData.onlyForFirstOrder,
                applicableProductNames: formData.applicableProductNames || null,
                affiliateId: formData.affiliateId || null
            };

            if (editingCoupon) {
                // 更新
                requestBody.isActive = editingCoupon.isActive;
                requestBody.endAt = editingCoupon.endAt;
                
                const response = await fetch(`/api/admin/V1/coupons/${editingCoupon.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify(requestBody)
                });

                const result = await response.json();
                if (result.success) {
                    alert('优惠券更新成功');
                    setShowModal(false);
                    fetchCoupons();
                } else {
                    throw new Error(result.message);
                }
            } else {
                // 创建
                requestBody.validDays = parseInt(formData.validDays);

                const response = await fetch('/api/admin/V1/coupons', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify(requestBody)
                });

                const result = await response.json();
                if (result.success) {
                    alert('优惠券创建成功');
                    setShowModal(false);
                    fetchCoupons();
                } else {
                    throw new Error(result.message);
                }
            }
        } catch (error: any) {
            alert('操作失败: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('确定要禁用此优惠券吗？')) return;

        try {
            const response = await fetch(`/api/admin/V1/coupons/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const result = await response.json();
            if (result.success) {
                alert('优惠券已禁用');
                fetchCoupons();
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            alert('操作失败: ' + error.message);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">优惠券管理</h1>
                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus className="h-4 w-4" />
                    创建优惠券
                </button>
            </div>

            {/* 筛选栏 */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜索优惠码或描述..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchCoupons()}
                    />
                </div>
                <select
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                    value={isActiveFilter}
                    onChange={(e) => setIsActiveFilter(e.target.value)}
                >
                    <option value="">全部状态</option>
                    <option value="true">已启用</option>
                    <option value="false">已禁用</option>
                </select>
            </div>

            {/* 优惠券列表 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                        <tr>
                            <th className="px-6 py-4">优惠码</th>
                            <th className="px-6 py-4">折扣类型</th>
                            <th className="px-6 py-4">折扣值</th>
                            <th className="px-6 py-4">最低消费</th>
                            <th className="px-6 py-4">联盟ID</th>
                            <th className="px-6 py-4">状态</th>
                            <th className="px-6 py-4">有效期</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="py-20 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                                </td>
                            </tr>
                        ) : coupons.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-20 text-center text-gray-400">
                                    暂无优惠券
                                </td>
                            </tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-indigo-600">{coupon.code}</div>
                                        {coupon.description && (
                                            <div className="text-xs text-gray-500 mt-1">{coupon.description}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            coupon.type === 'PERCENTAGE' 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {coupon.type === 'PERCENTAGE' ? '百分比' : '固定金额'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {coupon.type === 'PERCENTAGE' 
                                            ? `${(coupon.value * 100).toFixed(0)}%`
                                            : `$${coupon.value.toFixed(2)}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {coupon.minSpend ? `$${coupon.minSpend.toFixed(2)}` : '无门槛'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                        {coupon.affiliateId || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            coupon.isActive 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {coupon.isActive ? '已启用' : '已禁用'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        <div>{new Date(coupon.startAt).toLocaleDateString()}</div>
                                        {coupon.endAt && (
                                            <div>至 {new Date(coupon.endAt).toLocaleDateString()}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(coupon)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                title="编辑"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="禁用"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 分页 */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <span>第 {currentPage + 1} 页 / 共 {totalPages} 页</span>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
                        >
                            上一页
                        </button>
                        <button
                            disabled={currentPage + 1 >= totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
                        >
                            下一页
                        </button>
                    </div>
                </div>
            </div>

            {/* 创建/编辑弹窗 */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editingCoupon ? '编辑优惠券' : '创建优惠券'}
                            </h3>

                            <div className="space-y-4">
                                {/* 优惠码 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        优惠码 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                        placeholder="例如: WELCOME10"
                                        disabled={!!editingCoupon}
                                    />
                                </div>

                                {/* 折扣类型 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">折扣类型</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, discountType: 'PERCENTAGE'})}
                                            className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                                                formData.discountType === 'PERCENTAGE' 
                                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            百分比
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, discountType: 'FIXED_AMOUNT'})}
                                            className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                                                formData.discountType === 'FIXED_AMOUNT' 
                                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            固定金额
                                        </button>
                                    </div>
                                </div>

                                {/* 折扣值 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        折扣值 {formData.discountType === 'PERCENTAGE' ? '(%)' : '($)'}
                                    </label>
                                    <input
                                        type="number"
                                        step={formData.discountType === 'PERCENTAGE' ? "1" : "0.01"}
                                        min="0"
                                        max={formData.discountType === 'PERCENTAGE' ? "100" : undefined}
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* 最低消费 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        最低消费金额 ($) - 选填
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="0 (无门槛)"
                                    />
                                </div>

                                {/* 使用次数限制 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        使用次数限制 - 选填
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="不限制"
                                    />
                                </div>

                                {/* 仅首单 */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="onlyForFirstOrder"
                                        checked={formData.onlyForFirstOrder}
                                        onChange={(e) => setFormData({...formData, onlyForFirstOrder: e.target.checked})}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="onlyForFirstOrder" className="text-sm text-gray-700">
                                        仅限首单使用
                                    </label>
                                </div>

                                {/* 联盟ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        联盟ID - 选填
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.affiliateId}
                                        onChange={(e) => setFormData({...formData, affiliateId: e.target.value})}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                        placeholder="例如: AFF1A2B3C4D"
                                    />
                                </div>

                                {/* 有效期（仅创建时） */}
                                {!editingCoupon && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            有效期 (天)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.validDays}
                                            onChange={(e) => setFormData({...formData, validDays: e.target.value})}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="365"
                                        />
                                    </div>
                                )}

                                {/* 描述 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        描述 - 选填
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                        rows={3}
                                        placeholder="优惠券描述"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !formData.code}
                                className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        保存中...
                                    </>
                                ) : (
                                    '保存'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
