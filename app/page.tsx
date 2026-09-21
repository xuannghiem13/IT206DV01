'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserRole, UserAccount, Room, Tenant, Contract, UtilityReading, 
  Invoice, Employee, AttendanceRecord, MaintenanceRequest, SystemStats, SystemPricing 
} from '@/lib/types';
import { ROLES, SAMPLE_ACCOUNTS } from '@/lib/seedData';
import { LoginForm } from '@/components/LoginForm';
import { Navigation } from '@/components/Navigation';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/components/StatusBadge';
import { VietQRModal } from '@/components/VietQRModal';
import { AddRoomModal } from '@/components/AddRoomModal';
import { RecordUtilityModal } from '@/components/RecordUtilityModal';
import { ReportIssueModal } from '@/components/ReportIssueModal';
import { FixIssueModal } from '@/components/FixIssueModal';
import { AttendanceModal } from '@/components/AttendanceModal';
import { PricingSettingsModal } from '@/components/PricingSettingsModal';

import { 
  Building2, DoorOpen, Users, Zap, Wrench, 
  Receipt, UserCheck, DollarSign, Plus, CheckCircle, 
  AlertCircle, QrCode, Filter, RefreshCw, Phone, 
  FileText, Calendar, ShieldCheck, Clock, ShieldAlert, Settings
} from 'lucide-react';

export default function HomePage() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [pricing, setPricing] = useState<SystemPricing>({
    electricPrice: 3500,
    waterPrice: 25000,
    internetFee: 100000,
    cleaningFee: 50000,
    bankCode: 'MB',
    bankName: 'MBBank (Ngân hàng Quân Đội)',
    accountNo: '0909123456',
    accountName: 'CHU TRO CAN HO DICH VU'
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Data states
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [utilities, setUtilities] = useState<UtilityReading[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [roomFilterStatus, setRoomFilterStatus] = useState<string>('all');
  const [roomFilterFloor, setRoomFilterFloor] = useState<string>('all');
  const [maintenanceFilter, setMaintenanceFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Modal states
  const [selectedInvoiceForQR, setSelectedInvoiceForQR] = useState<Invoice | null>(null);
  const [selectedMaintenanceForFix, setSelectedMaintenanceForFix] = useState<MaintenanceRequest | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showUtilityModal, setShowUtilityModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Load saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sunrise_user');
      if (saved) {
        const user: UserAccount = JSON.parse(saved);
        setCurrentUser(user);
        const roleInfo = ROLES.find(r => r.key === user.role);
        if (roleInfo) {
          setActiveTab(roleInfo.defaultTab);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthInitialized(true);
    }
  }, []);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        roomsRes, tenantsRes, contractsRes, 
        utilitiesRes, invoicesRes, employeesRes, 
        attendanceRes, maintenanceRes, statsRes, pricingRes
      ] = await Promise.all([
        fetch('/api/rooms').then(r => r.json()),
        fetch('/api/tenants').then(r => r.json()),
        fetch('/api/contracts').then(r => r.json()),
        fetch('/api/utilities').then(r => r.json()),
        fetch('/api/invoices').then(r => r.json()),
        fetch('/api/employees').then(r => r.json()),
        fetch('/api/attendance').then(r => r.json()),
        fetch('/api/maintenance').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
      ]);

      setRooms(roomsRes || []);
      setTenants(tenantsRes || []);
      setContracts(contractsRes || []);
      setUtilities(utilitiesRes || []);
      setInvoices(invoicesRes || []);
      setEmployees(employeesRes || []);
      setAttendance(attendanceRes || []);
      setMaintenance(maintenanceRes || []);
      setStats(statsRes || null);
      if (pricingRes) setPricing(pricingRes);
    } catch (err) {
      console.error('Failed to load system data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Handle Login
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('sunrise_user', JSON.stringify(user));
    const roleInfo = ROLES.find(r => r.key === user.role);
    if (roleInfo) {
      setActiveTab(roleInfo.defaultTab);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('sunrise_user');
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // Quick action: update room status
  const handleUpdateRoomStatus = async (roomId: number, newStatus: Room['status']) => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, status: newStatus })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Quick action: mark cash payment
  const handleCashPayment = async (invoice: Invoice) => {
    const remaining = invoice.totalAmount - invoice.paidAmount;
    if (confirm(`Xác nhận thu tiền mặt ${remaining.toLocaleString('vi-VN')} đ từ phòng ${invoice.roomNumber}?`)) {
      try {
        const res = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: invoice.invoiceId,
            amount: remaining,
            paymentMethod: 'Tiền mặt'
          })
        });
        if (res.ok) fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Wait for session check
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Đang kiểm tra phiên làm việc...</span>
        </div>
      </div>
    );
  }

  // IF NOT LOGGED IN -> SHOW LOGIN PAGE
  if (!currentUser) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // RBAC: Check permitted tabs for current user
  const currentRoleInfo = ROLES.find(r => r.key === currentUser.role) || ROLES[0];
  const allowedTabs = currentRoleInfo.allowedTabs || ['tenant-portal'];

  // Security Guard: If activeTab is not allowed, force redirect to user's default tab
  const isTabAllowed = allowedTabs.includes(activeTab);
  const effectiveTab = isTabAllowed ? activeTab : currentRoleInfo.defaultTab;

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchStatus = roomFilterStatus === 'all' || room.status === roomFilterStatus;
    const matchFloor = roomFilterFloor === 'all' || room.floor.toString() === roomFilterFloor;
    return matchStatus && matchFloor;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white pb-16">
      {/* Top Navigation */}
      <Navigation
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={effectiveTab}
        onTabChange={setActiveTab}
      />

      {/* Role Banner / Context */}
      <div className="bg-white border-b border-slate-200/80 py-2.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">{currentUser.avatar || '👤'}</span>
            <span className="text-slate-500 font-medium">Đang đăng nhập:</span>
            <strong className="text-slate-900 font-bold">{currentUser.fullName}</strong>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              {currentRoleInfo.name}
            </span>
            <span className="text-slate-500 hidden md:inline">• {currentRoleInfo.description}</span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {currentUser.role === 'tenant' && currentUser.roomNumber && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Cư dân Phòng {currentUser.roomNumber}
              </span>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition cursor-pointer font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
              <span>Đồng bộ CSDL SQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* ACCESS DENIED FALLBACK (IF USER TRIES TAMPERING WITH TABS) */}
        {!isTabAllowed && (
          <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3 animate-fade-in shadow-xs">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Bạn không có quyền truy cập tab này</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Tài khoản {currentUser.fullName} ({currentRoleInfo.name}) chỉ được phép thao tác trong phạm vi chuyên môn được phân quyền.
            </p>
            <button
              onClick={() => setActiveTab(currentRoleInfo.defaultTab)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs"
            >
              Quay về khu vực được cấp quyền ({currentRoleInfo.name})
            </button>
          </div>
        )}

        {/* TAB 1: DASHBOARD (CHỦ TRỌ) */}
        {isTabAllowed && effectiveTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Tỷ lệ lấp đầy phòng"
                value={`${stats?.occupancyRate || 0}%`}
                subtitle={`${stats?.occupiedRooms || 0} đang thuê / ${stats?.totalRooms || 0} tổng phòng`}
                icon={<DoorOpen className="w-5 h-5" />}
                trend="5.2%"
                trendPositive={true}
                colorScheme="blue"
              />
              <MetricCard
                title="Doanh thu dự kiến tháng"
                value={`${((stats?.totalMonthlyRevenue || 0) / 1000000).toFixed(1)} tr đ`}
                subtitle={`Đã thu: ${((stats?.totalCollected || 0) / 1000000).toFixed(1)} tr đ`}
                icon={<DollarSign className="w-5 h-5" />}
                trend="12%"
                trendPositive={true}
                colorScheme="emerald"
              />
              <MetricCard
                title="Công nợ chưa thanh toán"
                value={`${((stats?.totalOutstandingDebt || 0) / 1000000).toFixed(1)} tr đ`}
                subtitle={`${invoices.filter(i => i.status === 'Chưa thanh toán' || i.status === 'Quá hạn').length} hóa đơn tồn đọng`}
                icon={<Receipt className="w-5 h-5" />}
                trend="Cần thu hồi"
                trendPositive={false}
                colorScheme="rose"
              />
              <MetricCard
                title="Sự cố kỹ thuật đang xử lý"
                value={stats?.pendingMaintenanceRequests || 0}
                subtitle={`${maintenance.filter(m => m.priority === 'Khẩn cấp').length} sự cố khẩn cấp`}
                icon={<Wrench className="w-5 h-5" />}
                trend="Ưu tiên cao"
                trendPositive={false}
                colorScheme="amber"
              />
            </div>

            {/* Room Matrix Status Overview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    Sơ Đồ Phòng Trực Quan (Tòa Sunrise Building Q1)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Theo dõi trạng thái thời gian thực và khách thuê từng phòng</p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-600 font-medium">Trống ({stats?.vacantRooms || 0})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-slate-600 font-medium">Đang thuê ({stats?.occupiedRooms || 0})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-slate-600 font-medium">Sửa chữa ({stats?.maintenanceRooms || 0})</span>
                  </div>
                </div>
              </div>

              {/* Grid of rooms */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {rooms.map(room => (
                  <div 
                    key={room.roomId}
                    className={`rounded-2xl p-4 border transition duration-200 relative ${
                      room.status === 'Trống'
                        ? 'bg-emerald-50/70 border-emerald-200/90 hover:border-emerald-400'
                        : room.status === 'Đang thuê'
                        ? 'bg-blue-50/70 border-blue-200/90 hover:border-blue-400'
                        : 'bg-amber-50/70 border-amber-200/90 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xl font-black text-slate-900">P.{room.roomNumber}</span>
                        <p className="text-xs text-slate-500">Tầng {room.floor} • {room.roomType}</p>
                      </div>
                      <StatusBadge status={room.status} />
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/80 text-xs space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-500">Giá thuê:</span>
                        <span className="font-semibold text-emerald-700">{room.basePrice.toLocaleString()} đ</span>
                      </div>
                      {room.tenantName ? (
                        <div className="flex justify-between text-slate-600 truncate">
                          <span className="text-slate-500">Khách:</span>
                          <span className="font-medium text-indigo-700 truncate">{room.tenantName}</span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-emerald-600 italic">Sẵn sàng nhận khách mới</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Two-Column: Maintenance Alerts & Overdue Invoices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Urgent Maintenance */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Sự Cố Kỹ Thuật Đang Chờ Điều Phối
                  </h3>
                  <button
                    onClick={() => setActiveTab('maintenance')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Xem tất cả ({maintenance.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {maintenance.filter(m => m.status !== 'Hoàn thành' && m.status !== 'Hủy').slice(0, 3).map(m => (
                    <div key={m.requestId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">Phòng {m.roomNumber}: {m.title}</span>
                          <StatusBadge status={m.priority} />
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{m.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                          <span>Phân loại: <strong className="text-slate-700">{m.category}</strong></span>
                          <span>Trạng thái: <strong className="text-slate-700">{m.status}</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedMaintenanceForFix(m)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs text-indigo-700 font-medium whitespace-nowrap cursor-pointer transition shadow-xs"
                      >
                        Xử lý
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoices needing attention */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-600" />
                    Hóa Đơn Cần Thu Tiền Tháng Này
                  </h3>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Xem tất cả ({invoices.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {invoices.filter(i => i.status !== 'Đã thanh toán').map(inv => (
                    <div key={inv.invoiceId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">P.{inv.roomNumber} - {inv.tenantName}</span>
                          <StatusBadge status={inv.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Kỳ {inv.billingMonth}/{inv.billingYear} • Hạn: {inv.dueDate}
                        </p>
                        <p className="text-sm font-bold text-emerald-600 mt-1">
                          {(inv.totalAmount - inv.paidAmount).toLocaleString('vi-VN')} đ
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoiceForQR(inv)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                          title="Mở mã QR ngân hàng để gửi cho khách thuê quét thanh toán"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Xem QR gửi khách
                        </button>
                        <button
                          onClick={() => handleCashPayment(inv)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium cursor-pointer transition shadow-xs"
                          title="Ghi nhận khi khách nộp tiền mặt trực tiếp"
                        >
                          Thu tiền mặt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROOMS & TENANTS (BỘ PHẬN QUẢN LÝ) */}
        {isTabAllowed && effectiveTab === 'rooms' && (
          <div className="space-y-6 animate-fade-in">
            {/* Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <DoorOpen className="w-6 h-6 text-indigo-600" />
                  Quản Lý Phòng & Danh Sách Căn Hộ
                </h2>
                <p className="text-xs text-slate-500">Danh mục căn hộ, hợp đồng thuê và tình trạng tiếp nhận</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddRoomModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Thêm phòng mới
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
              <span className="text-slate-600 flex items-center gap-1 font-semibold">
                <Filter className="w-4 h-4 text-indigo-600" /> Bộ lọc:
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Trạng thái:</span>
                <select
                  value={roomFilterStatus}
                  onChange={e => setRoomFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white transition-colors"
                >
                  <option value="all">Tất cả ({rooms.length})</option>
                  <option value="Trống">Phòng trống</option>
                  <option value="Đang thuê">Đang thuê</option>
                  <option value="Đang sửa chữa">Đang sửa chữa</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Tầng:</span>
                <select
                  value={roomFilterFloor}
                  onChange={e => setRoomFilterFloor(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white transition-colors"
                >
                  <option value="all">Tất cả các tầng</option>
                  <option value="1">Tầng 1</option>
                  <option value="2">Tầng 2</option>
                  <option value="3">Tầng 3</option>
                </select>
              </div>
            </div>

            {/* Rooms Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRooms.map(room => (
                <div key={room.roomId} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Phòng {room.roomNumber}</h3>
                      <p className="text-xs text-slate-500">{room.buildingName || 'Sunrise Building'}</p>
                    </div>
                    <StatusBadge status={room.status} />
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Loại căn:</span>
                      <span className="font-semibold text-slate-900">{room.roomType} ({room.areaSqM} m²)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Giá thuê:</span>
                      <span className="font-bold text-emerald-600">{room.basePrice.toLocaleString()} đ/tháng</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Khách thuê hiện tại:</span>
                      <span className="font-medium text-indigo-700">{room.tenantName || 'Chưa có người thuê'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    <p className="font-semibold text-slate-700 mb-0.5">Tiện nghi:</p>
                    <p className="line-clamp-2">{room.amenities}</p>
                  </div>

                  {/* Actions for Manager */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Chuyển trạng thái:</span>
                    <div className="flex items-center gap-1.5">
                      {room.status !== 'Trống' && (
                        <button
                          onClick={() => handleUpdateRoomStatus(room.roomId, 'Trống')}
                          className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer font-medium transition"
                        >
                          Trống
                        </button>
                      )}
                      {room.status !== 'Đang thuê' && (
                        <button
                          onClick={() => handleUpdateRoomStatus(room.roomId, 'Đang thuê')}
                          className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer font-medium transition"
                        >
                          Đang thuê
                        </button>
                      )}
                      {room.status !== 'Đang sửa chữa' && (
                        <button
                          onClick={() => handleUpdateRoomStatus(room.roomId, 'Đang sửa chữa')}
                          className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 cursor-pointer font-medium transition"
                        >
                          Sửa chữa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tenant and Contracts List Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Tenants */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Hồ Sơ Khách Thuê ({tenants.length})
                </h3>
                <div className="space-y-3">
                  {tenants.map(t => (
                    <div key={t.tenantId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-sm">{t.fullName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                          Phòng {t.roomNumber}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-500 pt-1">
                        <div>SĐT: <span className="text-slate-800 font-medium">{t.phone}</span></div>
                        <div>CCCD: <span className="text-slate-800 font-medium">{t.idCard}</span></div>
                        <div>Xe: <span className="text-slate-800 font-medium">{t.vehiclePlate}</span></div>
                        <div>Quê quán: <span className="text-slate-800 font-medium">{t.permanentAddress}</span></div>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-1">Liên hệ khẩn cấp: <span className="text-slate-700">{t.emergencyContact}</span></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Contracts */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Hợp Đồng Thuê Căn Hộ ({contracts.length})
                </h3>
                <div className="space-y-3">
                  {contracts.map(c => (
                    <div key={c.contractId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-indigo-700 text-sm">{c.contractCode}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="font-medium text-slate-800">Phòng {c.roomNumber} - {c.tenantName}</span>
                        <span className="font-bold text-emerald-600">{c.monthlyRent.toLocaleString()} đ/tháng</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Thời hạn: {c.startDate} đến {c.endDate}</span>
                        <span>Tiền cọc: {c.depositAmount.toLocaleString()} đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UTILITIES (ĐIỆN & NƯỚC) */}
        {isTabAllowed && effectiveTab === 'utilities' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-amber-500" />
                  Quản Lý Chỉ Số Điện & Nước Từng Phòng
                </h2>
                <p className="text-xs text-slate-500">Ghi nhận chỉ số định kỳ, hệ thống tự tính lượng tiêu thụ và sinh hóa đơn</p>
              </div>

              <div className="flex items-center gap-2">
                {currentUser?.role === 'owner' && (
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition shadow-xs"
                    title="Chỉnh sửa đơn giá điện nước và thông tin VietQR"
                  >
                    <Settings className="w-4 h-4 text-indigo-600" />
                    Thiết lập biểu giá
                  </button>
                )}
                <button
                  onClick={() => setShowUtilityModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Chốt chỉ số điện nước mới
                </button>
              </div>
            </div>

            {/* Price tariff cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <span className="text-xs text-amber-800 font-semibold">Đơn giá Điện</span>
                <p className="text-xl font-extrabold text-amber-900 mt-1">{pricing.electricPrice.toLocaleString('vi-VN')} đ</p>
                <span className="text-[11px] text-amber-700">trên mỗi 1 kWh</span>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80">
                <span className="text-xs text-cyan-800 font-semibold">Đơn giá Nước</span>
                <p className="text-xl font-extrabold text-cyan-900 mt-1">{pricing.waterPrice.toLocaleString('vi-VN')} đ</p>
                <span className="text-[11px] text-cyan-700">trên mỗi 1 m³</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
                <span className="text-xs text-indigo-800 font-semibold">Internet Cáp quang</span>
                <p className="text-xl font-extrabold text-indigo-900 mt-1">{pricing.internetFee.toLocaleString('vi-VN')} đ</p>
                <span className="text-[11px] text-indigo-700">mỗi phòng / tháng</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/90">
                <span className="text-xs text-slate-700 font-semibold">Phí Rác & Vệ sinh</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{pricing.cleaningFee.toLocaleString('vi-VN')} đ</p>
                <span className="text-[11px] text-slate-500">mỗi phòng / tháng</span>
              </div>
            </div>

            {/* Readings History Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-sm">Bảng Lịch Sử Chốt Số Định Kỳ</h3>
                <span className="text-xs text-slate-500 font-medium">{utilities.length} bản ghi</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Phòng</th>
                      <th className="px-5 py-3.5">Kỳ ghi nhận</th>
                      <th className="px-5 py-3.5 text-amber-800">Điện cũ - mới</th>
                      <th className="px-5 py-3.5 text-amber-800">Tiêu thụ điện</th>
                      <th className="px-5 py-3.5 text-cyan-800">Nước cũ - mới</th>
                      <th className="px-5 py-3.5 text-cyan-800">Tiêu thụ nước</th>
                      <th className="px-5 py-3.5">Người chốt số</th>
                      <th className="px-5 py-3.5">Ngày chốt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {utilities.map(u => (
                      <tr key={u.readingId} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4 font-bold text-slate-900">Phòng {u.roomNumber}</td>
                        <td className="px-5 py-4 text-slate-600">Tháng {u.readingMonth}/{u.readingYear}</td>
                        <td className="px-5 py-4 font-mono text-slate-600">{u.prevElectric} → {u.currElectric}</td>
                        <td className="px-5 py-4 font-bold text-amber-700">{u.electricUsage} kWh</td>
                        <td className="px-5 py-4 font-mono text-slate-600">{u.prevWater} → {u.currWater}</td>
                        <td className="px-5 py-4 font-bold text-cyan-700">{u.waterUsage} m³</td>
                        <td className="px-5 py-4 text-slate-600 font-medium">{u.recordedBy}</td>
                        <td className="px-5 py-4 text-slate-500">{u.recordedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MAINTENANCE (BỘ PHẬN KỸ THUẬT) */}
        {isTabAllowed && effectiveTab === 'maintenance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-teal-600" />
                  Quản Lý Sửa Chữa & Sự Cố Kỹ Thuật
                </h2>
                <p className="text-xs text-slate-500">Tiếp nhận yêu cầu từ người thuê, phân công kỹ thuật viên và nghiệm thu chi phí</p>
              </div>

              <button
                onClick={() => setShowReportIssueModal(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-teal-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Gửi yêu cầu sửa chữa mới
              </button>
            </div>

            {/* Filter buttons for Maintenance */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setMaintenanceFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  maintenanceFilter === 'all'
                    ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Tất cả ({maintenance.length})
              </button>
              <button
                onClick={() => setMaintenanceFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  maintenanceFilter === 'pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Cần xử lý ({maintenance.filter(m => m.status !== 'Hoàn thành' && m.status !== 'Hủy').length})
              </button>
              <button
                onClick={() => setMaintenanceFilter('completed')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  maintenanceFilter === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Đã hoàn thành ({maintenance.filter(m => m.status === 'Hoàn thành').length})
              </button>
            </div>

            {/* List of maintenance requests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {maintenance
                .filter(m => {
                  if (maintenanceFilter === 'pending') return m.status !== 'Hoàn thành' && m.status !== 'Hủy';
                  if (maintenanceFilter === 'completed') return m.status === 'Hoàn thành';
                  return true;
                })
                .map(req => (
                <div key={req.requestId} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-indigo-700 font-bold">{req.requestCode}</span>
                        <StatusBadge status={req.priority} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">Phòng {req.roomNumber}: {req.title}</h3>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {req.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>Phân loại: <strong className="text-slate-800">{req.category}</strong></div>
                    <div>Khách báo: <strong className="text-slate-800">{req.tenantName}</strong></div>
                    <div>Kỹ thuật viên: <strong className="text-indigo-700">{req.assignedTechnicianName || 'Chưa phân công'}</strong></div>
                    <div>Thời điểm gửi: <span className="text-slate-600">{req.createdAt}</span></div>
                  </div>

                  {/* If completed, show outcome and cost */}
                  {req.status === 'Hoàn thành' && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                      <p className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Đã nghiệm thu sửa chữa:
                      </p>
                      <p className="text-slate-700 text-[11px]">{req.actionTaken}</p>
                      {req.repairCost !== undefined && (
                        <p className="text-emerald-800 font-bold text-xs pt-1">
                          Chi phí linh kiện: {req.repairCost.toLocaleString()} đ
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    {req.status === 'Hoàn thành' ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold py-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Đã hoàn tất xử lý & nghiệm thu</span>
                        {req.completedAt && (
                          <span className="text-[11px] text-slate-500 font-normal ml-1">({req.completedAt})</span>
                        )}
                      </div>
                    ) : req.status === 'Hủy' ? (
                      <span className="text-xs text-slate-400 py-1 italic">Yêu cầu đã hủy</span>
                    ) : (
                      <div className="ml-auto">
                        <button
                          onClick={() => setSelectedMaintenanceForFix(req)}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition shadow-xs"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          {req.status === 'Chờ tiếp nhận' ? 'Tiếp nhận & Xử lý' : 'Cập nhật tiến độ / Nghiệm thu'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INVOICES & VIETQR (BỘ PHẬN KẾ TOÁN) */}
        {isTabAllowed && effectiveTab === 'invoices' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-emerald-600" />
                  Hóa Đơn Tiền Phòng & Quản Lý Thu Tiền VietQR
                </h2>
                <p className="text-xs text-slate-500">Theo dõi công nợ, xuất mã VietQR động gửi khách và đối soát thanh toán</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                  Tổng phải thu: {(stats?.totalMonthlyRevenue || 0).toLocaleString()} đ
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
                  Còn nợ: {(stats?.totalOutstandingDebt || 0).toLocaleString()} đ
                </span>
              </div>
            </div>

            {/* Payment role explanation notice */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
              <span className="text-base leading-none mt-0.5">💡</span>
              <div>
                <strong className="font-bold">Quy định thanh toán & thu ngân:</strong> Chủ trọ và Kế toán là bên phát hành hóa đơn và quản lý công nợ. <u>Chỉ khách thuê mới thực hiện thanh toán tiền phòng</u> (quét mã VietQR trên app ngân hàng ở Cổng Khách thuê). Kế toán sử dụng nút <strong>&quot;Xem QR gửi khách&quot;</strong> để lấy mã QR gửi cho khách thanh toán hoặc bấm <strong>&quot;Ghi nhận thu tiền mặt&quot;</strong> khi khách nộp tiền mặt.
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Mã Hóa đơn</th>
                      <th className="px-5 py-3.5">Phòng & Khách</th>
                      <th className="px-5 py-3.5">Kỳ thu</th>
                      <th className="px-5 py-3.5">Tiền phòng</th>
                      <th className="px-5 py-3.5">Điện + Nước</th>
                      <th className="px-5 py-3.5">Dịch vụ</th>
                      <th className="px-5 py-3.5 text-emerald-700">Tổng tiền</th>
                      <th className="px-5 py-3.5">Trạng thái</th>
                      <th className="px-5 py-3.5 text-right">Thao tác thu ngân</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map(inv => (
                      <tr key={inv.invoiceId} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4 font-mono font-bold text-indigo-700">{inv.invoiceCode}</td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">Phòng {inv.roomNumber}</p>
                          <p className="text-[11px] text-slate-500">{inv.tenantName}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-medium">T{inv.billingMonth}/{inv.billingYear}</td>
                        <td className="px-5 py-4 font-medium text-slate-800">{inv.rentFee.toLocaleString()} đ</td>
                        <td className="px-5 py-4 text-slate-600 font-mono">
                          {(inv.electricFee + inv.waterFee).toLocaleString()} đ
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-mono">{inv.serviceFee.toLocaleString()} đ</td>
                        <td className="px-5 py-4 font-bold text-emerald-600 text-sm">{inv.totalAmount.toLocaleString()} đ</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedInvoiceForQR(inv)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                              title="Mở mã VietQR để gửi cho khách thuê quét thanh toán"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              Xem QR gửi khách
                            </button>
                            {inv.status !== 'Đã thanh toán' && (
                              <button
                                onClick={() => handleCashPayment(inv)}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 font-medium cursor-pointer transition"
                                title="Ghi nhận khi khách nộp tiền mặt trực tiếp"
                              >
                                Thu tiền mặt
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: HR & STAFF (BỘ PHẬN NHÂN SỰ) */}
        {isTabAllowed && effectiveTab === 'hr' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                  Bộ Phận Nhân Sự: Quản Lý Nhân Viên & Chấm Công
                </h2>
                <p className="text-xs text-slate-500">Danh bạ cán bộ nhân viên, phân công ca trực và ghi nhận giờ vào ca</p>
              </div>

              <button
                onClick={() => setShowAttendanceModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                Điểm danh ca trực hôm nay
              </button>
            </div>

            {/* Staff Directory */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {employees.map(emp => (
                <div key={emp.employeeId} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-purple-700 font-bold">{emp.employeeCode}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{emp.fullName}</h3>
                      <p className="text-xs text-slate-500">{emp.position}</p>
                    </div>
                    <StatusBadge status={emp.status} />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-500">Phòng ban: <strong className="text-indigo-700">{emp.departmentName}</strong></p>
                    <p className="text-slate-500">SĐT: <strong className="text-slate-800">{emp.phone}</strong></p>
                    <p className="text-slate-500">Email: <span className="text-slate-700">{emp.email}</span></p>
                    <p className="text-slate-500">Ngày vào làm: <span className="text-slate-600">{emp.hireDate}</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Attendance Sheet */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Bảng Chấm Công Ca Trực Hôm Nay ({new Date().toLocaleDateString('vi-VN')})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Nhân viên</th>
                      <th className="px-5 py-3.5">Ca làm việc</th>
                      <th className="px-5 py-3.5">Giờ Check-in</th>
                      <th className="px-5 py-3.5">Trạng thái</th>
                      <th className="px-5 py-3.5">Ghi chú phân công</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendance.map(a => (
                      <tr key={a.attendanceId} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4 font-bold text-slate-900">{a.employeeName}</td>
                        <td className="px-5 py-4 text-slate-600">{a.shift}</td>
                        <td className="px-5 py-4 font-mono text-purple-700 font-semibold">{a.checkInTime || '--:--'}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="px-5 py-4 text-slate-500">{a.notes || 'Không có ghi chú'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: TENANT PORTAL (CỔNG KHÁCH THUÊ - CHỈ CƯ DÂN MỚI THANH TOÁN TIỀN PHÒNG) */}
        {isTabAllowed && effectiveTab === 'tenant-portal' && (() => {
          const tenantRoomNo = currentUser.roomNumber || '101';
          const tenantInvoice = invoices.find(i => i.roomNumber === tenantRoomNo) || invoices[0];
          const tenantRoom = rooms.find(r => r.roomNumber === tenantRoomNo);
          const tenantContract = contracts.find(c => c.roomNumber === tenantRoomNo);
          const tenantUtility = utilities.find(u => u.roomNumber === tenantRoomNo);
          const isPaid = tenantInvoice?.status === 'Đã thanh toán';
          const remainingAmount = tenantInvoice ? Math.max(0, tenantInvoice.totalAmount - tenantInvoice.paidAmount) : 0;

          return (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              {/* Greeting Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white shadow-md shadow-indigo-600/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-200">Cổng Thông Tin Dành Riêng Cho Cư Dân</span>
                  <h2 className="text-2xl font-black text-white mt-1">Xin chào, {currentUser.fullName}</h2>
                  <p className="text-xs text-indigo-100 mt-0.5">
                    Căn hộ: <strong className="text-white">Phòng {tenantRoomNo}</strong> • Hợp đồng: <strong className="text-white">{tenantContract?.contractCode || `HD-2024-${tenantRoomNo}`}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setShowReportIssueModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-black/10 transition cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  Báo hỏng đồ đạc / Sự cố
                </button>
              </div>

              {/* Room info & contract summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Tiền thuê phòng:</span>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">
                    {(tenantRoom?.basePrice || tenantInvoice?.rentFee || 5500000).toLocaleString('vi-VN')} đ/tháng
                  </p>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Tiền cọc giữ chỗ: {(tenantContract?.depositAmount || (tenantRoom ? tenantRoom.basePrice * 2 : 11000000)).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Chỉ số điện tháng này:</span>
                  <p className="text-xl font-extrabold text-amber-600 mt-1">
                    {tenantUtility?.electricUsage || 125} kWh
                  </p>
                  <span className="text-[11px] text-slate-500">
                    {tenantUtility ? `Số mới ${tenantUtility.currElectric} - Số cũ ${tenantUtility.prevElectric}` : 'Số mới 1510 - Số cũ 1375'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Chỉ số nước tháng này:</span>
                  <p className="text-xl font-extrabold text-cyan-600 mt-1">
                    {tenantUtility?.waterUsage || 9} m³
                  </p>
                  <span className="text-[11px] text-slate-500">
                    {tenantUtility ? `Số mới ${tenantUtility.currWater} - Số cũ ${tenantUtility.prevWater}` : 'Số mới 61 - Số cũ 52'}
                  </span>
                </div>
              </div>

              {/* Active Invoice for this tenant's room */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Hóa Đơn Tiền Phòng & Dịch Vụ Của Bạn (Kỳ Tháng {tenantInvoice?.billingMonth || '09'}/{tenantInvoice?.billingYear || '2026'})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mã hóa đơn: <span className="font-mono font-semibold text-indigo-700">{tenantInvoice?.invoiceCode || 'HDT-202609-101'}</span> • Hạn nộp: {tenantInvoice?.dueDate || '05 hàng tháng'}
                    </p>
                  </div>
                  {tenantInvoice && <StatusBadge status={tenantInvoice.status} />}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                  <div className="flex justify-between text-slate-600">
                    <span>Tiền thuê phòng:</span>
                    <span className="font-semibold text-slate-900">
                      {(tenantInvoice?.rentFee || 5500000).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tiền điện ({pricing.electricPrice.toLocaleString()} đ/kWh):</span>
                    <span className="font-semibold text-amber-700">
                      {(tenantInvoice?.electricFee || 437500).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tiền nước ({pricing.waterPrice.toLocaleString()} đ/m³):</span>
                    <span className="font-semibold text-cyan-700">
                      {(tenantInvoice?.waterFee || 175000).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Internet & Dịch vụ vệ sinh:</span>
                    <span className="font-semibold text-slate-800">
                      {(tenantInvoice?.serviceFee || 150000).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold">
                    <span className="text-slate-900 font-bold">Tổng số tiền cần thanh toán:</span>
                    <span className="text-emerald-600 text-base font-black">
                      {(tenantInvoice ? tenantInvoice.totalAmount : 6262500).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  {isPaid && (
                    <div className="flex justify-between text-xs text-emerald-700 pt-1 font-semibold">
                      <span>Đã thanh toán:</span>
                      <span>{(tenantInvoice?.paidAmount || tenantInvoice?.totalAmount || 0).toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                </div>

                {/* Tenant Payment Action */}
                {isPaid ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span>Hóa đơn kỳ này đã được thanh toán thành công!</span>
                    </div>
                    <p className="text-xs text-emerald-700">Cảm ơn bạn đã đóng tiền phòng đúng hạn. Mọi thắc mắc xin liên hệ quản lý tòa nhà.</p>
                    <button
                      onClick={() => tenantInvoice && setSelectedInvoiceForQR(tenantInvoice)}
                      className="mt-2 px-4 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition cursor-pointer"
                    >
                      Xem lại biên lai mã VietQR
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <button
                      onClick={() => tenantInvoice && setSelectedInvoiceForQR(tenantInvoice)}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 cursor-pointer transition transform hover:-translate-y-0.5"
                    >
                      <QrCode className="w-5 h-5" />
                      Thanh Toán Tiền Phòng Ngay (Quét Mã VietQR)
                    </button>
                    <p className="text-center text-[11px] text-slate-500">
                      ⚡ Quét mã VietQR chuyển khoản tức thì 24/7 từ bất kỳ App ngân hàng nào (MB, VCB, ACB, Techcombank, BIDV...).
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </main>

      {/* MODALS */}
      {showAddRoomModal && (
        <AddRoomModal
          onClose={() => setShowAddRoomModal(false)}
          onSuccess={fetchData}
        />
      )}

      {showUtilityModal && (
        <RecordUtilityModal
          rooms={rooms}
          pricing={pricing}
          onClose={() => setShowUtilityModal(false)}
          onSuccess={fetchData}
        />
      )}

      {showPricingModal && (
        <PricingSettingsModal
          currentPricing={pricing}
          onClose={() => setShowPricingModal(false)}
          onSuccess={(newPricing) => {
            setPricing(newPricing);
            fetchData();
          }}
        />
      )}

      {showReportIssueModal && (
        <ReportIssueModal
          rooms={rooms}
          onClose={() => setShowReportIssueModal(false)}
          onSuccess={fetchData}
          defaultRoomNumber={currentUser.roomNumber}
          defaultTenantName={currentUser.fullName}
        />
      )}

      {selectedMaintenanceForFix && (
        <FixIssueModal
          request={selectedMaintenanceForFix}
          onClose={() => setSelectedMaintenanceForFix(null)}
          onSuccess={fetchData}
        />
      )}

      {showAttendanceModal && (
        <AttendanceModal
          employees={employees}
          onClose={() => setShowAttendanceModal(false)}
          onSuccess={fetchData}
        />
      )}

      {selectedInvoiceForQR && (
        <VietQRModal
          invoice={selectedInvoiceForQR}
          pricing={pricing}
          userRole={currentUser?.role}
          onClose={() => setSelectedInvoiceForQR(null)}
          onPaymentSuccess={fetchData}
        />
      )}
    </div>
  );
}
