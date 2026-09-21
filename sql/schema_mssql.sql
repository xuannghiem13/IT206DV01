-- ==============================================================
-- DATABASE SCHEMA: QUẢN LÝ CĂN HỘ DỊCH VỤ / PHÒNG TRỌ
-- Hệ quản trị CSDL: Microsoft SQL Server 2019+
-- Database: QuanLyCanHoDichVu
-- ==============================================================

USE QuanLyCanHoDichVu;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- 1. Bảng Vai trò (Roles)
IF OBJECT_ID('dbo.Roles', 'U') IS NULL
CREATE TABLE dbo.Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleKey NVARCHAR(50) NOT NULL UNIQUE,     -- 'owner', 'manager', 'technician', 'accountant', 'hr', 'tenant'
    RoleName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255)
);
GO

-- 2. Bảng Tài khoản người dùng (Users)
IF OBJECT_ID('dbo.Users', 'U') IS NULL
CREATE TABLE dbo.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    RoleId INT NOT NULL FOREIGN KEY REFERENCES dbo.Roles(RoleId),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 3. Bảng Cấu hình hệ thống & đơn giá (SystemSettings)
IF OBJECT_ID('dbo.SystemSettings', 'U') IS NULL
CREATE TABLE dbo.SystemSettings (
    SettingKey NVARCHAR(50) PRIMARY KEY,
    SettingValue NVARCHAR(255) NOT NULL,
    Description NVARCHAR(255),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 4. Bảng Tòa nhà / Khu căn hộ (Buildings)
IF OBJECT_ID('dbo.Buildings', 'U') IS NULL
CREATE TABLE dbo.Buildings (
    BuildingId INT IDENTITY(1,1) PRIMARY KEY,
    BuildingName NVARCHAR(100) NOT NULL,
    Address NVARCHAR(255) NOT NULL,
    TotalFloors INT DEFAULT 1,
    Description NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 5. Bảng Phòng / Căn hộ (Rooms)
IF OBJECT_ID('dbo.Rooms', 'U') IS NULL
CREATE TABLE dbo.Rooms (
    RoomId INT IDENTITY(1,1) PRIMARY KEY,
    BuildingId INT NOT NULL FOREIGN KEY REFERENCES dbo.Buildings(BuildingId),
    RoomNumber NVARCHAR(20) NOT NULL,
    Floor INT NOT NULL DEFAULT 1,
    RoomType NVARCHAR(50) DEFAULT N'Studio',    -- Studio, 1PN, 2PN, Duplex
    AreaSqM DECIMAL(6,2) DEFAULT 25.0,
    BasePrice DECIMAL(18,2) NOT NULL,           -- Giá thuê cơ bản (VNĐ/tháng)
    Status NVARCHAR(30) DEFAULT N'Trống',       -- 'Trống', 'Đang thuê', 'Đang sửa chữa'
    Amenities NVARCHAR(MAX),                    -- Tiện nghi: Điều hòa, Máy giặt, Tủ lạnh, Tủ bếp...
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 6. Bảng Khách thuê (Tenants)
IF OBJECT_ID('dbo.Tenants', 'U') IS NULL
CREATE TABLE dbo.Tenants (
    TenantId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    FullName NVARCHAR(100) NOT NULL,
    IdCard NVARCHAR(20) NOT NULL UNIQUE,        -- CCCD / CMND
    Phone NVARCHAR(20) NOT NULL,
    Email NVARCHAR(100),
    PermanentAddress NVARCHAR(255),
    EmergencyContact NVARCHAR(150),             -- Tên & SĐT người thân
    VehiclePlate NVARCHAR(50),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 7. Bảng Hợp đồng thuê (Contracts)
IF OBJECT_ID('dbo.Contracts', 'U') IS NULL
CREATE TABLE dbo.Contracts (
    ContractId INT IDENTITY(1,1) PRIMARY KEY,
    ContractCode NVARCHAR(50) NOT NULL UNIQUE,
    RoomId INT NOT NULL FOREIGN KEY REFERENCES dbo.Rooms(RoomId),
    TenantId INT NOT NULL FOREIGN KEY REFERENCES dbo.Tenants(TenantId),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    MonthlyRent DECIMAL(18,2) NOT NULL,
    DepositAmount DECIMAL(18,2) NOT NULL,
    PaymentCycleMonths INT DEFAULT 1,
    Status NVARCHAR(30) DEFAULT N'Còn hiệu lực', -- 'Còn hiệu lực', 'Sắp hết hạn', 'Đã thanh lý'
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 8. Bảng Chỉ số Điện Nước định kỳ (UtilityReadings)
IF OBJECT_ID('dbo.UtilityReadings', 'U') IS NULL
CREATE TABLE dbo.UtilityReadings (
    ReadingId INT IDENTITY(1,1) PRIMARY KEY,
    RoomId INT NOT NULL FOREIGN KEY REFERENCES dbo.Rooms(RoomId),
    ReadingMonth INT NOT NULL,
    ReadingYear INT NOT NULL,
    PrevElectric INT NOT NULL DEFAULT 0,
    CurrElectric INT NOT NULL DEFAULT 0,
    ElectricUsage AS (CurrElectric - PrevElectric) PERSISTED,
    PrevWater INT NOT NULL DEFAULT 0,
    CurrWater INT NOT NULL DEFAULT 0,
    WaterUsage AS (CurrWater - PrevWater) PERSISTED,
    RecordedBy NVARCHAR(100),
    RecordedDate DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT UQ_Room_MonthYear UNIQUE (RoomId, ReadingMonth, ReadingYear)
);
GO

-- 9. Bảng Hóa đơn thanh toán (Invoices)
IF OBJECT_ID('dbo.Invoices', 'U') IS NULL
CREATE TABLE dbo.Invoices (
    InvoiceId INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceCode NVARCHAR(50) NOT NULL UNIQUE,
    RoomId INT NOT NULL FOREIGN KEY REFERENCES dbo.Rooms(RoomId),
    TenantId INT NOT NULL FOREIGN KEY REFERENCES dbo.Tenants(TenantId),
    BillingMonth INT NOT NULL,
    BillingYear INT NOT NULL,
    RentFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    ElectricFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    WaterFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    ServiceFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    OtherFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaidAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    DueDate DATE NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Chưa thanh toán', -- 'Chưa thanh toán', 'Đã thanh toán', 'Quá hạn', 'Thanh toán một phần'
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 10. Bảng Phiếu thu / Lịch sử thanh toán (Payments)
IF OBJECT_ID('dbo.Payments', 'U') IS NULL
CREATE TABLE dbo.Payments (
    PaymentId INT IDENTITY(1,1) PRIMARY KEY,
    PaymentCode NVARCHAR(50) NOT NULL UNIQUE,
    InvoiceId INT NOT NULL FOREIGN KEY REFERENCES dbo.Invoices(InvoiceId),
    Amount DECIMAL(18,2) NOT NULL,
    PaymentMethod NVARCHAR(50) DEFAULT N'Chuyển khoản VietQR', -- 'Tiền mặt', 'Chuyển khoản VietQR'
    TransactionRef NVARCHAR(100),
    PaymentDate DATETIME2 DEFAULT GETDATE(),
    Notes NVARCHAR(255)
);
GO

-- 11. Bảng Phòng ban & Nhân sự (Departments & Employees)
IF OBJECT_ID('dbo.Departments', 'U') IS NULL
CREATE TABLE dbo.Departments (
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255)
);
GO

IF OBJECT_ID('dbo.Employees', 'U') IS NULL
CREATE TABLE dbo.Employees (
    EmployeeId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
    EmployeeCode NVARCHAR(30) NOT NULL UNIQUE,
    FullName NVARCHAR(100) NOT NULL,
    DepartmentId INT NOT NULL FOREIGN KEY REFERENCES dbo.Departments(DepartmentId),
    Position NVARCHAR(50) NOT NULL,              -- 'Quản lý căn hộ', 'Kỹ thuật viên', 'Kế toán viên', 'Chuyên viên nhân sự'
    Phone NVARCHAR(20) NOT NULL,
    Email NVARCHAR(100),
    IdCard NVARCHAR(20),
    HireDate DATE NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Đang làm việc',-- 'Đang làm việc', 'Nghỉ phép', 'Đã nghỉ việc'
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 12. Bảng Phân công ca & Chấm công (Attendance)
IF OBJECT_ID('dbo.Attendance', 'U') IS NULL
CREATE TABLE dbo.Attendance (
    AttendanceId INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId INT NOT NULL FOREIGN KEY REFERENCES dbo.Employees(EmployeeId),
    WorkDate DATE NOT NULL,
    Shift NVARCHAR(50) DEFAULT N'Ca hành chính (8h-17h)',
    CheckInTime TIME NULL,
    CheckOutTime TIME NULL,
    Status NVARCHAR(30) DEFAULT N'Đúng giờ',     -- 'Đúng giờ', 'Đi trễ', 'Nghỉ có phép', 'Nghỉ không phép'
    Notes NVARCHAR(255),
    CONSTRAINT UQ_Emp_WorkDate UNIQUE (EmployeeId, WorkDate)
);
GO

-- 13. Bảng Yêu cầu sửa chữa & Sự cố kỹ thuật (MaintenanceRequests)
IF OBJECT_ID('dbo.MaintenanceRequests', 'U') IS NULL
CREATE TABLE dbo.MaintenanceRequests (
    RequestId INT IDENTITY(1,1) PRIMARY KEY,
    RequestCode NVARCHAR(50) NOT NULL UNIQUE,
    RoomId INT NOT NULL FOREIGN KEY REFERENCES dbo.Rooms(RoomId),
    TenantId INT NOT NULL FOREIGN KEY REFERENCES dbo.Tenants(TenantId),
    Category NVARCHAR(50) NOT NULL,             -- 'Điện', 'Nước', 'Điều hòa', 'Thiết bị gia dụng', 'Khác'
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Priority NVARCHAR(20) DEFAULT N'Bình thường',-- 'Khẩn cấp', 'Cao', 'Bình thường', 'Thấp'
    Status NVARCHAR(30) DEFAULT N'Chờ tiếp nhận',-- 'Chờ tiếp nhận', 'Đã phân công', 'Đang xử lý', 'Hoàn thành', 'Hủy'
    AssignedTechnicianId INT NULL FOREIGN KEY REFERENCES dbo.Employees(EmployeeId),
    AssignedAt DATETIME2 NULL,
    CompletedAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 14. Bảng Nhật ký xử lý & Chi phí sửa chữa (MaintenanceLogs)
IF OBJECT_ID('dbo.MaintenanceLogs', 'U') IS NULL
CREATE TABLE dbo.MaintenanceLogs (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL FOREIGN KEY REFERENCES dbo.MaintenanceRequests(RequestId),
    TechnicianId INT NOT NULL FOREIGN KEY REFERENCES dbo.Employees(EmployeeId),
    ActionTaken NVARCHAR(MAX) NOT NULL,
    MaterialsUsed NVARCHAR(MAX),
    RepairCost DECIMAL(18,2) DEFAULT 0,
    LoggedAt DATETIME2 DEFAULT GETDATE()
);
GO
