import { Room, Tenant, Contract, UtilityReading, Invoice, Employee, AttendanceRecord, MaintenanceRequest, RoleInfo, UserAccount } from './types';

export const ROLES: RoleInfo[] = [
  {
    key: 'owner',
    name: 'Chủ trọ',
    department: 'Ban Quản trị',
    description: 'Quản trị tổng quan, thiết lập giá, phân quyền và xem toàn bộ báo cáo doanh thu tài chính.',
    avatar: '👑',
    defaultTab: 'dashboard',
    allowedTabs: ['dashboard', 'rooms', 'utilities', 'maintenance', 'invoices', 'hr', 'tenant-portal']
  },
  {
    key: 'manager',
    name: 'Bộ phận Quản lý',
    department: 'Vận hành căn hộ',
    description: 'Quản lý phòng, người thuê, hợp đồng, bàn giao, chốt số điện nước và điều phối kỹ thuật.',
    avatar: '🏢',
    defaultTab: 'rooms',
    allowedTabs: ['rooms', 'utilities', 'maintenance']
  },
  {
    key: 'technician',
    name: 'Bộ phận Kỹ thuật',
    department: 'Bảo trì & Sự cố',
    description: 'Tiếp nhận công việc sửa chữa, cập nhật tiến độ, nghiệm thu kết quả và chi phí linh kiện.',
    avatar: '🔧',
    defaultTab: 'maintenance',
    allowedTabs: ['maintenance']
  },
  {
    key: 'accountant',
    name: 'Bộ phận Kế toán',
    department: 'Tài chính - Kế toán',
    description: 'Lập hóa đơn hàng tháng, theo dõi thanh toán VietQR, quản lý công nợ và chỉ số dịch vụ.',
    avatar: '📊',
    defaultTab: 'invoices',
    allowedTabs: ['invoices', 'utilities']
  },
  {
    key: 'hr',
    name: 'Bộ phận Nhân sự',
    department: 'Hành chính - Nhân sự',
    description: 'Quản lý hồ sơ nhân viên, chức vụ, phân công ca trực và theo dõi chấm công.',
    avatar: '👥',
    defaultTab: 'hr',
    allowedTabs: ['hr']
  },
  {
    key: 'tenant',
    name: 'Khách thuê căn hộ',
    department: 'Cư dân',
    description: 'Tra cứu phòng của mình, hợp đồng, chỉ số điện nước, quét mã VietQR và gửi yêu cầu sửa chữa.',
    avatar: '🏠',
    defaultTab: 'tenant-portal',
    allowedTabs: ['tenant-portal']
  }
];

export interface PredefinedAccount extends UserAccount {
  password: string; // Mật khẩu mặc định demo: 123456
}

export const SAMPLE_ACCOUNTS: PredefinedAccount[] = [
  {
    userId: 1,
    username: 'chutro',
    password: '123',
    fullName: 'Nguyễn Văn Hùng (Chủ trọ)',
    role: 'owner',
    department: 'Ban Quản trị',
    avatar: '👑',
    email: 'chutro@sunrise.vn',
    phone: '0909123456'
  },
  {
    userId: 2,
    username: 'quanly',
    password: '123',
    fullName: 'Trần Văn Hoàng (Quản lý)',
    role: 'manager',
    department: 'Bộ phận Quản lý',
    avatar: '🏢',
    email: 'hoang.tran@sunrise.vn',
    phone: '0912345678'
  },
  {
    userId: 3,
    username: 'kythuat',
    password: '123',
    fullName: 'Nguyễn Tuấn Kiệt (Kỹ thuật)',
    role: 'technician',
    department: 'Bộ phận Kỹ thuật',
    avatar: '🔧',
    email: 'kiet.nguyen@sunrise.vn',
    phone: '0933221100'
  },
  {
    userId: 4,
    username: 'ketoan',
    password: '123',
    fullName: 'Đặng Thanh Mai (Kế toán)',
    role: 'accountant',
    department: 'Bộ phận Kế toán',
    avatar: '📊',
    email: 'mai.dang@sunrise.vn',
    phone: '0977889900'
  },
  {
    userId: 5,
    username: 'nhansu',
    password: '123',
    fullName: 'Phạm Thu Hương (Nhân sự)',
    role: 'hr',
    department: 'Bộ phận Nhân sự',
    avatar: '👥',
    email: 'huong.pham@sunrise.vn',
    phone: '0988112233'
  },
  {
    userId: 6,
    username: 'khachthue',
    password: '123',
    fullName: 'Nguyễn Hoàng Anh (Cư dân)',
    role: 'tenant',
    department: 'Khách thuê P.101',
    avatar: '🏠',
    email: 'hoanganh.tech@gmail.com',
    phone: '0908123456',
    roomNumber: '101',
    tenantId: 1
  },
  {
    userId: 7,
    username: 'khach201',
    password: '123',
    fullName: 'Lê Thị Phương Thảo (Cư dân)',
    role: 'tenant',
    department: 'Khách thuê P.201',
    avatar: '🏠',
    email: 'thao.le@gmail.com',
    phone: '0918765432',
    roomNumber: '201',
    tenantId: 2
  },
  {
    userId: 8,
    username: 'khach203',
    password: '123',
    fullName: 'Vũ Đình Khang (Cư dân)',
    role: 'tenant',
    department: 'Khách thuê P.203',
    avatar: '🏠',
    email: 'khang.vu@gmail.com',
    phone: '0938555666',
    roomNumber: '203',
    tenantId: 3
  },
  {
    userId: 9,
    username: 'khach301',
    password: '123',
    fullName: 'Đỗ Bảo Châu (Cư dân)',
    role: 'tenant',
    department: 'Khách thuê P.301',
    avatar: '🏠',
    email: 'chbaud@gmail.com',
    phone: '0903444555',
    roomNumber: '301',
    tenantId: 4
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    roomId: 1,
    buildingId: 1,
    buildingName: 'Sunrise Building (Q1)',
    roomNumber: '101',
    floor: 1,
    roomType: 'Studio',
    areaSqM: 28.0,
    basePrice: 5500000,
    status: 'Đang thuê',
    amenities: 'Điều hòa Inverter, Tủ lạnh 180L, Giường nệm, Tủ quần áo, Bếp điện từ, Nóng lạnh',
    tenantName: 'Nguyễn Hoàng Anh',
    tenantPhone: '0908123456',
    contractCode: 'HD-2024-101'
  },
  {
    roomId: 2,
    buildingId: 1,
    buildingName: 'Sunrise Building (Q1)',
    roomNumber: '102',
    floor: 1,
    roomType: 'Studio',
    areaSqM: 30.0,
    basePrice: 5800000,
    status: 'Trống',
    amenities: 'Điều hòa Inverter, Tủ lạnh, Tủ bếp gỗ sồi, Ban công thoáng mát, Bàn làm việc'
  },
  {
    roomId: 3,
    buildingId: 1,
    buildingName: 'Sunrise Building (Q1)',
    roomNumber: '103',
    floor: 1,
    roomType: '1 Phòng ngủ',
    areaSqM: 35.0,
    basePrice: 6500000,
    status: 'Đang sửa chữa',
    amenities: 'Điều hòa 2 chiều, Tủ lạnh, Máy giặt riêng, Sofa phòng khách, Tủ âm tường'
  },
  {
    roomId: 4,
    buildingId: 1,
    buildingName: 'Sunrise Building (Q1)',
    roomNumber: '201',
    floor: 2,
    roomType: '1 Phòng ngủ',
    areaSqM: 35.0,
    basePrice: 6700000,
    status: 'Đang thuê',
    amenities: 'Nội thất cao cấp, Máy giặt sấy, Tủ bếp hiện đại, Giường King size, Tivi 50 inch',
    tenantName: 'Lê Thị Phương Thảo',
    tenantPhone: '0918765432',
    contractCode: 'HD-2024-201'
  },
  {
    roomId: 5,
    buildingId: 1,
    buildingName: 'Sunrise Building (Q1)',
    roomNumber: '202',
    floor: 2,
    roomType: 'Studio',
    areaSqM: 28.0,
    basePrice: 5600000,
    status: 'Trống',
    amenities: 'Điều hòa, Nóng lạnh, Tủ lạnh, Giường đôi, Bàn trang điểm'
  },
  {
    roomId: 6,
    buildingId: 1,
    buildingName: 'Sunrise Building (Q1)',
    roomNumber: '203',
    floor: 2,
    roomType: 'Duplex gác lửng',
    areaSqM: 40.0,
    basePrice: 7500000,
    status: 'Đang thuê',
    amenities: 'Gác lửng kính cường lực, Máy giặt riêng, Tủ lạnh 2 cửa, Bàn làm việc công thái học',
    tenantName: 'Vũ Đình Khang',
    tenantPhone: '0938555666',
    contractCode: 'HD-2024-203'
  },
  {
    roomId: 7,
    buildingId: 1,
    buildingName: 'Sunrise Building (Q1)',
    roomNumber: '301',
    floor: 3,
    roomType: '2 Phòng ngủ',
    areaSqM: 55.0,
    basePrice: 9500000,
    status: 'Đang thuê',
    amenities: '2 phòng ngủ tách biệt, Ban công view Landmark 81, Máy giặt, Bếp điện đôi, Sofa',
    tenantName: 'Đỗ Bảo Châu',
    tenantPhone: '0987333222',
    contractCode: 'HD-2024-301'
  },
  {
    roomId: 8,
    buildingId: 1,
    buildingName: 'Sunrise Building (Q1)',
    roomNumber: '302',
    floor: 3,
    roomType: 'Studio',
    areaSqM: 28.0,
    basePrice: 5500000,
    status: 'Trống',
    amenities: 'Trang bị cơ bản: Điều hòa, Máy nước nóng, Giường nệm, Tủ quần áo'
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    tenantId: 1,
    fullName: 'Nguyễn Hoàng Anh',
    idCard: '079195000001',
    phone: '0908123456',
    email: 'hoanganh.tech@gmail.com',
    permanentAddress: 'Hải Châu, Đà Nẵng',
    emergencyContact: 'Mẹ: Bà Lan (0903111222)',
    vehiclePlate: '43D1-678.99',
    roomNumber: '101',
    createdAt: '2024-01-01'
  },
  {
    tenantId: 2,
    fullName: 'Lê Thị Phương Thảo',
    idCard: '079195000002',
    phone: '0918765432',
    email: 'thaole.design@gmail.com',
    permanentAddress: 'Quy Nhơn, Bình Định',
    emergencyContact: 'Bố: Ông Lê Dũng (0913444555)',
    vehiclePlate: '77B2-123.45',
    roomNumber: '201',
    createdAt: '2024-02-15'
  },
  {
    tenantId: 3,
    fullName: 'Vũ Đình Khang',
    idCard: '079195000003',
    phone: '0938555666',
    email: 'khang.vu@startup.co',
    permanentAddress: 'Ninh Kiều, Cần Thơ',
    emergencyContact: 'Vợ: Minh Hằng (0938777888)',
    vehiclePlate: '65A-987.65',
    roomNumber: '203',
    createdAt: '2023-11-01'
  },
  {
    tenantId: 4,
    fullName: 'Đỗ Bảo Châu',
    idCard: '079195000004',
    phone: '0987333222',
    email: 'chando@gmail.com',
    permanentAddress: 'Nha Trang, Khánh Hòa',
    emergencyContact: 'Chị: Đỗ Ngọc Anh (0987111333)',
    vehiclePlate: '79N1-555.22',
    roomNumber: '301',
    createdAt: '2024-03-01'
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    contractId: 1,
    contractCode: 'HD-2024-101',
    roomId: 1,
    roomNumber: '101',
    tenantId: 1,
    tenantName: 'Nguyễn Hoàng Anh',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    monthlyRent: 5500000,
    depositAmount: 11000000,
    paymentCycleMonths: 1,
    status: 'Còn hiệu lực',
    notes: 'Hợp đồng 12 tháng, cọc 2 tháng'
  },
  {
    contractId: 2,
    contractCode: 'HD-2024-201',
    roomId: 4,
    roomNumber: '201',
    tenantId: 2,
    tenantName: 'Lê Thị Phương Thảo',
    startDate: '2024-02-15',
    endDate: '2025-02-15',
    monthlyRent: 6700000,
    depositAmount: 13400000,
    paymentCycleMonths: 1,
    status: 'Còn hiệu lực',
    notes: 'Khách ở 1 người, cam kết giữ gìn nội thất'
  },
  {
    contractId: 3,
    contractCode: 'HD-2024-203',
    roomId: 6,
    roomNumber: '203',
    tenantId: 3,
    tenantName: 'Vũ Đình Khang',
    startDate: '2023-11-01',
    endDate: '2024-11-01',
    monthlyRent: 7500000,
    depositAmount: 15000000,
    paymentCycleMonths: 1,
    status: 'Sắp hết hạn',
    notes: 'Khách đang cân nhắc gia hạn thêm 1 năm'
  },
  {
    contractId: 4,
    contractCode: 'HD-2024-301',
    roomId: 7,
    roomNumber: '301',
    tenantId: 4,
    tenantName: 'Đỗ Bảo Châu',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    monthlyRent: 9500000,
    depositAmount: 19000000,
    paymentCycleMonths: 1,
    status: 'Còn hiệu lực',
    notes: 'Căn hộ 2 phòng ngủ gia đình nhỏ'
  }
];

export const INITIAL_UTILITIES: UtilityReading[] = [
  {
    readingId: 1,
    roomId: 1,
    roomNumber: '101',
    readingMonth: 9,
    readingYear: 2026,
    prevElectric: 1250,
    currElectric: 1375,
    electricUsage: 125,
    prevWater: 45,
    currWater: 52,
    waterUsage: 7,
    recordedBy: 'Trần Văn Hoàng',
    recordedDate: '2026-09-01'
  },
  {
    readingId: 2,
    roomId: 4,
    roomNumber: '201',
    readingMonth: 9,
    readingYear: 2026,
    prevElectric: 2100,
    currElectric: 2240,
    electricUsage: 140,
    prevWater: 80,
    currWater: 89,
    waterUsage: 9,
    recordedBy: 'Trần Văn Hoàng',
    recordedDate: '2026-09-01'
  },
  {
    readingId: 3,
    roomId: 6,
    roomNumber: '203',
    readingMonth: 9,
    readingYear: 2026,
    prevElectric: 3050,
    currElectric: 3210,
    electricUsage: 160,
    prevWater: 110,
    currWater: 122,
    waterUsage: 12,
    recordedBy: 'Trần Văn Hoàng',
    recordedDate: '2026-09-01'
  },
  {
    readingId: 4,
    roomId: 7,
    roomNumber: '301',
    readingMonth: 9,
    readingYear: 2026,
    prevElectric: 4200,
    currElectric: 4420,
    electricUsage: 220,
    prevWater: 160,
    currWater: 178,
    waterUsage: 18,
    recordedBy: 'Trần Văn Hoàng',
    recordedDate: '2026-09-01'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    invoiceId: 1,
    invoiceCode: 'HDT-202609-101',
    roomId: 1,
    roomNumber: '101',
    tenantId: 1,
    tenantName: 'Nguyễn Hoàng Anh',
    tenantPhone: '0908123456',
    billingMonth: 9,
    billingYear: 2026,
    rentFee: 5500000,
    electricFee: 437500,  // 125 * 3500
    waterFee: 175000,     // 7 * 25000
    serviceFee: 150000,   // wifi 100k + vệ sinh 50k
    otherFee: 0,
    totalAmount: 6262500,
    paidAmount: 6262500,
    dueDate: '2026-09-05',
    status: 'Đã thanh toán',
    createdAt: '2026-09-01'
  },
  {
    invoiceId: 2,
    invoiceCode: 'HDT-202609-201',
    roomId: 4,
    roomNumber: '201',
    tenantId: 2,
    tenantName: 'Lê Thị Phương Thảo',
    tenantPhone: '0918765432',
    billingMonth: 9,
    billingYear: 2026,
    rentFee: 6700000,
    electricFee: 490000,  // 140 * 3500
    waterFee: 225000,     // 9 * 25000
    serviceFee: 150000,
    otherFee: 0,
    totalAmount: 7565000,
    paidAmount: 0,
    dueDate: '2026-09-25',
    status: 'Chưa thanh toán',
    createdAt: '2026-09-01'
  },
  {
    invoiceId: 3,
    invoiceCode: 'HDT-202609-203',
    roomId: 6,
    roomNumber: '203',
    tenantId: 3,
    tenantName: 'Vũ Đình Khang',
    tenantPhone: '0938555666',
    billingMonth: 9,
    billingYear: 2026,
    rentFee: 7500000,
    electricFee: 560000,  // 160 * 3500
    waterFee: 300000,     // 12 * 25000
    serviceFee: 150000,
    otherFee: 0,
    totalAmount: 8510000,
    paidAmount: 0,
    dueDate: '2026-09-20',
    status: 'Quá hạn',
    createdAt: '2026-09-01'
  },
  {
    invoiceId: 4,
    invoiceCode: 'HDT-202609-301',
    roomId: 7,
    roomNumber: '301',
    tenantId: 4,
    tenantName: 'Đỗ Bảo Châu',
    tenantPhone: '0987333222',
    billingMonth: 9,
    billingYear: 2026,
    rentFee: 9500000,
    electricFee: 770000,  // 220 * 3500
    waterFee: 450000,     // 18 * 25000
    serviceFee: 150000,
    otherFee: 0,
    totalAmount: 10870000,
    paidAmount: 5000000,
    dueDate: '2026-09-28',
    status: 'Thanh toán một phần',
    createdAt: '2026-09-01'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    employeeId: 1,
    employeeCode: 'NV-QL01',
    fullName: 'Trần Văn Hoàng',
    departmentId: 2,
    departmentName: 'Bộ phận Quản lý',
    position: 'Quản lý căn hộ',
    phone: '0912345678',
    email: 'hoang.tran@sunrise.vn',
    idCard: '079090001111',
    hireDate: '2023-01-15',
    status: 'Đang làm việc'
  },
  {
    employeeId: 2,
    employeeCode: 'NV-KT01',
    fullName: 'Nguyễn Tuấn Kiệt',
    departmentId: 3,
    departmentName: 'Bộ phận Kỹ thuật',
    position: 'Kỹ thuật viên trưởng',
    phone: '0933221100',
    email: 'kiet.nguyen@sunrise.vn',
    idCard: '079090002222',
    hireDate: '2023-03-01',
    status: 'Đang làm việc'
  },
  {
    employeeId: 3,
    employeeCode: 'NV-KT02',
    fullName: 'Lê Minh Quân',
    departmentId: 3,
    departmentName: 'Bộ phận Kỹ thuật',
    position: 'Kỹ thuật viên điện nước',
    phone: '0944556677',
    email: 'quan.le@sunrise.vn',
    idCard: '079090003333',
    hireDate: '2023-08-10',
    status: 'Đang làm việc'
  },
  {
    employeeId: 4,
    employeeCode: 'NV-KT03',
    fullName: 'Đặng Thanh Mai',
    departmentId: 4,
    departmentName: 'Bộ phận Kế toán',
    position: 'Kế toán tổng hợp',
    phone: '0977889900',
    email: 'mai.dang@sunrise.vn',
    idCard: '079090004444',
    hireDate: '2023-02-20',
    status: 'Đang làm việc'
  },
  {
    employeeId: 5,
    employeeCode: 'NV-NS01',
    fullName: 'Phạm Thu Hương',
    departmentId: 5,
    departmentName: 'Bộ phận Nhân sự',
    position: 'Chuyên viên Nhân sự',
    phone: '0988112233',
    email: 'huong.pham@sunrise.vn',
    idCard: '079090005555',
    hireDate: '2023-05-05',
    status: 'Đang làm việc'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    attendanceId: 1,
    employeeId: 1,
    employeeName: 'Trần Văn Hoàng',
    workDate: '2026-09-21',
    shift: 'Ca sáng (8h-17h)',
    checkInTime: '07:55',
    status: 'Đúng giờ',
    notes: 'Trực bàn giao phòng 101'
  },
  {
    attendanceId: 2,
    employeeId: 2,
    employeeName: 'Nguyễn Tuấn Kiệt',
    workDate: '2026-09-21',
    shift: 'Ca sáng (8h-17h)',
    checkInTime: '08:05',
    status: 'Đúng giờ',
    notes: 'Xử lý bảo trì máy lạnh 103'
  },
  {
    attendanceId: 3,
    employeeId: 3,
    employeeName: 'Lê Minh Quân',
    workDate: '2026-09-21',
    shift: 'Ca chiều (13h-21h)',
    status: 'Đúng giờ',
    notes: 'Ca trực tối kỹ thuật'
  },
  {
    attendanceId: 4,
    employeeId: 4,
    employeeName: 'Đặng Thanh Mai',
    workDate: '2026-09-21',
    shift: 'Ca sáng (8h-17h)',
    checkInTime: '07:50',
    status: 'Đúng giờ',
    notes: 'Lập bảng kê hóa đơn tháng'
  },
  {
    attendanceId: 5,
    employeeId: 5,
    employeeName: 'Phạm Thu Hương',
    workDate: '2026-09-21',
    shift: 'Ca sáng (8h-17h)',
    checkInTime: '08:00',
    status: 'Đúng giờ',
    notes: 'Tổng hợp chấm công tuần'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRequest[] = [
  {
    requestId: 1,
    requestCode: 'YC-202609-001',
    roomId: 1,
    roomNumber: '101',
    tenantId: 1,
    tenantName: 'Nguyễn Hoàng Anh',
    category: 'Điều hòa',
    title: 'Máy lạnh phòng 101 chảy nước ngưng',
    description: 'Dàn lạnh trong phòng ngủ bị chảy nước xuống bàn làm việc từ tối qua',
    priority: 'Cao',
    status: 'Hoàn thành',
    assignedTechnicianId: 2,
    assignedTechnicianName: 'Nguyễn Tuấn Kiệt',
    assignedAt: '2026-09-18 09:00',
    completedAt: '2026-09-18 11:30',
    createdAt: '2026-09-18 08:15',
    repairCost: 150000,
    materialsUsed: 'Ống thoát nước mềm 2m, băng keo bạc cách nhiệt',
    actionTaken: 'Thông tắc ống thoát nước ngưng điều hòa, xịt rửa tấm lọc bụi và bổ sung gas'
  },
  {
    requestId: 2,
    requestCode: 'YC-202609-002',
    roomId: 4,
    roomNumber: '201',
    tenantId: 2,
    tenantName: 'Lê Thị Phương Thảo',
    category: 'Nước',
    title: 'Vòi sen nhà tắm bị rò rỉ nước',
    description: 'Khóa van rồi nhưng vẫn bị rỉ nước liên tục gây lãng phí và ẩm ướt sàn',
    priority: 'Bình thường',
    status: 'Đang xử lý',
    assignedTechnicianId: 3,
    assignedTechnicianName: 'Lê Minh Quân',
    assignedAt: '2026-09-20 14:00',
    createdAt: '2026-09-20 10:20'
  },
  {
    requestId: 3,
    requestCode: 'YC-202609-003',
    roomId: 6,
    roomNumber: '203',
    tenantId: 3,
    tenantName: 'Vũ Đình Khang',
    category: 'Điện',
    title: 'Ổ cắm khu vực bếp bị chập nhảy aptomat',
    description: 'Khi cắm nồi chiên không dầu thì cầu dao sập và có mùi khét nhẹ',
    priority: 'Khẩn cấp',
    status: 'Đã phân công',
    assignedTechnicianId: 2,
    assignedTechnicianName: 'Nguyễn Tuấn Kiệt',
    assignedAt: '2026-09-21 08:30',
    createdAt: '2026-09-21 07:45'
  },
  {
    requestId: 4,
    requestCode: 'YC-202609-004',
    roomId: 3,
    roomNumber: '103',
    tenantId: 1,
    tenantName: 'Nguyễn Hoàng Anh',
    category: 'Thiết bị gia dụng',
    title: 'Bảo trì định kỳ máy giặt phòng 103',
    description: 'Vệ sinh lồng giặt và thay ống xả nước chuẩn bị đón khách thuê mới',
    priority: 'Thấp',
    status: 'Chờ tiếp nhận',
    createdAt: '2026-09-21 09:10'
  }
];
