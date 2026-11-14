import React from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_NAMES, TRANSLATIONS } from '../../data/constants';

export default function Header() {
  const { role, setRole, lang, setLang, view, currentMember, logout } = useApp();

  const title = role === 'member'
    ? (view === 'member_dash'
        ? (lang === 'bn' ? `সদস্য পোর্টাল · ${currentMember?.name || ''}` : `Member Portal · ${currentMember?.name || ''}`)
        : TRANSLATIONS[lang]?.[view] || view)
    : TRANSLATIONS[lang]?.[view] || view;

  const alternateLanguages = ['en', 'bn', 'zh'].filter((l) => l !== lang);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 flex-wrap px-4 sm:px-8 py-3.5 bg-bcc-bg/90 backdrop-blur-md border-b border-bcc-line">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-bcc-text font-serif">
          {title}
        </h1>
        <div className="flex gap-3 text-xs text-bcc-muted font-serif mt-0.5">
          {role === 'member' && currentMember ? (
            <span className="text-[#0b6e52] dark:text-[#26a67a] font-semibold">
              ID: {currentMember.id} · {currentMember.tier} Member
            </span>
          ) : (
            alternateLanguages.map((l) => (
              <span key={l}>{TRANSLATIONS[l]?.[view] || ''}</span>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap ml-auto">
        {role === 'member' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 font-semibold font-mono">
              {currentMember?.email}
            </span>
            <button
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold transition-colors"
            >
              {lang === 'bn' ? 'লগ আউট' : 'Log Out'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <label htmlFor="role-select" className="text-xs text-bcc-muted font-medium hidden sm:inline">
              Signed in as
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-bcc-line bg-bcc-surface text-bcc-text shadow-sm focus:outline-none focus:ring-2 focus:ring-bcc-gold font-medium"
            >
              {Object.keys(ROLE_NAMES).map((r) => (
                <option key={r} value={r}>
                  {ROLE_NAMES[r]}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex border border-bcc-line rounded-full overflow-hidden bg-bcc-surface/80 p-0.5 shadow-sm" role="group" aria-label="Language">
          {[
            { code: 'en', label: 'EN' },
            { code: 'bn', label: 'বাং' },
            { code: 'zh', label: '中文' }
          ].map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                lang === code
                  ? 'bg-bcc-text text-bcc-bg shadow-sm'
                  : 'text-bcc-muted hover:text-bcc-text hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

