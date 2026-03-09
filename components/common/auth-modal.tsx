'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { Z_INDEX } from '@/lib/constants/z-index';
import { X, Mail, Lock, Eye, EyeOff, Loader2, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/contexts/toastContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// 定义视图状态
type AuthView = 'login' | 'register' | 'forgot-password';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [view, setView] = useState<AuthView>('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { login, register, forgotPassword } = useAuth();
    const { showToast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const toggleMode = () => {
        setView(view === 'login' ? 'register' : 'login');
        setErrors({});
    };

    // components/common/auth-modal.tsx

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            if (view === 'forgot-password') {
                // 模式1：忘记密码 - 只需要传 email 字符串
                await forgotPassword(formData.email);
                showToast('success', 'Email Sent', 'If an account exists, you will receive a reset link.');
                setView('login'); // 成功后跳回登录
            } else if (view === 'login') {
                // 模式2：登录 - 必须传对象 { email, password }
                await login({
                    email: formData.email,
                    password: formData.password
                });
                showToast('success', 'Welcome back', 'Logged in successfully.');
                onClose();
            } else if (view === 'register') {
                // 模式3：注册 - 验证两次密码一致性并传对象
                if (formData.password !== formData.confirmPassword) {
                    setErrors({ confirmPassword: 'Passwords do not match' });
                    setIsLoading(false);
                    return;
                }
                await register({
                    email: formData.email,
                    password: formData.password
                });
                showToast('success', 'Account created', 'Please sign in with your new credentials.');
                setView('login');
            }
        } catch (error: any) {
            console.error('Auth action failed:', error);
            setErrors({ submit: error.message || 'Action failed, please try again.' });
            showToast('error', 'Action Failed', error.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                style={{ zIndex: Z_INDEX.MODAL - 1 }}
                onClick={onClose}
            />

            <div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4"
                style={{ zIndex: Z_INDEX.MODAL }}
            >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative p-8">
                    {/* 关闭按钮 */}
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* 标题区 */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black tracking-tight text-gray-900">
                            {view === 'login' && 'Welcome Back'}
                            {view === 'register' && 'Create Account'}
                            {view === 'forgot-password' && 'Reset Password'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">
                            {view === 'login' && 'Sign in to manage your orders'}
                            {view === 'register' && 'Join us for a better shopping experience'}
                            {view === 'forgot-password' && "Enter your email to receive a reset link"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black focus:bg-white transition-all"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Inputs - 仅在非找回密码视图显示 */}
                        {view !== 'forgot-password' && (
                            <>
                                <div className="space-y-1">
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black focus:bg-white transition-all"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {view === 'register' && (
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm Password"
                                                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black focus:bg-white transition-all"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-red-500 text-xs pl-1">{errors.confirmPassword}</p>}
                                    </div>
                                )}

                                {view === 'login' && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-gray-400 hover:text-black transition-colors"
                                            onClick={() => setView('forgot-password')}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* 错误显示 */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg text-center">
                                {errors.submit}
                            </div>
                        )}

                        {/* 主提交按钮 */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    {view === 'login' && 'Sign In'}
                                    {view === 'register' && 'Create Account'}
                                    {view === 'forgot-password' && 'Send Reset Link'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* 底部切换按钮 */}
                    <div className="text-center mt-6 text-sm text-gray-500">
                        {view === 'forgot-password' ? (
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 mx-auto text-black font-semibold hover:underline"
                                onClick={() => setView('login')}
                            >
                                <ArrowLeft size={16} /> Back to Sign In
                            </button>
                        ) : (
                            <>
                                {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors"
                                    onClick={toggleMode}
                                >
                                    {view === 'login' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}