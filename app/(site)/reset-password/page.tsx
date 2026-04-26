'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPassword as resetPasswordAction } from '@/app/actions/auth';
import { Loader2, CheckCircle2, Lock } from 'lucide-react';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await resetPasswordAction(token, password);
            setIsSuccess(true);
            // Redirect to home page after 3 seconds
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-500 w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Updated</h1>
                <p className="text-gray-500">Your password has been reset successfully. Redirecting you to login...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                <p className="text-gray-500 mt-2 text-sm">Please enter a secure password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-black transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-black transition-all"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !token}
                    className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors flex justify-center items-center gap-3 disabled:bg-gray-300"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                </button>
            </form>
        </div>
    );
}

// Next.js 强制要求在用到 useSearchParams 的页面包裹 Suspense
export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
            <Suspense fallback={<Loader2 className="animate-spin text-black" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}