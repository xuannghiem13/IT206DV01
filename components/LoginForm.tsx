'use client';

import React, { useState } from 'react';
import { UserAccount } from '@/lib/types';
import { SAMPLE_ACCOUNTS, ROLES } from '@/lib/seedData';
import { Building2, Lock, User, ShieldCheck, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (uname?: string, pwd?: string) => {
    const userToLogin = uname || username;
    const passToLogin = pwd || password;

    if (!userToLogin || !passToLogin) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userToLogin, password: passToLogin })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Đăng nhập không thành công');
        return;
      }

      onLoginSuccess(data.user);
    } catch (err) {
      setError('Không thể kết nối máy chủ xác thực');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (account: typeof SAMPLE_ACCOUNTS[0]) => {
    setUsername(account.username);
    setPassword(account.password);
    handleLogin(account.username, account.password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50">
      {/* Background ambient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-violet-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-xl shadow-indigo-600/20 text-white mb-2">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            SUNRISE LIVING
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Hệ thống Quản lý Căn hộ Dịch vụ & Phòng trọ thông minh với phân quyền 5 bộ phận và cư dân
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Đăng nhập hệ thống</h2>
              <p className="text-xs text-slate-500">Đăng nhập để điều hướng trực tiếp đến bộ phận của bạn</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Bảo mật RBAC
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-shake">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tên đăng nhập (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="VD: chutro, quanly, ketoan, khachthue..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật khẩu (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu (mặc định demo: 123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                'Đang xác thực...'
              ) : (
                <>
                  <span>Đăng Nhập Vào Hệ Thống</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="pt-5 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Tài khoản demo kiểm thử nhanh (1-Click):
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Pass chung: 123</span>
            </div>

            {/* Nhóm 1: Ban quản trị & Các bộ phận */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 block">
                🏢 Ban Quản Trị & 4 Bộ Phận:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SAMPLE_ACCOUNTS.filter(a => a.role !== 'tenant').map((acc) => {
                  const roleObj = ROLES.find((r) => r.key === acc.role);
                  return (
                    <button
                      key={acc.userId}
                      type="button"
                      onClick={() => handleQuickLogin(acc)}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{acc.avatar}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white text-indigo-700 border border-slate-200">
                          {acc.username}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                        {roleObj?.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {acc.role === 'owner' ? 'Toàn quyền hệ thống' : acc.department}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nhóm 2: Khách thuê từng phòng */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-emerald-700 block">
                🏠 Khách Thuê Căn Hộ (Kiểm thử thanh toán từng phòng):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {SAMPLE_ACCOUNTS.filter(a => a.role === 'tenant').map((acc) => {
                  return (
                    <button
                      key={acc.userId}
                      type="button"
                      onClick={() => handleQuickLogin(acc)}
                      className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-left transition group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <span>🏠</span> Phòng {acc.roomNumber}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white text-emerald-700 border border-emerald-200">
                          {acc.username}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                        {acc.fullName}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {acc.roomNumber === '101' ? 'Đã thanh toán (6.26tr)' : acc.roomNumber === '201' ? 'Chưa thanh toán (7.56tr)' : acc.roomNumber === '203' ? 'Quá hạn nộp (8.51tr)' : 'Chưa thanh toán (10.8tr)'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Security / Role Notice */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-slate-700 space-y-1">
          <p className="font-semibold text-indigo-800 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            Cơ chế phân quyền nghiêm ngặt:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
            <li><strong>Khách thuê:</strong> Là người duy nhất thực hiện thanh toán tiền phòng (quét mã VietQR). Chỉ xem được phòng của mình.</li>
            <li><strong>Chủ trọ / Kế toán:</strong> Không phải người thanh toán, chỉ có nhiệm vụ lập hóa đơn và xác nhận thu tiền/đối soát công nợ.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
