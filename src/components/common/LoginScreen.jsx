import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_NAMES } from '../../data/constants';

export default function LoginScreen() {
  const { login, loginAsMember, lang, members } = useApp();

  const [authType, setAuthType] = useState('member'); // 'member' | 'staff'
  const [selectedRole, setSelectedRole] = useState('admin');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');

  // Handle Staff Login
  const handleStaffSignIn = (e) => {
    e.preventDefault();
    login(selectedRole);
  };

  // Handle Member Gmail Login
  const handleMemberSignIn = (e) => {
    e.preventDefault();
    setMemberError('');

    if (!memberEmail.trim()) {
      setMemberError(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার সুপার এডমিন অনুমোদিত জিমেইলটি লিখুন।'
          : 'Please enter your registered Gmail provided by Super Admin.'
      );
      return;
    }

    const res = loginAsMember(memberEmail.trim());
    if (!res.success) {
      setMemberError(res.error);
    }
  };

  // Quick 1-click test login helper
  const handleQuickMemberLogin = (email) => {
    setMemberEmail(email);
    setMemberError('');
    loginAsMember(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-[#040e0b] via-[#071913] to-[#0d2e23] text-white overflow-y-auto">
      {/* Background Decorative Lattice Motif */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e8b04a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#081b15]/95 border border-white/10 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 my-auto">
        {/* Emblem Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0b6e52] border border-[#e8b04a]/40 flex items-center justify-center shadow-lg mb-2.5">
            <svg viewBox="0 0 40 40" className="w-10 h-10" aria-hidden="true">
              <rect width="40" height="40" rx="9" fill="#0b6e52" />
              <circle cx="18" cy="20" r="8.5" fill="#e0412f" />
              <path d="M4 33 Q20 19 36 33" fill="none" stroke="#e8b04a" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Bangladesh China Club OS
          </h2>
          <p className="text-xs text-[#e8b04a] font-serif mt-0.5">
            孟中俱乐部 · Executive Club Management & VIP Portal
          </p>
        </div>

        {/* Portal Switcher Tabs: Member vs Staff */}
        <div className="flex bg-white/[0.05] p-1 rounded-2xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthType('member');
              setMemberError('');
            }}
            className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              authType === 'member'
                ? 'bg-gradient-to-r from-[#0b6e52] to-[#128a67] text-white shadow-md border border-emerald-400/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>👤</span>
            <span>{lang === 'bn' ? 'সদস্য প্রবেশ (Member Login)' : 'Member Portal (Gmail)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthType('staff');
              setMemberError('');
            }}
            className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              authType === 'staff'
                ? 'bg-gradient-to-r from-[#0b6e52] to-[#128a67] text-white shadow-md border border-emerald-400/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>🛠️</span>
            <span>{lang === 'bn' ? 'ম্যানেজমেন্ট (Staff Login)' : 'Management Staff'}</span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* TAB 1: MEMBER GMAIL LOGIN                                        */}
        {/* ================================================================ */}
        {authType === 'member' && (
          <form onSubmit={handleMemberSignIn} className="space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-200">
                  {lang === 'bn'
                    ? 'সুপার এডমিন প্রদত্ত জিমেইল (Registered Gmail)'
                    : 'Registered Member Gmail'}
                </label>
                <span className="text-[10px] text-[#e8b04a] font-sans font-medium">
                  {lang === 'bn' ? 'সুপার এডমিন ভেরিফাইড' : 'Admin Authorized Only'}
                </span>
              </div>

              <div className="relative">
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => {
                    setMemberEmail(e.target.value);
                    setMemberError('');
                  }}
                  placeholder="e.g. anika.rahman@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 focus:border-[#e8b04a] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e8b04a] placeholder-gray-500 font-mono tracking-wide"
                  required
                />
                <span className="absolute right-3 top-3 text-sm text-gray-400">
                  📧
                </span>
              </div>
            </div>

            {/* Error Message */}
            {memberError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/50 text-xs text-rose-300 leading-relaxed animate-in fade-in">
                <div className="font-bold flex items-center gap-1.5 mb-0.5">
                  <span>⚠️</span>
                  <span>{lang === 'bn' ? 'লগইন ব্যর্থ হয়েছে' : 'Access Denied'}</span>
                </div>
                <div>{memberError}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0b6e52] to-[#128a67] hover:from-[#0d7d5d] hover:to-[#159d76] text-white font-serif font-bold text-sm shadow-lg hover:shadow-emerald-900/40 transition-all duration-200 border border-emerald-400/30 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{lang === 'bn' ? 'মেম্বার ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Member Portal'}</span>
            </button>

            {/* Quick Demo Test Accounts for Members */}
            <div className="pt-2">
              <div className="text-[11px] text-gray-400 mb-2 flex items-center justify-between">
                <span>{lang === 'bn' ? 'দ্রুত টেস্ট একাউন্ট (Quick Demo Accounts):' : 'One-Click Demo Member Sign In:'}</span>
                <span className="text-[#e8b04a] text-[10px]">Click any to test</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: 'Anika Rahman', email: 'anika.rahman@gmail.com', tier: 'Permanent' },
                  { name: 'Li Wei', email: 'li.wei@gmail.com', tier: 'Corporate' },
                  { name: 'Sadia Islam', email: 'sadia.islam@gmail.com', tier: 'Founder' },
                  { name: 'Mahfuz Ahmed', email: 'mahfuz.ahmed@gmail.com', tier: 'Overdue Dues' }
                ].map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => handleQuickMemberLogin(demo.email)}
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#e8b04a]/50 text-left transition-all group"
                  >
                    <div className="text-[11px] font-serif font-bold text-white group-hover:text-[#e8b04a] truncate">
                      {demo.name}
                    </div>
                    <div className="text-[9.5px] font-mono text-gray-400 truncate">
                      {demo.email}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ================================================================ */}
        {/* TAB 2: STAFF ROLE LOGIN                                          */}
        {/* ================================================================ */}
        {authType === 'staff' && (
          <form onSubmit={handleStaffSignIn} className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {lang === 'bn' ? 'ম্যানেজমেন্ট পদবী নির্বাচন করুন (Select Role)' : 'Select Access Role'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(ROLE_NAMES).filter((r) => r !== 'member').map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-serif font-semibold border text-left transition-all ${
                      selectedRole === r
                        ? 'bg-[#12382e] border-[#e8b04a] text-white shadow-md ring-1 ring-[#e8b04a]'
                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="text-[10px] text-[#e8b04a] uppercase tracking-wider font-mono">
                      {r}
                    </div>
                    <div className="truncate">{ROLE_NAMES[r]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0b6e52] to-[#128a67] hover:from-[#0d7d5d] hover:to-[#159d76] text-white font-serif font-bold text-sm shadow-lg hover:shadow-emerald-900/40 transition-all duration-200 border border-emerald-400/30 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{lang === 'bn' ? 'অ্যাডমিন প্যানেলে প্রবেশ করুন' : 'Sign In as Management Staff'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-white/10 text-center text-[10.5px] text-gray-400 flex items-center justify-center gap-1.5">
          <span>🔒</span>
          <span>Bangladesh China Club Management Portal · High Security Role-Based Access</span>
        </div>
      </div>
    </div>
  );
}
