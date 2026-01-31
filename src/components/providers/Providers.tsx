"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';

function AuthCheck({ children }: { children: React.ReactNode }) {
    const { fetchMe } = useAuthStore();
    
    useEffect(() => {
        // Sync user state on load
        fetchMe();
    }, [fetchMe]);

    return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID";
  
    return (
    <GoogleOAuthProvider clientId={clientId}>
        <AuthCheck>
            {children}
        </AuthCheck>
    </GoogleOAuthProvider>
  );
}
