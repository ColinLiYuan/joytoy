// components/auth-modal.tsx
'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/authContext';
import { Z_INDEX } from '@/lib/constants/z-index';

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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin) {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
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
                const loginRequest = {
                    email: formData.email,
                    password: formData.password
                };
                await login(loginRequest);
            } else {
                const registerRequest = {
                    email: formData.email,
                    password: formData.password
                };
                await register(registerRequest);
                setIsLogin(true);
                setErrors({});
                setFormData(prev => ({
                    ...prev,
                    confirmPassword: ''
                }));
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
            setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* 遮罩层 - 参考 Cart 的设计 */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                    isOpen ? 'opacity-40' : 'opacity-0 invisible'
                }`}
                style={{ zIndex: Z_INDEX.OVERLAY }}
                onClick={onClose}
            />

            {/* 模态框 - 参考 Cart 的设计 */}
            <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-[450px] bg-white rounded-2xl shadow-lg flex flex-col transition-all duration-300 ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible'
                }`}
                style={{ zIndex: Z_INDEX.MODAL }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 m-0">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <button
                        className="bg-gray-50 border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 text-gray-600 hover:bg-gray-100 hover:scale-110 hover:text-gray-800"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="relative flex items-center">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="absolute left-4 text-gray-600 w-4 h-4"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-100 ${
                                        errors.email ? 'border-red-500' : ''
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <span className="text-red-600 text-sm font-medium">{errors.email}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="relative flex items-center">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="absolute left-4 text-gray-600 w-4 h-4"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-100 ${
                                        errors.password ? 'border-red-500' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 bg-transparent border-none text-gray-600 cursor-pointer p-1 transition-colors duration-300 hover:text-gray-800"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-red-600 text-sm font-medium">{errors.password}</span>
                            )}
                        </div>

                        {!isLogin && (
                            <div className="flex flex-col gap-2">
                                <div className="relative flex items-center">
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="absolute left-4 text-gray-600 w-4 h-4"
                                    />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-100 ${
                                            errors.confirmPassword ? 'border-red-500' : ''
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 bg-transparent border-none text-gray-600 cursor-pointer p-1 transition-colors duration-300 hover:text-gray-800"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="text-red-600 text-sm font-medium">{errors.confirmPassword}</span>
                                )}
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                    <input type="checkbox" className="hidden" />
                                    <span className="w-4 h-4 border-2 border-gray-200 rounded flex items-center justify-center transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-600">
                                        <span className="text-white text-xs font-bold hidden peer-checked:inline">✓</span>
                                    </span>
                                    Remember me
                                </label>
                                <button type="button" className="bg-transparent border-none text-purple-600 cursor-pointer font-semibold transition-colors duration-300 hover:text-purple-700">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {errors.submit && (
                            <div className={`text-center p-3 rounded-lg ${
                                errors.submit.includes('successful')
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="bg-purple-600 text-white border-none py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-6 pt-5 border-t border-gray-200 text-gray-600">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                className="bg-transparent border-none text-purple-600 cursor-pointer font-semibold transition-colors duration-300 hover:text-purple-700 hover:underline"
                                onClick={toggleMode}
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}