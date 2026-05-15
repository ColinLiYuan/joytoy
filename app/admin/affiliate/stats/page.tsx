// app/admin/affiliate/stats/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { affiliateService } from '@/services/affiliateService'
import {
  TrendingUp, Users, MousePointerClick, DollarSign, Package, Video, FileText,
  Award, Calendar, Activity, ArrowUpRight, ArrowDownRight, Link as LinkIcon, LayoutTemplate
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface AffiliateStats {
  totalAffiliates: number
  activeAffiliates: number
  totalClicks: number
  totalConversions: number
  totalCommission: number
  conversionRate: number
  totalShipments: number
  totalVideoReviews: number
  totalBlogReviews: number
  settledAmount: number
  pendingAmount: number
  currentBalance: number
  totalPaid: number
}

interface AffiliateMember {
  id: number
  affiliateId: string
  userName: string
  userEmail: string
  totalClicks: number
  totalOrders: number
  conversionRate: number
  totalEarnings: number
  currentBalance: number
  status: string
}

interface TrendDataPoint {
  date: string
  clicks: number
  orders: number
  commission: number
  conversionRate: number
}

interface SourceStat {
  source: string
  clicks: number
  conversions: number
  revenue: number
  conversionRate: number
}

interface LandingPageStat {
  landingPage: string
  clicks: number
  conversions: number
  revenue: number
  conversionRate: number
}


export default function AffiliateStatsPage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [affiliates, setAffiliates] = useState<AffiliateMember[]>([])
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([])
  const [sourceStats, setSourceStats] = useState<SourceStat[]>([])
  const [landingPageStats, setLandingPageStats] = useState<LandingPageStat[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDays, setSelectedDays] = useState<number>(7)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // 获取基础统计
      const statsData = await affiliateService.getAdminStats()
      setStats(statsData)

      // 获取联盟成员列表（用于排行）
      const listData = await affiliateService.getAdminList({ page: 0, size: 100 })
      const members = listData.content || []

      // 排序取 TOP 10（按收益）
      const topAffiliates = members
        .sort((a: any, b: any) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
        .slice(0, 10)
        .map((m: any) => ({
          id: m.id,
          affiliateId: m.affiliateId,
          userName: m.userName,
          userEmail: m.userEmail,
          totalClicks: m.totalClicks || 0,
          totalOrders: m.totalOrders || 0,
          conversionRate: m.conversionRate || 0,
          totalEarnings: m.totalEarnings || 0,
          currentBalance: m.currentBalance || 0,
          status: m.status
        }))

      setAffiliates(topAffiliates)

      // 获取趋势数据
      await fetchTrendData(selectedDays)
      
      // 获取来源统计
      await fetchSourceStats()
      
      // 获取着陆页统计
      await fetchLandingPageStats()

    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendData = async (days: number) => {
    try {
      const trendResponse = await affiliateService.getTrendData(days)
      
      // 转换后端数据格式为图表所需格式
      const formattedData: TrendDataPoint[] = trendResponse.dates.map((date, index) => ({
        date,
        clicks: trendResponse.clicks[index] || 0,
        orders: trendResponse.orders[index] || 0,
        commission: trendResponse.commissions[index] || 0,
        conversionRate: trendResponse.conversionRates[index] || 0
      }))
      
      setTrendData(formattedData)
    } catch (error) {
      console.error('Failed to fetch trend data:', error)
    }
  }

  const fetchSourceStats = async () => {
    try {
      const data = await affiliateService.getSourceStats()
      setSourceStats(data)
    } catch (error) {
      console.error('Failed to fetch source stats:', error)
    }
  }

  const fetchLandingPageStats = async () => {
    try {
      const data = await affiliateService.getLandingPageStats()
      setLandingPageStats(data)
    } catch (error) {
      console.error('Failed to fetch landing page stats:', error)
    }
  }

  const handleDaysChange = async (days: number) => {
    setSelectedDays(days)
    await fetchTrendData(days)
    await fetchSourceStats()
    await fetchLandingPageStats()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400 font-medium animate-pulse">正在加载统计数据...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">联盟数据统计</h1>
          <p className="text-sm text-gray-500 mt-1">可视化分析联盟营销表现和数据趋势</p>
        </div>
        <div className="flex items-center gap-2">
          {[3, 7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => handleDaysChange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDays === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {days === 3 ? '最近3天' : `最近${days}天`}
            </button>
          ))}
        </div>
      </div>

      {/* 核心指标卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="分销客总数"
            value={stats.totalAffiliates.toString()}
            subtitle={`${stats.activeAffiliates} 个活跃`}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="总点击数"
            value={stats.totalClicks.toLocaleString()}
            subtitle="所有链接累计"
            icon={MousePointerClick}
            color="purple"
          />
          <StatCard
            title="总转化数"
            value={stats.totalConversions.toString()}
            subtitle={`转化率 ${stats.conversionRate}%`}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="累计产生佣金"
            value={`$${stats.totalCommission.toFixed(2)}`}
            subtitle="联盟客赚取总额"
            icon={DollarSign}
            color="orange"
          />
        </div>
      )}

      {/* 活动统计 */}
      {stats && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">活动统计</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">发货数</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                {stats.totalShipments?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-400">累计发货次数</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-pink-500" />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">视频评测</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                {stats.totalVideoReviews?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-400">视频评测数量</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">博客评测</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                {stats.totalBlogReviews?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-400">博客评测数量</div>
            </div>
          </div>
        </div>
      )}

      {/* 财务概览 */}
      {stats && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">财务概览</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">可提现</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ${stats.settledAmount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">已过冷静期 (30 天)</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">待结算</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ${stats.pendingAmount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">冷静期内 (30 天)</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">账户余额</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ${stats.currentBalance.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">可提现 + 待结算</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">已打款</span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ${stats.totalPaid.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">历史累计支付</div>
            </div>
          </div>
        </div>
      )}

      {/* 趋势图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 点击与订单趋势 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">点击与订单趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                name="点击数"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
                name="订单数"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 佣金趋势 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="font-bold text-gray-900">佣金趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [`$${value}`, '佣金']}
              />
              <Line
                type="monotone"
                dataKey="commission"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                name="佣金"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 按来源统计 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <LinkIcon className="h-5 w-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">按点击来源统计</h3>
        </div>
        {sourceStats.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceStats.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="source" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="clicks" fill="#3B82F6" name="点击数" />
                <Bar dataKey="conversions" fill="#10B981" name="转化数" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* 详细数据表格 */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来源</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点击数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">转化数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">转化率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">佣金</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sourceStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.conversions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.conversionRate.toFixed(2)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${stat.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">暂无来源统计数据</div>
        )}
      </div>

      {/* 按着陆页统计 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <LayoutTemplate className="h-5 w-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">按着陆页统计</h3>
        </div>
        {landingPageStats.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={landingPageStats.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="landingPage" stroke="#9CA3AF" fontSize={12} tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="clicks" fill="#8B5CF6" name="点击数" />
                <Bar dataKey="conversions" fill="#F59E0B" name="转化数" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* 详细数据表格 */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">着陆页</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点击数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">转化数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">转化率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">佣金</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {landingPageStats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{stat.landingPage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.conversions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.conversionRate.toFixed(2)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${stat.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">暂无着陆页统计数据</div>
        )}
      </div>

      {/* TOP 10 联盟客排行 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-5 w-5 text-yellow-600" />
          <h3 className="font-bold text-gray-900">TOP 10 联盟客排行</h3>
        </div>
        <div className="space-y-4">
          {affiliates.slice(0, 10).map((aff, index) => (
            <div key={aff.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-100 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-blue-50 text-blue-600'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{aff.userName}</div>
                <div className="text-xs text-gray-500">{aff.affiliateId}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">${aff.totalEarnings.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{aff.totalOrders} 订单 · {aff.totalClicks} 点击</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
