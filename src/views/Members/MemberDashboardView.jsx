import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { money, qrSVG } from '../../utils/formatters';
import { mStatus, mDue, getMemberLedger } from '../../utils/helpers';
import Pill from '../../components/common/Pill';

export default function MemberDashboardView() {
  const {
    currentMember,
    members,
    openModal,
    collectDues,
    setView,
    openChat,
    lang,
    transactions
  } = useApp();

  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'dues' | 'book' | 'orders'

  // Fallback to first member if none selected (e.g. preview)
  const member = currentMember || members[0] || {
    id: 'BCC-0482',
    name: 'Anika Rahman',
    alt: 'আনিকা রহমান',
    email: 'anika.rahman@gmail.com',
    tier: 'Permanent',
    nat: 'BD',
    over: 0,
    spend: 18450,
    year: 2018
  };

  const status = mStatus(member);
  const dues = mDue(member);
  const ledger = getMemberLedger(member);

  // Filter transactions for this member
  const memberTransactions = transactions.filter(
    (t) => t.outlet && t.st === 'Success'
  ).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Welcome & Notification Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#082018] to-[#12382e] border border-[#e8b04a]/30 text-white shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0b6e52] to-[#e8b04a] p-0.5 flex items-center justify-center shadow-md flex-shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#071d16] flex items-center justify-center text-lg font-serif font-bold text-[#e8b04a]">
              {member.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide">
                {lang === 'bn' ? `স্বাগতম, ${member.name}!` : `Welcome, ${member.name}!`}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                {member.tier}
              </span>
            </div>
            <p className="text-xs text-[#8fa89c] font-sans mt-0.5 flex items-center gap-2">
              <span>{lang === 'bn' ? 'সুপার এডমিন ভেরিফাইড জিমেইল:' : 'Super Admin Verified Gmail:'}</span>
              <span className="font-mono text-[#e8b04a] font-semibold underline underline-offset-2">
                {member.email || `${member.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com`}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => openChat('Explore All Floors')}
            className="px-3.5 py-1.5 rounded-xl bg-[#e8b04a] hover:bg-[#d49e38] text-[#071d16] text-xs font-serif font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>🤖</span>
            <span>{lang === 'bn' ? 'ক্লাব এআই অ্যাসিস্ট্যান্ট' : 'Open Club AI'}</span>
          </button>
        </div>
      </div>

      {/* VIP Member Pass Card & Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital VIP Member Pass Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#071f17] via-[#0d2f24] to-[#174839] text-white shadow-2xl border border-[#e8b04a]/40 overflow-hidden group">
            {/* Background Decorative Gold Watermark & Gradients */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#e8b04a]/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#006a4e]/20 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />

            {/* Card Header: Club Bilateral Crest */}
            <div className="flex justify-between items-start gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b6e52] border border-[#e8b04a]/50 flex items-center justify-center shadow-md flex-shrink-0">
                  <svg viewBox="0 0 40 40" className="w-7 h-7" aria-hidden="true">
                    <rect width="40" height="40" rx="9" fill="#0b6e52" />
                    <circle cx="18" cy="20" r="8.5" fill="#e0412f" />
                    <path d="M4 33 Q20 19 36 33" fill="none" stroke="#e8b04a" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#e8b04a] font-bold">
                    Bangladesh China Club
                  </div>
                  <div className="text-[11px] text-[#9bb3a8] font-serif">
                    孟中俱乐部 · VIP Member Pass
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code for Gate/Reception Access */}
              <div
                className="p-1.5 bg-white rounded-xl shadow-md flex-shrink-0 transform group-hover:scale-105 transition-transform"
                title="Scan at Entrance Gate & Reception"
                dangerouslySetInnerHTML={{ __html: qrSVG(member.id.charCodeAt(4) || 21, 60) }}
              />
            </div>

            {/* Member Identity Details */}
            <div className="mb-6 relative z-10">
              <div className="text-xl sm:text-2xl font-serif font-bold tracking-wide text-white flex items-center gap-2">
                <span>{member.name}</span>
                {member.nat && (
                  <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold border border-white/10">
                    {member.nat}
                  </span>
                )}
              </div>
              {member.alt && (
                <div className="text-sm text-[#9bb3a8] font-serif mt-0.5">{member.alt}</div>
              )}
              <div className="text-xs text-[#e8b04a]/90 font-mono mt-1.5 flex items-center gap-1.5">
                <span>✉️</span>
                <span>{member.email}</span>
              </div>
            </div>

            {/* Card Footer: Metadata Grid */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/15 text-xs relative z-10">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#8fa89c]">Member ID</div>
                <div className="font-mono font-bold text-white tracking-wider">{member.id}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#8fa89c]">Tier</div>
                <div className="font-serif font-semibold text-[#e8b04a]">{member.tier}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#8fa89c]">Joined</div>
                <div className="font-semibold text-white">{member.year}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Key Member Metrics Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          {/* Card 1: Outstanding Dues & Instant Pay */}
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-bcc-muted">
                  {lang === 'bn' ? 'বকেয়া সাবস্ক্রিপশন (Dues)' : 'Outstanding Dues'}
                </span>
                <Pill
                  text={status}
                  variant={status === 'Active' ? 'ok' : status === 'Overdue' ? 'warn' : 'bad'}
                />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-bcc-red mt-2">
                {dues > 0 ? money(dues) : '৳0'}
              </div>
              <p className="text-[11px] text-bcc-muted mt-1">
                {member.over > 0 ? `${member.over} month(s) overdue` : 'All club dues cleared'}
              </p>
            </div>

            <div className="pt-3">
              {dues > 0 ? (
                <button
                  onClick={() => collectDues(member)}
                  className="w-full py-2 px-3 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>💳</span>
                  <span>{lang === 'bn' ? 'বকেয়া পরিশোধ করুন (Pay Now)' : 'Pay Dues Online'}</span>
                </button>
              ) : (
                <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span>✓</span>
                  <span>{lang === 'bn' ? 'কোনো বকেয়া নেই' : 'Account in Good Standing'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: MTD Club Spend */}
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-bcc-muted">
                {lang === 'bn' ? 'চলতি মাসের খরচ (Spend MTD)' : 'Spend (MTD)'}
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-bcc-text mt-2">
                {money(member.spend)}
              </div>
              <p className="text-[11px] text-bcc-muted mt-1">
                Dining, Hotel Stay & Club Services
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setView('pos')}
                className="w-full py-2 px-3 rounded-xl border border-bcc-line hover:bg-black/5 dark:hover:bg-white/5 text-bcc-text text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>🥢</span>
                <span>{lang === 'bn' ? 'রেস্তোরাঁ ও মেনু' : 'Order Dining'}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Friendship Reward Points */}
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-bcc-muted">
                {lang === 'bn' ? 'বন্ধুত্ব রিওয়ার্ড পয়েন্টস' : 'BCC Friendship Points'}
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#b58117] dark:text-[#f3c258] mt-2">
                {(Math.round(member.spend * 0.12) + 240).toLocaleString()} <span className="text-sm font-sans font-medium text-bcc-muted">pts</span>
              </div>
              <p className="text-[11px] text-bcc-muted mt-1">
                Redeemable at Silk Route & Tea Garden
              </p>
            </div>

            <div className="pt-3">
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40 inline-block">
                VIP Tier Status Active
              </span>
            </div>
          </div>

          {/* Card 4: 10-Floor Smart Facilities */}
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-bcc-muted">
                {lang === 'bn' ? '১০-তলা সুবিধা ও রুম' : '10-Floor Access'}
              </div>
              <div className="text-lg font-serif font-bold text-bcc-text mt-2 flex items-center gap-1.5">
                <span>🏢 10 Floors Active</span>
              </div>
              <p className="text-[11px] text-bcc-muted mt-1">
                Gym (Fl 8) · Pool (Fl 9) · Suites (Fl 4-7)
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setView('stay')}
                className="w-full py-2 px-3 rounded-xl bg-bcc-surface2 hover:bg-bcc-line text-bcc-text text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>🛏️</span>
                <span>{lang === 'bn' ? 'রুম বুকিং করুন' : 'Book Hotel Room'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex border-b border-bcc-line gap-2 overflow-x-auto pb-px">
        {[
          { id: 'card', label: lang === 'bn' ? 'সদস্য পরিচিতি ও সুবিধা' : 'Profile & Privileges', icon: '👤' },
          { id: 'dues', label: lang === 'bn' ? 'বকেয়া ও অ্যাকাউন্ট স্টেটমেন্ট' : 'Dues & Invoices', icon: '🧾' },
          { id: 'book', label: lang === 'bn' ? 'রুম ও ডাইনিং বুকিং' : 'Bookings & Reservations', icon: '🏨' },
          { id: 'orders', label: lang === 'bn' ? 'এআই ফুড অর্ডার হিস্ট্রি' : 'Orders & AI Concierge', icon: '🤖' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-serif font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#0b6e52] text-[#0b6e52] dark:text-[#26a67a] bg-black/[0.02] dark:bg-white/[0.02]'
                : 'border-transparent text-bcc-muted hover:text-bcc-text'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Member Profile & Privileges */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Left: Official Membership Record */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-bcc-text flex items-center gap-2">
              <span>📋</span>
              <span>Official Membership Information</span>
            </h3>

            <div className="space-y-3 divide-y divide-bcc-line text-xs">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Full Legal Name</span>
                <span className="font-bold font-serif text-bcc-text">{member.name}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Bilingual / Native Name</span>
                <span className="font-serif text-bcc-text">{member.alt || '–'}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Member ID Number</span>
                <span className="font-mono font-bold text-bcc-text">{member.id}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Super Admin Registered Gmail</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {member.email}
                </span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Membership Tier</span>
                <span className="font-semibold text-bcc-text">{member.tier} Member</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Country / Nationality</span>
                <span className="font-semibold text-bcc-text">{member.nat === 'BD' ? 'Bangladesh 🇧🇩' : member.nat === 'CN' ? 'China 🇨🇳' : 'Diplomatic 🌐'}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Membership Enrollment Year</span>
                <span className="font-semibold text-bcc-text">{member.year}</span>
              </div>
            </div>
          </div>

          {/* Right: VIP Privileges & Benefits */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-bcc-text flex items-center gap-2">
              <span>👑</span>
              <span>Bilateral Club VIP Privileges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1">
                <div className="font-bold text-bcc-text flex items-center gap-1.5">
                  <span>🏊</span>
                  <span>Pool & Fitness</span>
                </div>
                <p className="text-[11px] text-bcc-muted">Complimentary daily access to Olympic Pool (Fl 9) and Gym (Fl 8).</p>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1">
                <div className="font-bold text-bcc-text flex items-center gap-1.5">
                  <span>🥢</span>
                  <span>15% Dining Discount</span>
                </div>
                <p className="text-[11px] text-bcc-muted">Exclusive discount at Silk Route Restaurant, Lantern Bar & Tea Garden.</p>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1">
                <div className="font-bold text-bcc-text flex items-center gap-1.5">
                  <span>🏨</span>
                  <span>Priority Guest Rooms</span>
                </div>
                <p className="text-[11px] text-bcc-muted">Deluxe Hotel rooms on Fl 4 & 5 with 24-hr concierge check-in.</p>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1">
                <div className="font-bold text-bcc-text flex items-center gap-1.5">
                  <span>🎉</span>
                  <span>Bilateral Events</span>
                </div>
                <p className="text-[11px] text-bcc-muted">Invitations to diplomatic dinners, tea ceremonies & banquets.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
              💡 <b>Tip:</b> Need assistance with room reservation, table booking or food delivery? Just open our <b>Club AI Assistant</b> at the bottom right anytime!
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dues & Ledger */}
      {activeTab === 'dues' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-base text-bcc-text">
                Current Subscription & Dues Status
              </h3>
              <p className="text-xs text-bcc-muted mt-0.5">
                Monthly membership fee: ৳3,500 · Billing cycle: 1st of every month
              </p>
            </div>

            {dues > 0 ? (
              <button
                onClick={() => collectDues(member)}
                className="px-5 py-2.5 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>💳 Pay Outstanding Dues ({money(dues)})</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold border border-emerald-300">
                ✓ No Dues Pending
              </div>
            )}
          </div>

          {/* Statement History */}
          <div className="bg-bcc-surface border border-bcc-line rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-bcc-line font-serif font-bold text-sm text-bcc-text">
              Recent Account Ledger Statements
            </div>
            <div className="overflow-x-auto">
              <table className="custom-table">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5">
                    <th>Transaction Description</th>
                    <th className="text-right">Billing Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map(([desc, amt], idx) => (
                    <tr key={idx}>
                      <td className="text-xs">{desc}</td>
                      <td
                        className={`text-xs text-right font-mono font-semibold ${
                          amt > 0 ? 'text-emerald-600' : 'text-bcc-muted'
                        }`}
                      >
                        {amt > 0 ? `+${money(amt)}` : money(amt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Quick Bookings & Facility Reservation */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Booking 1: Hotel Rooms */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0b6e52]/10 text-[#0b6e52] dark:text-emerald-400 flex items-center justify-center text-2xl mb-3">
                🛏️
              </div>
              <h4 className="font-serif font-bold text-base text-bcc-text">Club Guest Stay</h4>
              <p className="text-xs text-bcc-muted mt-1">
                Luxury deluxe rooms and suites located on Floors 4, 5, and 7. Book guest accommodations at member-exclusive rates.
              </p>
            </div>
            <button
              onClick={() => setView('stay')}
              className="w-full py-2.5 px-4 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white text-xs font-semibold shadow-md transition-colors"
            >
              Reserve Room in Stay
            </button>
          </div>

          {/* Booking 2: Restaurant Dining */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#e0412f]/10 text-[#e0412f] flex items-center justify-center text-2xl mb-3">
                🥢
              </div>
              <h4 className="font-serif font-bold text-base text-bcc-text">Silk Route Dining</h4>
              <p className="text-xs text-bcc-muted mt-1">
                Reserve tables at Silk Route Chinese Restaurant (Fl 2), Lantern Bar (Fl 2), or Tea Garden Café (Fl 3).
              </p>
            </div>
            <button
              onClick={() => setView('pos')}
              className="w-full py-2.5 px-4 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white text-xs font-semibold shadow-md transition-colors"
            >
              Book Table & Dining
            </button>
          </div>

          {/* Booking 3: Pool & Fitness */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl mb-3">
                🏊
              </div>
              <h4 className="font-serif font-bold text-base text-bcc-text">Fitness & Wellness</h4>
              <p className="text-xs text-bcc-muted mt-1">
                Olympic swimming pool on Floor 9, full gym and sauna on Floor 8. Reserve personal trainer slots or spa sessions.
              </p>
            </div>
            <button
              onClick={() => setView('fit')}
              className="w-full py-2.5 px-4 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white text-xs font-semibold shadow-md transition-colors"
            >
              Explore Fitness & Sports
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Orders & AI Concierge */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0b6e52] to-[#128a67] text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg">Smart AI In-Chat Ordering Active</h3>
              <p className="text-xs text-emerald-100 mt-1">
                You can order food, coffee, passes, and beverages directly through our 24/7 Club AI Assistant!
              </p>
            </div>
            <button
              onClick={() => openChat('I want 2 burgers')}
              className="px-4 py-2.5 rounded-xl bg-[#e8b04a] text-[#071d16] font-serif font-bold text-xs shadow-md hover:bg-[#d49e38] transition-colors whitespace-nowrap"
            >
              🍔 Try "I want 2 burgers"
            </button>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-bcc-surface border border-bcc-line rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-bcc-line font-serif font-bold text-sm text-bcc-text">
              Recent Food & Beverage Orders
            </div>
            <div className="overflow-x-auto">
              <table className="custom-table">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5">
                    <th>Order No.</th>
                    <th>Outlet & Floor</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th className="text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberTransactions.map((t, idx) => (
                    <tr key={t.id || idx}>
                      <td className="font-mono text-xs font-semibold">{t.id}</td>
                      <td className="text-xs font-medium">{t.outlet} (Floor 2/3)</td>
                      <td className="text-xs">{t.method}</td>
                      <td>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                          {t.st}
                        </span>
                      </td>
                      <td className="text-xs font-mono font-bold text-right">{money(t.amount)}</td>
                    </tr>
                  ))}
                  {memberTransactions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-bcc-muted text-sm">
                        No orders recorded yet. Ask Club AI to order coffee or dishes!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

