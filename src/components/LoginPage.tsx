import React, { useState } from 'react';
import { ShoppingBag, Lock, Mail, UserCheck, Sparkles, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (adminName: string, role: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('tamilkumaran@billsight.ai');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Store Administrator');
  const [adminName, setAdminName] = useState('Tamilkumaran G');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter valid administrator credentials.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(adminName, role);
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('Tamilkumaran G', 'Store Administrator');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 transform transition hover:scale-105">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              BillSightAI
            </h1>
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" /> AI v2.4
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Smart Supermarket Billing & Inventory Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/60">
          
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Sign In</h2>
              <p className="text-xs text-gray-500">Access store analytics & billing management</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Admin Name / ID */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Administrator Name
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-amber-50/40 border border-amber-200/80 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                />
              </div>
            </div>

            {/* Email / Username */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Store Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-amber-50/40 border border-amber-200/80 font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-amber-50/40 border border-amber-200/80 font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Access Authorization Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-amber-50/40 border border-amber-200/80 font-bold text-gray-900 focus:outline-none"
              >
                <option value="Store Administrator">Store Administrator (Full Access)</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Billing Counter Supervisor">Billing Counter Supervisor</option>
              </select>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-600">
                <input type="checkbox" defaultChecked className="rounded text-amber-500 focus:ring-amber-400" />
                Remember active session
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Security Code reset sent to store admin email.'); }} className="font-bold text-amber-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-sm shadow-md shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <span>Authenticating BillSightAI...</span>
              ) : (
                <>
                  <span>Sign In to BillSightAI</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Login Box */}
          <div className="mt-6 pt-4 border-t border-amber-100 text-center">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" /> 1-Click Quick Sign In
            </button>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 mt-6">
          BillSightAI System • Store Administrator: Tamilkumaran G
        </p>

      </div>
    </div>
  );
};
