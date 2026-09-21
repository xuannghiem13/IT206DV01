-- ==============================================================
-- SEED DATA: DỮ LIỆU MẪU ĐẦY ĐỦ CHO TẤT CẢ TÁC NHÂN
-- Hệ quản trị CSDL: Microsoft SQL Server 2019+
-- Database: QuanLyCanHoDichVu
-- ==============================================================

USE QuanLyCanHoDichVu;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- 1. Cấu hình hệ thống & đơn giá (SystemSettings)
MERGE dbo.SystemSettings AS target
USING (VALUES 
    (N'ELECTRIC_PRICE', N'3500', N'Đơn giá điện (VNĐ/kWh)'),
    (N'WATER_PRICE', N'25000', N'Đơn giá nước (VNĐ/m³)'),
    (N'INTERNET_PRICE', N'100000', N'Phí Internet cáp quang (VNĐ/phòng/tháng)'),
    (N'CLEANING_PRICE', N'50000', N'Phí vệ sinh & rác (VNĐ/phòng/tháng)'),
    (N'BANK_NAME', N'MBBank', N'Ngân hàng thụ hưởng VietQR'),
    (N'BANK_ACCOUNT_NO', N'0909123456', N'Số tài khoản thụ hưởng'),
    (N'BANK_ACCOUNT_NAME', N'CHU TRO CAN HO DICH VU', N'Tên chủ tài khoản'),
    (N'APARTMENT_NAME', N'Sunrise Living Serviced Apartments', N'Tên chuỗi căn hộ')
) AS source (SettingKey, SettingValue, Description)
ON target.SettingKey = source.SettingKey
WHEN MATCHED THEN 
    UPDATE SET SettingValue = source.SettingValue, Description = source.Description
WHEN NOT MATCHED THEN
    INSERT (SettingKey, SettingValue, Description) VALUES (source.SettingKey, source.SettingValue, source.Description);
GO

-- 2. Thêm Vai trò (Roles)
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE RoleKey = 'owner')
INSERT INTO dbo.Roles (RoleKey, RoleName, Description) VALUES
('owner', N'Chủ trọ', N'Quản trị tổng hợp toàn bộ hệ thống, phân quyền, cấu hình giá và báo cáo'),
('manager', N'Bộ phận Quản lý', N'Quản lý phòng, người thuê, hợp đồng, chỉ số điện nước, điều phối sự cố'),
('technician', N'Bộ phận Kỹ thuật', N'Tiếp nhận xử lý sự cố sửa chữa, cập nhật trạng thái và chi phí linh kiện'),
('accountant', N'Bộ phận Kế toán', N'Quản lý hóa đơn, đối soát thanh toán, công nợ và báo cáo tài chính'),
('hr', N'Bộ phận Nhân sự', N'Quản lý hồ sơ nhân viên, chức vụ, ca trực và theo dõi chấm công'),
('tenant', N'Người thuê', N'Tra cứu phòng, hóa đơn, quét mã VietQR và gửi yêu cầu sửa chữa');
GO

-- 3. Thêm Phòng ban (Departments)
IF NOT EXISTS (SELECT 1 FROM dbo.Departments WHERE DepartmentName = N'Ban Quản trị')
INSERT INTO dbo.Departments (DepartmentName, Description) VALUES
(N'Ban Quản trị', N'Điều hành chung chuỗi căn hộ dịch vụ'),
(N'Bộ phận Vận hành & Quản lý', N'Phụ trách bàn giao phòng, hợp đồng và khách hàng'),
(N'Bộ phận Kỹ thuật & Bảo trì', N'Bảo dưỡng và sửa chữa trang thiết bị căn hộ'),
(N'Bộ phận Tài chính Kế toán', N'Thu chi, lập hóa đơn và quản lý công nợ'),
(N'Bộ phận Nhân sự & Hành chính', N'Quản lý hồ sơ cán bộ nhân viên, chế độ chấm công');
GO

-- 4. Thêm Tòa nhà (Buildings)
IF NOT EXISTS (SELECT 1 FROM dbo.Buildings WHERE BuildingName = N'Tòa Sunrise Building')
INSERT INTO dbo.Buildings (BuildingName, Address, TotalFloors, Description) VALUES
(N'Tòa Sunrise Building', N'123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP.HCM', 5, N'Tòa nhà trung tâm 25 phòng khép kín cao cấp'),
(N'Tòa Moon River Residence', N'45 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, TP.HCM', 4, N'Khu căn hộ studio tiện nghi yên tĩnh');
GO

-- 5. Thêm Danh sách Phòng mẫu (Rooms)
IF NOT EXISTS (SELECT 1 FROM dbo.Rooms WHERE RoomNumber = N'101')
INSERT INTO dbo.Rooms (BuildingId, RoomNumber, Floor, RoomType, AreaSqM, BasePrice, Status, Amenities) VALUES
(1, N'101', 1, N'Studio', 28.0, 5500000, N'Đang thuê', N'Điều hòa Inverter, Tủ lạnh 180L, Giường nệm, Tủ quần áo, Bếp điện từ, Nóng lạnh'),
(1, N'102', 1, N'Studio', 30.0, 5800000, N'Trống', N'Điều hòa Inverter, Tủ lạnh, Tủ bếp gỗ sồi, Ban công thoáng mát, Bàn làm việc'),
(1, N'103', 1, N'1 Phòng ngủ', 35.0, 6500000, N'Đang sửa chữa', N'Điều hòa 2 chiều, Tủ lạnh, Máy giặt riêng, Sofa phòng khách, Tủ âm tường'),
(1, N'201', 2, N'1 Phòng ngủ', 35.0, 6700000, N'Đang thuê', N'Nội thất cao cấp, Máy giặt sấy, Tủ bếp hiện đại, Giường King size, Tivi 50 inch'),
(1, N'202', 2, N'Studio', 28.0, 5600000, N'Trống', N'Điều hòa, Nóng lạnh, Tủ lạnh, Giường đôi, Bàn trang điểm'),
(1, N'203', 2, N'Duplex gác lửng', 40.0, 7500000, N'Đang thuê', N'Gác lửng kính cường lực, Máy giặt riêng, Tủ lạnh 2 cửa, Bàn làm việc công thái học'),
(1, N'301', 3, N'2 Phòng ngủ', 55.0, 9500000, N'Đang thuê', N'2 phòng ngủ tách biệt, Ban công view thành phố, Máy giặt, Bếp điện đôi, Sofa chữ L'),
(1, N'302', 3, N'Studio', 28.0, 5500000, N'Trống', N'Trang bị cơ bản: Điều hòa, Máy nước nóng, Giường nệm, Tủ quần áo');
GO

-- 6. Thêm Nhân viên (Employees)
IF NOT EXISTS (SELECT 1 FROM dbo.Employees WHERE EmployeeCode = N'NV-QL01')
INSERT INTO dbo.Employees (EmployeeCode, FullName, DepartmentId, Position, Phone, Email, IdCard, HireDate, Status) VALUES
(N'NV-QL01', N'Trần Văn Hoàng', 2, N'Quản lý căn hộ', N'0912345678', N'hoang.tran@sunrise.vn', N'079090001111', '2023-01-15', N'Đang làm việc'),
(N'NV-KT01', N'Nguyễn Tuấn Kiệt', 3, N'Kỹ thuật viên trưởng', N'0933221100', N'kiet.nguyen@sunrise.vn', N'079090002222', '2023-03-01', N'Đang làm việc'),
(N'NV-KT02', N'Lê Minh Quân', 3, N'Kỹ thuật viên điện nước', N'0944556677', N'quan.le@sunrise.vn', N'079090003333', '2023-08-10', N'Đang làm việc'),
(N'NV-KT03', N'Đặng Thanh Mai', 4, N'Kế toán tổng hợp', N'0977889900', N'mai.dang@sunrise.vn', N'079090004444', '2023-02-20', N'Đang làm việc'),
(N'NV-NS01', N'Phạm Thu Hương', 5, N'Chuyên viên Nhân sự', N'0988112233', N'huong.pham@sunrise.vn', N'079090005555', '2023-05-05', N'Đang làm việc');
GO

-- 7. Thêm Chấm công mẫu (Attendance)
IF NOT EXISTS (SELECT 1 FROM dbo.Attendance WHERE EmployeeId = 1 AND WorkDate = CAST(GETDATE() AS DATE))
INSERT INTO dbo.Attendance (EmployeeId, WorkDate, Shift, CheckInTime, CheckOutTime, Status, Notes) VALUES
(1, CAST(GETDATE() AS DATE), N'Ca sáng (8h-17h)', '07:55:00', NULL, N'Đúng giờ', N'Trực bàn giao phòng 101'),
(2, CAST(GETDATE() AS DATE), N'Ca sáng (8h-17h)', '08:05:00', NULL, N'Đúng giờ', N'Xử lý bảo trì máy lạnh 103'),
(3, CAST(GETDATE() AS DATE), N'Ca chiều (13h-21h)', NULL, NULL, N'Đúng giờ', N'Ca trực tối'),
(4, CAST(GETDATE() AS DATE), N'Ca sáng (8h-17h)', '07:50:00', NULL, N'Đúng giờ', N'Lập bảng kê hóa đơn tháng'),
(5, CAST(GETDATE() AS DATE), N'Ca sáng (8h-17h)', '08:00:00', NULL, N'Đúng giờ', N'Tổng hợp chấm công tuần');
GO

-- 8. Thêm Khách thuê mẫu (Tenants)
IF NOT EXISTS (SELECT 1 FROM dbo.Tenants WHERE IdCard = N'079195000001')
INSERT INTO dbo.Tenants (FullName, IdCard, Phone, Email, PermanentAddress, EmergencyContact, VehiclePlate) VALUES
(N'Nguyễn Hoàng Anh', N'079195000001', N'0908123456', N'hoanganh.tech@gmail.com', N'Hải Châu, Đà Nẵng', N'Mẹ: Bà Lan (0903111222)', N'43D1-678.99'),
(N'Lê Thị Phương Thảo', N'079195000002', N'0918765432', N'thaole.design@gmail.com', N'Quy Nhơn, Bình Định', N'Bố: Ông Lê Dũng (0913444555)', N'77B2-123.45'),
(N'Vũ Đình Khang', N'079195000003', N'0938555666', N'khang.vu@startup.co', N'Ninh Kiều, Cần Thơ', N'Vợ: Minh Hằng (0938777888)', N'65A-987.65'),
(N'Đỗ Bảo Châu', N'079195000004', N'0987333222', N'chando@gmail.com', N'Nha Trang, Khánh Hòa', N'Chị: Đỗ Ngọc Anh (0987111333)', N'79N1-555.22');
GO

-- 9. Thêm Hợp đồng thuê mẫu (Contracts)
IF NOT EXISTS (SELECT 1 FROM dbo.Contracts WHERE ContractCode = N'HD-2024-101')
INSERT INTO dbo.Contracts (ContractCode, RoomId, TenantId, StartDate, EndDate, MonthlyRent, DepositAmount, PaymentCycleMonths, Status, Notes) VALUES
(N'HD-2024-101', 1, 1, '2024-01-01', '2025-01-01', 5500000, 11000000, 1, N'Còn hiệu lực', N'Hợp đồng 12 tháng, cọc 2 tháng'),
(N'HD-2024-201', 4, 2, '2024-02-15', '2025-02-15', 6700000, 13400000, 1, N'Còn hiệu lực', N'Khách ở 1 người, cam kết giữ gìn nội thất'),
(N'HD-2024-203', 6, 3, '2023-11-01', '2024-11-01', 7500000, 15000000, 1, N'Sắp hết hạn', N'Khách đang cân nhắc gia hạn thêm 1 năm'),
(N'HD-2024-301', 7, 4, '2024-03-01', '2025-03-01', 9500000, 19000000, 1, N'Còn hiệu lực', N'Căn hộ 2 phòng ngủ gia đình nhỏ');
GO

-- 10. Thêm Chỉ số Điện Nước (UtilityReadings)
IF NOT EXISTS (SELECT 1 FROM dbo.UtilityReadings WHERE RoomId = 1 AND ReadingMonth = 9 AND ReadingYear = 2026)
INSERT INTO dbo.UtilityReadings (RoomId, ReadingMonth, ReadingYear, PrevElectric, CurrElectric, PrevWater, CurrWater, RecordedBy) VALUES
(1, 9, 2026, 1250, 1375, 45, 52, N'Trần Văn Hoàng'),
(4, 9, 2026, 2100, 2240, 80, 89, N'Trần Văn Hoàng'),
(6, 9, 2026, 3050, 3210, 110, 122, N'Trần Văn Hoàng'),
(7, 9, 2026, 4200, 4420, 160, 178, N'Trần Văn Hoàng');
GO

-- 11. Thêm Hóa đơn thanh toán mẫu (Invoices)
IF NOT EXISTS (SELECT 1 FROM dbo.Invoices WHERE InvoiceCode = N'HDT-202609-101')
INSERT INTO dbo.Invoices (InvoiceCode, RoomId, TenantId, BillingMonth, BillingYear, RentFee, ElectricFee, WaterFee, ServiceFee, OtherFee, TotalAmount, PaidAmount, DueDate, Status) VALUES
(N'HDT-202609-101', 1, 1, 9, 2026, 5500000, 437500, 175000, 150000, 0, 6262500, 6262500, '2026-09-05', N'Đã thanh toán'),
(N'HDT-202609-201', 4, 2, 9, 2026, 6700000, 490000, 225000, 150000, 0, 7565000, 0, '2026-09-25', N'Chưa thanh toán'),
(N'HDT-202609-203', 6, 3, 9, 2026, 7500000, 560000, 300000, 150000, 0, 8510000, 0, '2026-09-20', N'Quá hạn'),
(N'HDT-202609-301', 7, 4, 9, 2026, 9500000, 770000, 450000, 150000, 0, 10870000, 5000000, '2026-09-28', N'Thanh toán một phần');
GO

-- 12. Thêm Lịch sử thanh toán mẫu (Payments)
IF NOT EXISTS (SELECT 1 FROM dbo.Payments WHERE PaymentCode = N'PAY-202609-001')
INSERT INTO dbo.Payments (PaymentCode, InvoiceId, Amount, PaymentMethod, TransactionRef, Notes) VALUES
(N'PAY-202609-001', 1, 6262500, N'Chuyển khoản VietQR', N'MBB26090212345', N'Thanh toán tiền phòng 101 tháng 09/2026'),
(N'PAY-202609-002', 4, 5000000, N'Chuyển khoản VietQR', N'VCB26091099887', N'Tạm ứng thanh toán đợt 1 phòng 301');
GO

-- 13. Thêm Yêu cầu sửa chữa & Sự cố kỹ thuật (MaintenanceRequests)
IF NOT EXISTS (SELECT 1 FROM dbo.MaintenanceRequests WHERE RequestCode = N'YC-202609-001')
INSERT INTO dbo.MaintenanceRequests (RequestCode, RoomId, TenantId, Category, Title, Description, Priority, Status, AssignedTechnicianId, AssignedAt, CompletedAt) VALUES
(N'YC-202609-001', 1, 1, N'Điều hòa', N'Máy lạnh phòng 101 chảy nước ngưng', N'Dàn lạnh trong phòng ngủ bị chảy nước xuống bàn làm việc từ tối qua', N'Cao', N'Hoàn thành', 2, '2026-09-18 09:00:00', '2026-09-18 11:30:00'),
(N'YC-202609-002', 4, 2, N'Nước', N'Vòi sen nhà tắm bị rò rỉ nước', N'Khóa van rồi nhưng vẫn bị rỉ nước liên tục gây hao nước', N'Bình thường', N'Đang xử lý', 3, '2026-09-20 14:00:00', NULL),
(N'YC-202609-003', 6, 3, N'Điện', N'Ổ cắm khu vực bếp bị chập mất điện', N'Khi cắm nồi chiên không dầu thì cầu dao sập và có mùi khét nhẹ', N'Khẩn cấp', N'Đã phân công', 2, '2026-09-21 08:30:00', NULL),
(N'YC-202609-004', 3, 1, N'Thiết bị gia dụng', N'Bảo trì định kỳ máy giặt phòng 103', N'Vệ sinh lồng giặt và thay ống xả nước chuẩn bị bàn giao khách mới', N'Thấp', N'Chờ tiếp nhận', NULL, NULL, NULL);
GO

-- 14. Thêm Nhật ký nghiệm thu kỹ thuật (MaintenanceLogs)
IF NOT EXISTS (SELECT 1 FROM dbo.MaintenanceLogs WHERE RequestId = 1)
INSERT INTO dbo.MaintenanceLogs (RequestId, TechnicianId, ActionTaken, MaterialsUsed, RepairCost) VALUES
(1, 2, N'Thông tắc ống thoát nước ngưng điều hòa, xịt rửa tấm lọc bụi và kiểm tra gas', N'Ống mềm 2m, băng keo bạc cách nhiệt', 150000);
GO
