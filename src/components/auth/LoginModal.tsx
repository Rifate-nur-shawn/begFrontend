"use client";

import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { AnimatePresence, motion } from "framer-motion";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useUIStore();
  const { loginGoogle } = useAuthStore();

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLogin}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[150]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-canvas border border-accent-subtle p-12 shadow-2xl z-[160]"
          >
            <div className="flex flex-col items-center text-center">
                <h2 className="font-display text-4xl text-primary mb-2">Welcome Back</h2>
                <p className="font-utility text-xs text-neutral-500 uppercase tracking-widest mb-12">
                    Sign in to access your account
                </p>

                {/* Google Button Wrapper */}
                <div className="w-full flex justify-center mb-8">
                     <GoogleAuthButton onSuccess={(cred) => {
                         if (cred.credential) {
                             loginGoogle(cred.credential).then(() => {
                                 closeLogin();
                             });
                         }
                     }} />
                </div>

                <button 
                    onClick={closeLogin}
                    className="font-utility text-[10px] uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors"
                >
                    Cancel
                </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function GoogleAuthButton({ onSuccess }: { onSuccess: (cred: CredentialResponse) => void }) {
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
            theme="outline"
            size="large"
            width="300"
            text="continue_with"
            shape="rectangular"
        />
    );
}

