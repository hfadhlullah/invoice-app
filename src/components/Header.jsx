import React, { useState, useRef, useEffect } from 'react';

export default function Header({ onToggleInvoices, onLogout, currentUser, onNewInvoice }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 print:hidden">
  <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">InvGen</h1>
          </div>
          
        {/* Invoices menu */}
          <InvoicesMenu
            onToggleInvoices={onToggleInvoices}
            onNewInvoice={onNewInvoice}
          />
        </div>
        
  <div className="flex items-center gap-2 sm:gap-3">
          

          {/* User profile / Logout dropdown */}
          <div className="relative">
            <ProfileButton
              currentUser={currentUser}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function ProfileButton({ currentUser, onLogout }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setConfirmOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  const email = currentUser?.email || '';
  const alias = email.split('@')[0] || '';
  // Create simple display name: replace dots/underscores with space and title-case
  const displayName = alias.replace(/[._]/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const initials = displayName.split(' ').map(s => s[0] || '').slice(0,2).join('').toUpperCase() || 'U';

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-100 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        title={email}
      >
        <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <span className="hidden sm:inline text-sm text-gray-700">{displayName || email}</span>
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2 px-3 text-sm text-gray-700">
            <div className="font-medium">{displayName || 'User'}</div>
            <div className="text-xs text-gray-500 truncate">{email}</div>
            <div className="mt-2">
              <button
                onClick={() => { setOpen(false); setConfirmOpen(true); }}
                className="w-full text-left px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto z-50">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm logout</h3>
              <p className="mt-2 text-sm text-gray-600">Are you sure you want to logout{email ? ` (${email})` : ''}?</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setConfirmOpen(false); onLogout && onLogout(); }}
                  className="px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoicesMenu({ onToggleInvoices, onNewInvoice }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(v => !v)}
        className="px-3 sm:px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm sm:text-base"
        aria-haspopup="true"
        aria-expanded={open}
        title="Invoices"
      >
        <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M9 16h6M9 8h6M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline">Invoices</span>
        <svg className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => { setOpen(false); onToggleInvoices && onToggleInvoices(); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              role="menuitem"
            >
              View saved invoices
            </button>
            <button
              onClick={() => { setOpen(false); if (onNewInvoice) onNewInvoice(); }}
              className={`w-full text-left px-4 py-2 text-sm ${onNewInvoice ? 'text-slate-700 hover:bg-slate-50' : 'text-gray-400'}`}
              role="menuitem"
              disabled={!onNewInvoice}
            >
              New invoice
            </button>
            <div className="border-t border-slate-100 my-1" />
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setOpen(false); onToggleInvoices && onToggleInvoices(); }}
              className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Open invoice drawer
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
