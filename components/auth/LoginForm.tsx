import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});

        // Validation
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            const errors: { [key: string]: string } = {};
            result.error.issues.forEach((issue) => {
                errors[issue.path[0] as string] = issue.message;
            });
            setValidationErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            const api = await import('@/lib/api').then(m => m.default);
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);

            showToast(`Welcome back, ${data.user.name}!`, 'success');

            if (data.user.role === 'ADMIN') {
                router.push('/admin');
            } else if (data.user.role === 'STAFF') {
                router.push('/staff');
            } else {
                router.push('/');
            }

        } catch (err: any) {
            const msg = err.message || 'Login failed';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const api = await import('@/lib/api').then(m => m.default);
            // In a real app, this would receive a Google ID token from a pop-up
            const { data } = await api.post('/auth/google-login', {
                email: 'google-user@example.com',
                name: 'Google User',
                idToken: 'mock-id-token'
            });

            login(data.token, data.user);
            showToast(`Welcome, ${data.user.name}!`, 'success');

            if (data.user.role === 'ADMIN') {
                router.push('/admin');
            } else if (data.user.role === 'STAFF') {
                router.push('/staff');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            const msg = err.message || 'Google login failed';
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
            <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            <button
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 border-2 border-gray-100 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-semibold">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-colors ${validationErrors.email ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                            }`}
                        placeholder="you@example.com"
                        disabled={isLoading}
                    />
                    {validationErrors.email && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{validationErrors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-colors ${validationErrors.password ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                            }`}
                        placeholder="••••••••"
                        disabled={isLoading}
                    />
                    {validationErrors.password && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{validationErrors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-orange-600 hover:text-red-600">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
