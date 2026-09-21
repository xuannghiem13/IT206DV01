'use client';

import React from 'react';
import { UserRole, UserAccount } from '@/lib/types';
import { ROLES } from '@/lib/seedData';
import { 
  Building2, LayoutDashboard, DoorOpen, Users, 
  Zap, Wrench, Receipt, UserCheck, Shield, LogOut 
} from 'lucide-react';

interface NavigationProps {
  currentUser: UserAccount | null;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentUser,
  onLogout,
  activeTab,
  onTabChange,
}) => {
  if (!currentUser) return null;

  const currentRoleInfo = ROLES.find(r => r.key === currentUser.role) || ROLES[0];
  const allowedTabs = currentRoleInfo.allowedTabs || ['dashboard'];

  // Toàn bộ các tab hệ thống
  const allTabs = [
    { id: 'dashboard', label: 'Tổng quan hệ thống', icon: LayoutDashboard },
    { id: 'rooms', label: 'Phòng & Khách thuê', icon: DoorOpen },
    { id: 'utilities', label: 'Điện & Nước', icon: Zap },
    { id: 'maintenance', label: 'Kỹ thuật & Sự cố', icon: Wrench },
    { id: 'invoices', label: 'Hóa đơn & Kế toán', icon: Receipt },
    { id: 'hr', label: 'Nhân sự & Chấm công', icon: UserCheck },
    { id: 'tenant-portal', label: 'Cổng Khách thuê', icon: Users },
  ];

  // Lọc nghiêm ngặt: Chỉ hiển thị các tab mà tài khoản này có quyền truy cập
  const visibleTabs = allTabs.filter(tab => allowedTabs.includes(tab.id));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand + User Profile + Logout */}
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/20 text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">SUNRISE LIVING</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SQL + Vercel
                </span>
              </div>
              <p className="text-xs text-slate-500">Hệ thống Quản lý Căn hộ Dịch vụ</p>
            </div>
          </div>

          {/* Logged in User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xl">{currentUser.avatar || '👤'}</span>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.fullName}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="text-indigo-600 font-semibold">{currentRoleInfo.name}</span>
                  {currentUser.roomNumber && (
                    <span className="text-emerald-700 font-semibold">• P.{currentUser.roomNumber}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition cursor-pointer"
              title="Đăng xuất khỏi tài khoản này"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Sub-bar: Navigation Tabs (STRICTLY FILTERED) */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="ml-auto flex items-center text-xs text-slate-500 gap-2 pl-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden md:inline">
              Bộ phận: <strong className="text-slate-800">{currentRoleInfo.department}</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
