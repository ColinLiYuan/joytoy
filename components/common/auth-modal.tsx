'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { Z_INDEX } from '@/lib/constants/z-index';
import { X, Mail, Lock, Eye, EyeOff, Loader2, Check } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { login, register } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (!isLogin) {
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
            else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            if (isLogin) {
                await login({ email: formData.email, password: formData.password });
            } else {
                await register({ email: formData.email, password: formData.password });
                setIsLogin(true);
                setErrors({});
                setFormData(prev => ({ ...prev, confirmPassword: '' }));
            }
        } catch (error: any) {
            setErrors({
                submit: error.message || 'Authentication failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({ email: '', password: '', confirmPassword: '' });
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                style={{ zIndex: Z_INDEX.OVERLAY }}
                onClick={onClose}
            />

            <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-[450px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible'
                }`}
                style={{ zIndex: Z_INDEX.MODAL }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">
                        {isLogin ? 'Welcome Back' : 'Join MythToy'}
                    </h2>
                    <button
                        className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-50 transition-colors"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="space-y-1">
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-12 pr-4 py-3.5 border rounded-xl text-base bg-gray-50 focus:bg-white focus:ring-1 transition-all ${
                                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-black focus:ring-black'
                                    }`}
                                />
                            </div>
                            {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email}</span>}
                        </div>

                        <div className="space-y-1">
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-12 pr-12 py-3.5 border rounded-xl text-base bg-gray-50 focus:bg-white focus:ring-1 transition-all ${
                                        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-black focus:ring-black'
                                    }`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 text-gray-400 hover:text-black transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password}</span>}
                        </div>

                        {!isLogin && (
                            <div className="space-y-1">
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full pl-12 pr-12 py-3.5 border rounded-xl text-base bg-gray-50 focus:bg-white focus:ring-1 transition-all ${
                                            errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-black focus:ring-black'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 text-gray-400 hover:text-black transition-colors"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="text-red-500 text-xs ml-1">{errors.confirmPassword}</span>}
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                                    <input type="checkbox" className="peer hidden" />
                                    <span className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center peer-checked:bg-black peer-checked:border-black transition-all">
                                        <Check size={12} className="text-white hidden peer-checked:block" />
                                    </span>
                                    Remember me
                                </label>
                                <button type="button" className="text-gray-500 hover:text-black transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {errors.submit && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg text-center">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="text-center mt-6 text-sm text-gray-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="text-pink-600 font-semibold hover:text-pink-700 hover:underline transition-colors"
                            onClick={toggleMode}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}