export type UserRole = 'owner' | 'manager' | 'technician' | 'accountant' | 'hr' | 'tenant';

export interface UserAccount {
  userId: number;
  username: string;
  fullName: string;
  role: UserRole;
  department: string;
  avatar: string;
  phone?: string;
  email?: string;
  roomNumber?: string; // Dành cho khách thuê
  tenantId?: number;
}

export interface RoleInfo {
  key: UserRole;
  name: string;
  department: string;
  description: string;
  avatar: string;
  defaultTab: string;
  allowedTabs: string[];
}

export interface Room {
  roomId: number;
  buildingId: number;
  buildingName?: string;
  roomNumber: string;
  floor: number;
  roomType: string;
  areaSqM: number;
  basePrice: number;
  status: 'Trống' | 'Đang thuê' | 'Đang sửa chữa';
  amenities: string;
  tenantName?: string;
  tenantPhone?: string;
  contractCode?: string;
}

export interface Tenant {
  tenantId: number;
  fullName: string;
  idCard: string;
  phone: string;
  email: string;
  permanentAddress: string;
  emergencyContact: string;
  vehiclePlate: string;
  roomNumber?: string;
  createdAt: string;
}

export interface Contract {
  contractId: number;
  contractCode: string;
  roomId: number;
  roomNumber?: string;
  tenantId: number;
  tenantName?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  paymentCycleMonths: number;
  status: 'Còn hiệu lực' | 'Sắp hết hạn' | 'Đã thanh lý';
  notes?: string;
}

export interface UtilityReading {
  readingId: number;
  roomId: number;
  roomNumber?: string;
  readingMonth: number;
  readingYear: number;
  prevElectric: number;
  currElectric: number;
  electricUsage: number;
  prevWater: number;
  currWater: number;
  waterUsage: number;
  recordedBy: string;
  recordedDate: string;
}

export interface Invoice {
  invoiceId: number;
  invoiceCode: string;
  roomId: number;
  roomNumber?: string;
  tenantId: number;
  tenantName?: string;
  tenantPhone?: string;
  billingMonth: number;
  billingYear: number;
  rentFee: number;
  electricFee: number;
  waterFee: number;
  serviceFee: number;
  otherFee: number;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Chưa thanh toán' | 'Đã thanh toán' | 'Quá hạn' | 'Thanh toán một phần';
  createdAt: string;
}

export interface Payment {
  paymentId: number;
  paymentCode: string;
  invoiceId: number;
  invoiceCode?: string;
  amount: number;
  paymentMethod: 'Tiền mặt' | 'Chuyển khoản VietQR';
  transactionRef?: string;
  paymentDate: string;
  notes?: string;
}

export interface Employee {
  employeeId: number;
  employeeCode: string;
  fullName: string;
  departmentId: number;
  departmentName: string;
  position: string;
  phone: string;
  email: string;
  idCard: string;
  hireDate: string;
  status: 'Đang làm việc' | 'Nghỉ phép' | 'Đã nghỉ việc';
}

export interface AttendanceRecord {
  attendanceId: number;
  employeeId: number;
  employeeName?: string;
  workDate: string;
  shift: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'Đúng giờ' | 'Đi trễ' | 'Nghỉ có phép' | 'Nghỉ không phép';
  notes?: string;
}

export interface MaintenanceRequest {
  requestId: number;
  requestCode: string;
  roomId: number;
  roomNumber?: string;
  tenantId: number;
  tenantName?: string;
  category: 'Điện' | 'Nước' | 'Điều hòa' | 'Thiết bị gia dụng' | 'Khác';
  title: string;
  description: string;
  priority: 'Khẩn cấp' | 'Cao' | 'Bình thường' | 'Thấp';
  status: 'Chờ tiếp nhận' | 'Đã phân công' | 'Đang xử lý' | 'Hoàn thành' | 'Hủy';
  assignedTechnicianId?: number;
  assignedTechnicianName?: string;
  assignedAt?: string;
  completedAt?: string;
  createdAt: string;
  repairCost?: number;
  materialsUsed?: string;
  actionTaken?: string;
}

export interface SystemPricing {
  electricPrice: number;
  waterPrice: number;
  internetFee: number;
  cleaningFee: number;
  bankCode: string;
  bankName: string;
  accountNo: string;
  accountName: string;
}

export interface SystemStats {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  totalMonthlyRevenue: number;
  totalCollected: number;
  totalOutstandingDebt: number;
  pendingMaintenanceRequests: number;
  totalEmployees: number;
}
