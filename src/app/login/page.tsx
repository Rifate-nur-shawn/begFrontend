"use client";

import { useAuthStore } from "@/store/auth-store";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const { loginGoogle, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/account');
        }
    }, [isAuthenticated, router]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSuccess = async (credentialResponse: any) => {
        try {
            await loginGoogle(credentialResponse.credential);
            router.push('/account');
        } catch (error) {
            console.error("Login Failed", error);
        }
    };

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
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-24 bg-canvas text-primary">
                <div className="w-full max-w-md text-center">
                    <h1 className="font-display text-4xl mb-4">Welcome Back</h1>
                    <p className="font-utility text-xs tracking-widest text-neutral-500 mb-12 uppercase">
                        Sign in to access your account
                    </p>

                    <div className="flex justify-center">
                         <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            theme="outline"
                            size="large"
                            width="300"
                            text="continue_with"
                            shape="rectangular"
                        />
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
