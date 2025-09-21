
"use client";

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import DummyLogo from '@/components/ui/DummyLogo';

export default function Page() {
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-50 px-4 sm:px-6 -mt-16">
      <div className="w-full max-w-md space-y-4 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 max-h-[85vh] overflow-auto">
        {/* <div className="flex justify-center">
          <DummyLogo />
        </div> */}
        {authMode === 'login' && <LoginForm onToggleAuthMode={setAuthMode} />}
        {authMode === 'signup' && <SignupForm onToggleAuthMode={setAuthMode} />}
        {authMode === 'forgotPassword' && <ForgotPasswordForm onToggleAuthMode={setAuthMode} />}
      </div>
    </div>
  );
}