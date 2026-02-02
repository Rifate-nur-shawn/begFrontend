"use client";

import { useAuthStore } from "@/store/auth-store";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const { loginGoogle, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/account');
        }
    }, [isAuthenticated, router]);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                await loginGoogle(codeResponse.code);
                router.push('/account');
            } catch (error) {
                console.error("Login Failed", error);
            }
        },
        onError: () => console.log('Login Failed'),
        flow: 'auth-code',
    });

    return (
        <div className="min-h-screen bg-canvas flex flex-col md:flex-row -mt-24">
            {/* Left: Brand / Image Section */}
            <div className="w-full md:w-1/2 min-h-[60vh] md:min-h-screen relative bg-[#0a0a0a] flex flex-col justify-end pb-24 px-12 md:px-24 overflow-hidden">
                {/* Background Image */}
                <Image 
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop" 
                    alt="Luxury Handbag" 
                    fill 
                    className="object-cover opacity-80"
                    priority
                    sizes="50vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                
                {/* Text Content */}
                <div className="relative z-20 text-left">
                     <h2 className="font-display text-5xl md:text-7xl text-white mb-6 leading-tight">
                        Values.<br/>
                        Luxury.<br/>
                        You.
                     </h2>
                     <p className="font-utility text-xs tracking-[0.3em] uppercase text-white/70">
                        Join the new era
                     </p>
                </div>
            </div>

            {/* Right: Login Form Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-24 bg-[#F5F3EF] text-primary">
                <div className="w-full max-w-md text-center">
                    <h1 className="font-display text-4xl mb-4">Welcome Back</h1>
                    <p className="font-utility text-xs tracking-widest text-neutral-500 mb-12 uppercase">
                        Sign in to access your account
                    </p>

                    <div className="flex justify-center">
                         <button
                            onClick={() => handleGoogleLogin()}
                            className="bg-white text-neutral-800 border border-neutral-200 px-8 py-3 rounded flex items-center gap-3 hover:bg-neutral-50 transition-all shadow-sm font-utility text-sm uppercase tracking-wider"
                            disabled={isLoading}
                        >
                            {/* Simple Google G Icon SVG to avoid extra dependencies if possible, or use text */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            {isLoading ? "Signing in..." : "Continue with Google"}
                        </button>
                    </div>
                    
                    <div className="mt-16 pt-8 border-t border-neutral-100">
                        <p className="font-utility text-[10px] text-neutral-400 uppercase tracking-widest">
                            By logging in, you agree to our<br/>
                            <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
