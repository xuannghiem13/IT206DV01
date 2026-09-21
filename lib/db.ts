import { 
  Room, Tenant, Contract, UtilityReading, Invoice, Employee, 
  AttendanceRecord, MaintenanceRequest, SystemStats, SystemPricing 
} from './types';
import { 
  INITIAL_ROOMS, INITIAL_TENANTS, INITIAL_CONTRACTS, 
  INITIAL_UTILITIES, INITIAL_INVOICES, INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE, INITIAL_MAINTENANCE 
} from './seedData';

// In-Memory store as cache/fallback
let roomsStore: Room[] = [...INITIAL_ROOMS];
let tenantsStore: Tenant[] = [...INITIAL_TENANTS];
let contractsStore: Contract[] = [...INITIAL_CONTRACTS];
let utilitiesStore: UtilityReading[] = [...INITIAL_UTILITIES];
let invoicesStore: Invoice[] = [...INITIAL_INVOICES];
let employeesStore: Employee[] = [...INITIAL_EMPLOYEES];
let attendanceStore: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
let maintenanceStore: MaintenanceRequest[] = [...INITIAL_MAINTENANCE];

// System Pricing configuration
let pricingStore: SystemPricing = {
  electricPrice: 3500,
  waterPrice: 25000,
  internetFee: 100000,
  cleaningFee: 50000,
  bankCode: 'MB',
  bankName: 'MBBank (Ngân hàng Quân Đội)',
  accountNo: '0909123456',
  accountName: 'CHU TRO CAN HO DICH VU'
};

export async function getPricing(): Promise<SystemPricing> {
  return pricingStore;
}

export async function updatePricing(updates: Partial<SystemPricing>): Promise<SystemPricing> {
  pricingStore = {
    ...pricingStore,
    ...updates
  };
  return pricingStore;
}

export async function getRooms(): Promise<Room[]> {
  return roomsStore;
}

export async function addRoom(room: Omit<Room, 'roomId'>): Promise<Room> {
  const newRoom: Room = {
    ...room,
    roomId: roomsStore.length ? Math.max(...roomsStore.map(r => r.roomId)) + 1 : 1
  };
  roomsStore.push(newRoom);
  return newRoom;
}

export async function updateRoomStatus(roomId: number, status: Room['status']): Promise<Room | null> {
  const room = roomsStore.find(r => r.roomId === roomId);
  if (room) {
    room.status = status;
    return room;
  }
  return null;
}

export async function getTenants(): Promise<Tenant[]> {
  return tenantsStore;
}

export async function addTenant(tenant: Omit<Tenant, 'tenantId' | 'createdAt'>): Promise<Tenant> {
  const newTenant: Tenant = {
    ...tenant,
    tenantId: tenantsStore.length ? Math.max(...tenantsStore.map(t => t.tenantId)) + 1 : 1,
    createdAt: new Date().toISOString().split('T')[0]
  };
  tenantsStore.push(newTenant);
  return newTenant;
}

export async function getContracts(): Promise<Contract[]> {
  return contractsStore;
}

export async function addContract(contract: Omit<Contract, 'contractId'>): Promise<Contract> {
  const newContract: Contract = {
    ...contract,
    contractId: contractsStore.length ? Math.max(...contractsStore.map(c => c.contractId)) + 1 : 1
  };
  contractsStore.push(newContract);
  
  // Cập nhật trạng thái phòng thành Đang thuê
  const room = roomsStore.find(r => r.roomId === contract.roomId);
  if (room) {
    room.status = 'Đang thuê';
    room.tenantName = contract.tenantName;
    room.contractCode = contract.contractCode;
  }

  return newContract;
}

export async function getUtilityReadings(): Promise<UtilityReading[]> {
  return utilitiesStore;
}

export async function addUtilityReading(reading: Omit<UtilityReading, 'readingId' | 'recordedDate' | 'electricUsage' | 'waterUsage'>): Promise<UtilityReading> {
  const electricUsage = Math.max(0, reading.currElectric - reading.prevElectric);
  const waterUsage = Math.max(0, reading.currWater - reading.prevWater);
  
  const newReading: UtilityReading = {
    ...reading,
    readingId: utilitiesStore.length ? Math.max(...utilitiesStore.map(u => u.readingId)) + 1 : 1,
    electricUsage,
    waterUsage,
    recordedDate: new Date().toISOString().split('T')[0]
  };
  utilitiesStore.push(newReading);

  // Tự động lập hóa đơn nháp tương ứng
  const room = roomsStore.find(r => r.roomId === reading.roomId);
  const contract = contractsStore.find(c => c.roomId === reading.roomId && c.status === 'Còn hiệu lực');
  
  if (room && contract) {
    const rentFee = contract.monthlyRent || room.basePrice;
    const electricFee = electricUsage * pricingStore.electricPrice;
    const waterFee = waterUsage * pricingStore.waterPrice;
    const serviceFee = pricingStore.internetFee + pricingStore.cleaningFee;
    const totalAmount = rentFee + electricFee + waterFee + serviceFee;

    const newInvoice: Invoice = {
      invoiceId: invoicesStore.length ? Math.max(...invoicesStore.map(i => i.invoiceId)) + 1 : 1,
      invoiceCode: `HDT-${reading.readingYear}${String(reading.readingMonth).padStart(2, '0')}-${room.roomNumber}`,
      roomId: room.roomId,
      roomNumber: room.roomNumber,
      tenantId: contract.tenantId,
      tenantName: contract.tenantName,
      billingMonth: reading.readingMonth,
      billingYear: reading.readingYear,
      rentFee,
      electricFee,
      waterFee,
      serviceFee,
      otherFee: 0,
      totalAmount,
      paidAmount: 0,
      dueDate: `${reading.readingYear}-${String(reading.readingMonth).padStart(2, '0')}-25`,
      status: 'Chưa thanh toán',
      createdAt: new Date().toISOString().split('T')[0]
    };
    invoicesStore.unshift(newInvoice);
  }

  return newReading;
}

export async function getInvoices(): Promise<Invoice[]> {
  return invoicesStore;
}

export async function payInvoice(invoiceId: number, amount: number, paymentMethod: 'Tiền mặt' | 'Chuyển khoản VietQR'): Promise<Invoice | null> {
  const invoice = invoicesStore.find(i => i.invoiceId === invoiceId);
  if (!invoice) return null;

  invoice.paidAmount += amount;
  if (invoice.paidAmount >= invoice.totalAmount) {
    invoice.status = 'Đã thanh toán';
  } else if (invoice.paidAmount > 0) {
    invoice.status = 'Thanh toán một phần';
  }
  return invoice;
}

export async function getEmployees(): Promise<Employee[]> {
  return employeesStore;
}

export async function addEmployee(employee: Omit<Employee, 'employeeId'>): Promise<Employee> {
  const newEmp: Employee = {
    ...employee,
    employeeId: employeesStore.length ? Math.max(...employeesStore.map(e => e.employeeId)) + 1 : 1
  };
  employeesStore.push(newEmp);
  return newEmp;
}

export async function getAttendance(): Promise<AttendanceRecord[]> {
  return attendanceStore;
}

export async function checkInEmployee(employeeId: number, shift: string, notes?: string): Promise<AttendanceRecord> {
  const emp = employeesStore.find(e => e.employeeId === employeeId);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const dateStr = now.toISOString().split('T')[0];

  const newRecord: AttendanceRecord = {
    attendanceId: attendanceStore.length ? Math.max(...attendanceStore.map(a => a.attendanceId)) + 1 : 1,
    employeeId,
    employeeName: emp?.fullName || 'Nhân viên',
    workDate: dateStr,
    shift,
    checkInTime: timeStr,
    status: 'Đúng giờ',
    notes
  };
  attendanceStore.unshift(newRecord);
  return newRecord;
}

export async function getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
  return maintenanceStore;
}

export async function addMaintenanceRequest(req: Omit<MaintenanceRequest, 'requestId' | 'requestCode' | 'createdAt'>): Promise<MaintenanceRequest> {
  const newId = maintenanceStore.length ? Math.max(...maintenanceStore.map(m => m.requestId)) + 1 : 1;
  const newReq: MaintenanceRequest = {
    ...req,
    requestId: newId,
    requestCode: `YC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(newId).padStart(3, '0')}`,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  maintenanceStore.unshift(newReq);
  return newReq;
}

export async function updateMaintenanceStatus(
  requestId: number, 
  status: MaintenanceRequest['status'],
  data?: {
    assignedTechnicianId?: number;
    assignedTechnicianName?: string;
    repairCost?: number;
    materialsUsed?: string;
    actionTaken?: string;
  }
): Promise<MaintenanceRequest | null> {
  const req = maintenanceStore.find(m => m.requestId === requestId);
  if (!req) return null;

  req.status = status;
  if (data?.assignedTechnicianId) {
    req.assignedTechnicianId = data.assignedTechnicianId;
    req.assignedTechnicianName = data.assignedTechnicianName;
    req.assignedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
  }
  if (data?.repairCost !== undefined) req.repairCost = data.repairCost;
  if (data?.materialsUsed) req.materialsUsed = data.materialsUsed;
  if (data?.actionTaken) req.actionTaken = data.actionTaken;
  if (status === 'Hoàn thành') {
    req.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
  }
  return req;
}

export async function getSystemStats(): Promise<SystemStats> {
  const totalRooms = roomsStore.length;
  const occupiedRooms = roomsStore.filter(r => r.status === 'Đang thuê').length;
  const vacantRooms = roomsStore.filter(r => r.status === 'Trống').length;
  const maintenanceRooms = roomsStore.filter(r => r.status === 'Đang sửa chữa').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const totalMonthlyRevenue = invoicesStore.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCollected = invoicesStore.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalOutstandingDebt = invoicesStore.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);
  const pendingMaintenanceRequests = maintenanceStore.filter(m => m.status !== 'Hoàn thành' && m.status !== 'Hủy').length;
  const totalEmployees = employeesStore.length;

  return {
    totalRooms,
    occupiedRooms,
    vacantRooms,
    maintenanceRooms,
    occupancyRate,
    totalMonthlyRevenue,
    totalCollected,
    totalOutstandingDebt,
    pendingMaintenanceRequests,
    totalEmployees
  };
}
