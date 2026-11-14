import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { money, qrSVG } from '../../utils/formatters';
import { mStatus, mDue, getMemberLedger } from '../../utils/helpers';
import Pill from '../common/Pill';

export default function MemberDetailModal() {
  const { modal, closeModal, collectDues, updateMemberEmail } = useApp();
  const member = modal.data;

  const [editEmail, setEditEmail] = useState(member?.email || '');

  if (!member) return null;

  const status = mStatus(member);
  const dues = mDue(member);
  const ledger = getMemberLedger(member);

  const handleSaveEmail = () => {
    if (editEmail.trim()) {
      updateMemberEmail(member.id, editEmail.trim());
      member.email = editEmail.trim();
    }
  };

  return (
    <div className="space-y-5">
      {/* Digital Member Card */}
      <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#0c241d] to-[#1a4a3c] text-white shadow-xl border border-[#e8b04a]/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8b04a]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8b04a]" />
              <span className="text-[11px] uppercase tracking-widest text-[#e8b04a] font-bold">
                Bangladesh China Club
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif tracking-wide">{member.name}</h3>
            {member.alt && <span className="text-sm text-[#98b0a5] font-serif">{member.alt}</span>}
          </div>

          <div
            className="p-1.5 bg-white rounded-lg shadow-inner flex-shrink-0"
            dangerouslySetInnerHTML={{ __html: qrSVG(member.id.charCodeAt(4) || 21, 64) }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
          <div>
            <div className="text-[10px] text-[#8fa89c] uppercase">Member No.</div>
            <div className="font-mono font-bold">{member.id}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#8fa89c] uppercase">Tier</div>
            <div className="font-semibold">{member.tier}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#8fa89c] uppercase">Member Since</div>
            <div className="font-semibold">{member.year}</div>
          </div>
        </div>
      </div>

      {/* Super Admin Login Gmail Assignment */}
      <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-bcc-line space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-bcc-text flex items-center gap-1.5">
            <span>📧</span>
            <span>Member Login Gmail (সুপার এডমিন কর্তৃক নির্ধারিত)</span>
          </label>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Authorized Login
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="e.g. member.name@gmail.com"
            className="flex-1 px-3 py-1.5 rounded-lg border border-bcc-line bg-bcc-surface text-xs font-mono"
          />
          <button
            type="button"
            onClick={handleSaveEmail}
            className="px-3.5 py-1.5 rounded-lg bg-[#0b6e52] hover:bg-[#095842] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
          >
            Save Gmail
          </button>
        </div>
        <p className="text-[10.5px] text-bcc-muted">
          Member can only log into Member Dashboard using this specific Super Admin assigned Gmail.
        </p>
      </div>

      {/* Status & Dues Info */}
      <div className="flex items-center justify-between p-3.5 bg-black/5 dark:bg-white/5 rounded-xl border border-bcc-line">
        <div>
          <div className="text-xs text-bcc-muted">Membership Status</div>
          <div className="mt-1 flex items-center gap-2">
            <Pill
              text={status}
              variant={status === 'Active' ? 'ok' : status === 'Overdue' ? 'warn' : 'bad'}
            />
            {member.over > 0 && (
              <span className="text-xs text-bcc-muted font-medium">
                {member.over} month{member.over > 1 ? 's' : ''} unpaid
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-bcc-muted">Dues Outstanding</div>
          <div className="text-lg font-bold font-serif text-bcc-red">
            {dues > 0 ? money(dues) : '৳0'}
          </div>
        </div>
      </div>

      {dues > 0 && (
        <button
          onClick={() => {
            closeModal();
            collectDues(member);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-bcc-btn text-white text-sm font-semibold hover:bg-bcc-btn-h shadow-md transition-colors"
        >
          Collect Outstanding Dues ({money(dues)})
        </button>
      )}

      {/* Ledger History */}
      <div>
        <h4 className="text-sm font-bold font-serif mb-2">Recent Account Statement</h4>
        <div className="overflow-x-auto rounded-xl border border-bcc-line">
          <table className="custom-table">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5">
                <th>Description</th>
                <th className="text-right">Amount</th>
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
  );
}

