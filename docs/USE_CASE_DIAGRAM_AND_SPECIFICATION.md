# TÀI LIỆU PHÂN TÍCH USE CASE & BIỂU ĐỒ UML
## ĐỀ TÀI: HỆ THỐNG QUẢN LÝ CĂN HỘ DỊCH VỤ & PHÒNG TRỌ (HSU)
**Môn học**: Phân tích Hướng Đối Tượng (OOAD)  
**Tài liệu tham chiếu**: `Request.txt`, `PhanTichHDT_Nhom1.docx`, Cơ sở dữ liệu và mã nguồn `apartment-web`

---

> [!TIP]
> **THƯ VIỆN HÌNH ẢNH BIỂU ĐỒ USE CASE (PNG & VECTOR SVG ĐỘ PHÂN GIẢI CAO 2K)**:
> - 🌐 **Trình xem tương tác HTML**: Mở file [`DIAGRAMS_VIEWER.html`](file:///g:/HSU/DIAGRAMS_VIEWER.html) trong trình duyệt để xem toàn bộ ảnh và tải về 1-click.
> - 🖼️ **File ảnh PNG độ nét cao (Chèn trực tiếp vào Word `PhanTichHDT_Nhom1.docx`)**:
>   - [01_use_case_tong_the.png](file:///g:/HSU/diagrams/01_use_case_tong_the.png) (2475x1770px - Toàn hệ thống)
>   - [02_use_case_chu_tro.png](file:///g:/HSU/diagrams/02_use_case_chu_tro.png) (1650x1125px - Phân hệ Chủ trọ)
>   - [03_use_case_quan_ly.png](file:///g:/HSU/diagrams/03_use_case_quan_ly.png) (1800x1275px - Phân hệ Quản lý)
>   - [04_use_case_ky_thuat.png](file:///g:/HSU/diagrams/04_use_case_ky_thuat.png) (1650x1125px - Phân hệ Kỹ thuật)
>   - [05_use_case_ke_toan.png](file:///g:/HSU/diagrams/05_use_case_ke_toan.png) (1725x1125px - Phân hệ Kế toán)
>   - [06_use_case_nhan_su.png](file:///g:/HSU/diagrams/06_use_case_nhan_su.png) (1650x1125px - Phân hệ Nhân sự)
>   - [07_use_case_khach_thue.png](file:///g:/HSU/diagrams/07_use_case_khach_thue.png) (1650x1125px - Phân hệ Cổng Khách thuê)
> - 📐 **File đồ họa Vector SVG gốc**: Thư mục [`diagrams/`](file:///g:/HSU/diagrams/)

## MỤC LỤC
1. [Xác Định & Phân Loại Tác Nhân (Actors)](#1-xác-định--phân-loại-tác-nhân-actors)
2. [Biểu Đồ UML Use Case Tổng Thể Hệ Thống (System Overview Diagram)](#2-biểu-đồ-uml-use-case-tổng-thể-hệ-thống-system-overview-diagram)
3. [Biểu Đồ UML Use Case Phân Rã Theo Từng Phân Hệ](#3-biểu-đồ-uml-use-case-phân-rã-theo-từng-phân-hệ)
   - [3.1. Phân hệ Chủ trọ (Owner)](#31-phân-hệ-chủ-trọ-owner)
   - [3.2. Phân hệ Bộ phận Quản lý (Manager)](#32-phân-hệ-bộ-phận-quản-lý-manager)
   - [3.3. Phân hệ Bộ phận Kỹ thuật (Technician)](#33-phân-hệ-bộ-phận-kỹ-thuật-technician)
   - [3.4. Phân hệ Bộ phận Kế toán (Accountant)](#34-phân-hệ-bộ-phận-kế-toán-accountant)
   - [3.5. Phân hệ Bộ phận Nhân sự (HR)](#35-phân-hệ-bộ-phận-nhân-sự-hr)
   - [3.6. Phân hệ Cổng Khách thuê (Tenant Portal)](#36-phân-hệ-cổng-khách-thuê-tenant-portal)
4. [Ma Trận Phân Quyền Tác Nhân - Use Case (CRUD / Traceability Matrix)](#4-ma-trận-phân-quyền-tác-nhân---use-case-crud--traceability-matrix)
5. [Đặc Tả Chi Tiết Các Use Case Cốt Lõi (Use Case Specifications)](#5-đặc-tả-chi-tiết-các-use-case-cốt-lõi-use-case-specifications)
6. [Mã Nguồn PlantUML (Dùng Cho Draw.io / StarUML / PlantText)](#6-mã-nguồn-plantuml-dùng-cho-drawio--staruml--planttext)

---

## 1. XÁC ĐỊNH & PHÂN LOẠI TÁC NHÂN (ACTORS)

| Tác nhân (Actor) | Vai trò trong hệ thống | Loại tác nhân | Kế thừa / Quan hệ |
| :--- | :--- | :--- | :--- |
| **Chủ trọ (Owner)** | Quản trị cấp cao nhất, toàn quyền phân quyền, thiết lập biểu giá, giám sát hoạt động và duyệt báo cáo tài chính tổng hợp. | Primary (Chính) | Độc lập |
| **Nhân viên (Staff / Employee)** | Tác nhân khái quát đại diện cho toàn thể nhân sự vận hành trong tòa nhà. | Abstract Actor | Là lớp cha của Manager, Tech, Accountant, HR |
| **Bộ phận Quản lý (Apartment Manager)** | Quản lý sơ đồ phòng, tiếp nhận khách thuê, lập hợp đồng, cập nhật chỉ số điện nước, bàn giao phòng và điều phối sự cố. | Primary (Chính) | Kế thừa từ `Nhân viên` |
| **Bộ phận Kỹ thuật (Technician)** | Tiếp nhận phiếu phân công, kiểm tra hiện trường, sửa chữa hỏng hóc, ghi nhận kết quả và chi phí linh kiện phát sinh. | Primary (Chính) | Kế thừa từ `Nhân viên` |
| **Bộ phận Kế toán (Accountant)** | Quản lý hóa đơn thu tiền định kỳ, đối soát giao dịch VietQR, thu tiền mặt, quản lý công nợ và lập báo cáo doanh thu. | Primary (Chính) | Kế thừa từ `Nhân viên` |
| **Bộ phận Nhân sự (HR)** | Quản lý danh bạ hồ sơ nhân viên, cơ cấu phòng ban chức vụ, chấm công/điểm danh và điều phối ca trực. | Primary (Chính) | Kế thừa từ `Nhân viên` |
| **Người thuê (Tenant)** | Tra cứu hợp đồng, theo dõi mức tiêu thụ điện nước, xem hóa đơn, quét VietQR thanh toán và gửi phản ánh hỏng hóc. | Primary (Chính) | Độc lập |
| **Cổng Ngân hàng VietQR (Napas 24/7)** | Hệ thống thanh toán liên ngân hàng tự động tạo QR động theo chuẩn EMVCo và xác nhận biến động số dư. | Secondary (Phụ/Ngoại vi) | External System |

### Biểu đồ Kế thừa Tác nhân (Actor Generalization Hierarchy)

```mermaid
classDiagram
    class User {
        <<Actor>>
        Đăng nhập hệ thống
        Đổi mật khẩu
        Cập nhật thông tin cá nhân
    }
    class Owner {
        <<Actor>>
        Chủ trọ
    }
    class Tenant {
        <<Actor>>
        Khách thuê căn hộ
    }
    class Staff {
        <<Abstract Actor>>
        Nhân viên nội bộ
    }
    class Manager {
        <<Actor>>
        Bộ phận Quản lý
    }
    class Technician {
        <<Actor>>
        Bộ phận Kỹ thuật
    }
    class Accountant {
        <<Actor>>
        Bộ phận Kế toán
    }
    class HR {
        <<Actor>>
        Bộ phận Nhân sự
    }

    User <|-- Owner
    User <|-- Tenant
    User <|-- Staff
    Staff <|-- Manager
    Staff <|-- Technician
    Staff <|-- Accountant
    Staff <|-- HR
```

---

## 2. BIỂU ĐỒ UML USE CASE TỔNG THỂ HỆ THỐNG (SYSTEM OVERVIEW DIAGRAM)

Biểu đồ này biểu diễn toàn cảnh 6 nhóm chức năng nghiệp vụ tương ứng với 6 tác nhân chính và hệ thống thanh toán ngoài:

```mermaid
flowchart LR
    %% Actors
    subgraph ACTORS["CÁC TÁC NHÂN"]
        Owner(["👑 Chủ trọ"]):::actorStyle
        Manager(["🏢 Quản lý"]):::actorStyle
        Tech(["🔧 Kỹ thuật"]):::actorStyle
        Accountant(["📊 Kế toán"]):::actorStyle
        HR(["👥 Nhân sự"]):::actorStyle
        Tenant(["🏠 Người thuê"]):::actorStyle
        Bank[("🏦 Hệ thống VietQR")]:::bankStyle
    end

    %% System Boundary
    subgraph SYSTEM["HỆ THỐNG QUẢN LÝ CĂN HỘ DỊCH VỤ & PHÒNG TRỌ"]
        
        %% Phân hệ Xác thực chung
        subgraph PKG_AUTH["Xác Thực & Quản Trị Hệ Thống"]
            UC_Login(["UC01: Đăng nhập & Xác thực"])
            UC_ChangePass(["UC02: Đổi mật khẩu"])
            UC_ManageUser(["UC03: Quản lý tài khoản & Phân quyền"])
            UC_Pricing(["UC04: Thiết lập biểu giá & Cấu hình"])
            UC_OverviewReport(["UC05: Xem báo cáo tổng hợp & Doanh thu"])
        end

        %% Phân hệ Quản lý & Vận hành
        subgraph PKG_OPS["Vận Hành Căn Hộ & Khách Thuê"]
            UC_ManageRooms(["UC06: Quản lý danh mục phòng"])
            UC_ManageTenants(["UC07: Quản lý hồ sơ người thuê"])
            UC_ManageContracts(["UC08: Quản lý hợp đồng & Bàn giao"])
            UC_RecordUtility(["UC09: Cập nhật chỉ số điện nước"])
            UC_AssignTech(["UC10: Tiếp nhận & Phân công sự cố"])
        end

        %% Phân hệ Kỹ thuật & Sửa chữa
        subgraph PKG_TECH["Bảo Trì & Xử Lý Sự Cố"]
            UC_ViewTasks(["UC11: Tiếp nhận yêu cầu phân công"])
            UC_FixIssue(["UC12: Xử lý sự cố & Nghiệm thu"])
            UC_LogCost(["UC13: Ghi nhận vật tư & Chi phí"])
        end

        %% Phân hệ Tài chính & Kế toán
        subgraph PKG_ACC["Kế Toán & Thanh Toán"]
            UC_GenInvoice(["UC14: Quản lý & Tạo hóa đơn"])
            UC_RecordPayment(["UC15: Ghi nhận thanh toán tiền mặt/chuyển khoản"])
            UC_ManageDebt(["UC16: Quản lý công nợ"])
            UC_AccReport(["UC17: Xuất báo cáo tài chính"])
        end

        %% Phân hệ Nhân sự
        subgraph PKG_HR["Quản Lý Nhân Sự & Chấm Công"]
            UC_ManageEmp(["UC18: Quản lý hồ sơ nhân viên"])
            UC_ManageDept(["UC19: Quản lý chức vụ & Phòng ban"])
            UC_Attendance(["UC20: Điểm danh & Theo dõi chấm công"])
            UC_WorkShift(["UC21: Phân công ca trực"])
        end

        %% Phân hệ Cổng Khách Thuê
        subgraph PKG_TENANT["Cổng Dịch Vụ Khách Thuê"]
            UC_ViewRoomInfo(["UC22: Tra cứu thông tin hợp đồng & phòng"])
            UC_PayInvoice(["UC23: Thanh toán hóa đơn qua VietQR"])
            UC_RequestFix(["UC24: Gửi yêu cầu sửa chữa thiết bị"])
        end

    end

    %% Quan hệ giữa Actors và Use Cases
    Owner --> UC_ManageUser
    Owner --> UC_Pricing
    Owner --> UC_OverviewReport

    Manager --> UC_ManageRooms
    Manager --> UC_ManageTenants
    Manager --> UC_ManageContracts
    Manager --> UC_RecordUtility
    Manager --> UC_AssignTech

    Tech --> UC_ViewTasks
    Tech --> UC_FixIssue
    Tech --> UC_LogCost

    Accountant --> UC_GenInvoice
    Accountant --> UC_RecordPayment
    Accountant --> UC_ManageDebt
    Accountant --> UC_AccReport

    HR --> UC_ManageEmp
    HR --> UC_ManageDept
    HR --> UC_Attendance
    HR --> UC_WorkShift

    Tenant --> UC_ViewRoomInfo
    Tenant --> UC_PayInvoice
    Tenant --> UC_RequestFix

    %% Quan hệ include / extend
    UC_GenInvoice -.->|"<<include>>"| UC_RecordUtility
    UC_FixIssue -.->|"<<extend>>"| UC_LogCost
    UC_PayInvoice -.->|"<<include>>"| Bank
    UC_AssignTech -.->|"<<include>>"| UC_RequestFix

    %% Styling
    classDef actorStyle fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef bankStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
```

---

## 3. BIỂU ĐỒ UML USE CASE PHÂN RÃ THEO TỪNG PHÂN HỆ

### 3.1. Phân hệ Chủ trọ (Owner)
Chủ trọ nắm quyền quyết định cao nhất trong hệ thống, bao gồm cấu hình các thông số thanh toán, tài khoản và theo dõi chỉ số kinh doanh.

```mermaid
flowchart TD
    ActorOwner(["👑 Chủ trọ"]):::actorStyle

    subgraph SYSTEM_OWNER["Phân Hệ Quản Trị Cấp Cao (Owner)"]
        UC_O1(["Quản lý tài khoản"])
        UC_O2(["Phân quyền người dùng"])
        UC_O3(["Thiết lập biểu giá điện/nước/dịch vụ"])
        UC_O4(["Cấu hình tài khoản ngân hàng VietQR"])
        UC_O5(["Giám sát sơ đồ & Tình trạng phòng"])
        UC_O6(["Xem báo cáo doanh thu & Lợi nhuận"])
        UC_O7(["Xem thống kê công nợ tồn"])
        UC_ExportReport(["Xuất file thống kê (Excel/PDF)"])
        UC_Auth(["Đăng nhập & Xác thực"])
    end

    ActorOwner --> UC_O1
    ActorOwner --> UC_O2
    ActorOwner --> UC_O3
    ActorOwner --> UC_O4
    ActorOwner --> UC_O5
    ActorOwner --> UC_O6
    ActorOwner --> UC_O7

    UC_O1 -.->|"<<include>>"| UC_Auth
    UC_O2 -.->|"<<include>>"| UC_Auth
    UC_O6 -.->|"<<extend>>"| UC_ExportReport
    UC_O7 -.->|"<<extend>>"| UC_ExportReport

    classDef actorStyle fill:#fef08a,stroke:#ca8a04,stroke-width:2px,color:#854d0e,font-weight:bold;
```

---

### 3.2. Phân hệ Bộ phận Quản lý (Manager)
Bộ phận Quản lý chịu trách nhiệm chính về vận hành tòa nhà, tiếp nhận người thuê, hợp đồng, theo dõi phòng và chốt chỉ số tiện ích.

```mermaid
flowchart TD
    ActorManager(["🏢 Bộ phận Quản lý"]):::actorStyle
    ActorTenantRef(["🏠 Người thuê (Phối hợp)"]):::subActorStyle
    ActorTechRef(["🔧 Kỹ thuật viên (Nhận việc)"]):::subActorStyle

    subgraph SYSTEM_MGR["Phân Hệ Vận Hành Căn Hộ (Manager)"]
        UC_M1(["Quản lý danh sách phòng"])
        UC_M2(["Cập nhật trạng thái phòng (Trống/Thuê/Bảo trì)"])
        UC_M3(["Quản lý hồ sơ người thuê"])
        UC_M4(["Lập hợp đồng thuê mới"])
        UC_M5(["Gia hạn & Thanh lý hợp đồng"])
        UC_M6(["Bàn giao phòng & Kiểm kê tài sản"])
        UC_M7(["Chốt chỉ số điện & nước định kỳ"])
        UC_M8(["Tiếp nhận yêu cầu sự cố từ khách thuê"])
        UC_M9(["Điều phối & Phân công kỹ thuật viên"])
        UC_M10(["Giám sát tiến độ sửa chữa"])

        UC_CalcUtility(["Tính toán số tiêu thụ điện nước"])
    end

    ActorManager --> UC_M1
    ActorManager --> UC_M2
    ActorManager --> UC_M3
    ActorManager --> UC_M4
    ActorManager --> UC_M5
    ActorManager --> UC_M6
    ActorManager --> UC_M7
    ActorManager --> UC_M8
    ActorManager --> UC_M9
    ActorManager --> UC_M10

    UC_M4 -.->|"<<include>>"| UC_M3
    UC_M4 -.->|"<<include>>"| UC_M6
    UC_M7 -.->|"<<include>>"| UC_CalcUtility
    UC_M9 -.->|"<<include>>"| UC_M8
    UC_M9 -.-> ActorTechRef
    ActorTenantRef -.-> UC_M8

    classDef actorStyle fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1d4ed8,font-weight:bold;
    classDef subActorStyle fill:#f3f4f6,stroke:#9ca3af,stroke-width:1px,color:#374151;
```

---

### 3.3. Phân hệ Bộ phận Kỹ thuật (Technician)
Bộ phận kỹ thuật tập trung vào quy trình tiếp nhận phân công sự cố từ Quản lý, xử lý hiện trường và ghi nhận chi phí/vật tư phát sinh.

```mermaid
flowchart TD
    ActorTech(["🔧 Bộ phận Kỹ thuật"]):::actorStyle

    subgraph SYSTEM_TECH["Phân Hệ Xử Lý Sự Cố & Kỹ Thuật (Technician)"]
        UC_T1(["Xem danh sách sự cố được phân công"])
        UC_T2(["Tiếp nhận công việc xử lý"])
        UC_T3(["Cập nhật trạng thái sự cố (Đang xử lý / Hoàn thành)"])
        UC_T4(["Ghi nhận phương án & Kết quả khắc phục"])
        UC_T5(["Khai báo danh mục vật tư thay thế"])
        UC_T6(["Ghi nhận chi phí sửa chữa phát sinh"])
        UC_T7(["Đề xuất nghiệm thu & Đóng sự cố"])
    end

    ActorTech --> UC_T1
    ActorTech --> UC_T2
    ActorTech --> UC_T3
    ActorTech --> UC_T4
    ActorTech --> UC_T7

    UC_T4 -.->|"<<extend>>"| UC_T5
    UC_T4 -.->|"<<extend>>"| UC_T6
    UC_T7 -.->|"<<include>>"| UC_T4

    classDef actorStyle fill:#fed7aa,stroke:#ea580c,stroke-width:2px,color:#9a3412,font-weight:bold;
```

---

### 3.4. Phân hệ Bộ phận Kế toán (Accountant)
Kế toán thực hiện việc quản trị dòng tiền, phát hành hóa đơn, kiểm soát thu chi và đối soát thanh toán chuyển khoản qua VietQR.

```mermaid
flowchart TD
    ActorAcc(["📊 Bộ phận Kế toán"]):::actorStyle
    BankSystem[("🏦 Cổng VietQR / Napas")]:::bankStyle

    subgraph SYSTEM_ACC["Phân Hệ Kế Toán & Quản Lý Doanh Thu (Accountant)"]
        UC_A1(["Lập hóa đơn tiền phòng & dịch vụ"])
        UC_A2(["Tự động tổng hợp tiền phòng + điện nước + phụ phí"])
        UC_A3(["Ghi nhận thanh toán tiền mặt"])
        UC_A4(["Xác nhận giao dịch thanh toán chuyển khoản VietQR"])
        UC_A5(["Theo dõi & Đối soát công nợ"])
        UC_A6(["Gửi thông báo nhắc nợ / Quá hạn"])
        UC_A7(["Lập báo cáo tài chính định kỳ (Tháng/Quý/Năm)"])
        UC_PrintReceipt(["In biên lai thu tiền"])
    end

    ActorAcc --> UC_A1
    ActorAcc --> UC_A3
    ActorAcc --> UC_A4
    ActorAcc --> UC_A5
    ActorAcc --> UC_A6
    ActorAcc --> UC_A7

    UC_A1 -.->|"<<include>>"| UC_A2
    UC_A4 -.->|"<<include>>"| BankSystem
    UC_A3 -.->|"<<extend>>"| UC_PrintReceipt
    UC_A4 -.->|"<<extend>>"| UC_PrintReceipt

    classDef actorStyle fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#15803d,font-weight:bold;
    classDef bankStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
```

---

### 3.5. Phân hệ Bộ phận Nhân sự (HR)
Bộ phận nhân sự quản lý nguồn lực làm việc trong tòa nhà, quản lý thông tin nhân sự và chấm công làm việc.

```mermaid
flowchart TD
    ActorHR(["👥 Bộ phận Nhân sự"]):::actorStyle

    subgraph SYSTEM_HR["Phân Hệ Quản Lý Nhân Sự (HR)"]
        UC_H1(["Quản lý hồ sơ nhân viên (Xem danh sách, Tra cứu)"])
        UC_H2(["Thêm mới nhân viên"])
        UC_H3(["Cập nhật thông tin nhân viên"])
        UC_H4(["Thôi việc / Xóa nhân viên"])
        UC_H5(["Quản lý phòng ban & Chức danh"])
        UC_H6(["Phân công ca trực hàng ngày"])
        UC_H7(["Điểm danh & Ghi nhận chấm công"])
        UC_H8(["Theo dõi nghỉ phép & Đánh giá chuyên cần"])
    end

    ActorHR --> UC_H1
    ActorHR --> UC_H2
    ActorHR --> UC_H3
    ActorHR --> UC_H4
    ActorHR --> UC_H5
    ActorHR --> UC_H6
    ActorHR --> UC_H7
    ActorHR --> UC_H8

    UC_H7 -.->|"<<include>>"| UC_H6

    classDef actorStyle fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#6d28d9,font-weight:bold;
```

---

### 3.6. Phân hệ Cổng Khách thuê (Tenant Portal)
Cổng tự phục vụ dành cho người thuê căn hộ để tăng tính minh bạch, tiện lợi và tiết kiệm thời gian vận hành.

```mermaid
flowchart TD
    ActorTenant(["🏠 Người thuê căn hộ"]):::actorStyle
    BankSystem[("🏦 Cổng VietQR")]:::bankStyle

    subgraph SYSTEM_TENANT["Phân Hệ Cổng Khách Thuê (Tenant Portal)"]
        UC_P1(["Tra cứu thông tin căn hộ đang thuê"])
        UC_P2(["Xem chi tiết hợp đồng thuê & Thời hạn"])
        UC_P3(["Xem lịch sử tiêu thụ điện & nước"])
        UC_P4(["Xem hóa đơn sinh hoạt định kỳ"])
        UC_P5(["Thanh toán trực tuyến quét mã VietQR"])
        UC_P6(["Gửi phản ánh sự cố & Yêu cầu sửa chữa"])
        UC_P7(["Theo dõi tiến độ thợ kỹ thuật xử lý sự cố"])
        UC_P8(["Đánh giá chất lượng sửa chữa"])
    end

    ActorTenant --> UC_P1
    ActorTenant --> UC_P2
    ActorTenant --> UC_P3
    ActorTenant --> UC_P4
    ActorTenant --> UC_P5
    ActorTenant --> UC_P6
    ActorTenant --> UC_P7
    ActorTenant --> UC_P8

    UC_P5 -.->|"<<include>>"| BankSystem
    UC_P7 -.->|"<<extend>>"| UC_P8

    classDef actorStyle fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#be185d,font-weight:bold;
    classDef bankStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
```

---

## 4. MA TRẬN PHÂN QUYỀN TÁC NHÂN - USE CASE (CRUD / TRACEABILITY MATRIX)

*Ký hiệu:*
- **C** (Create): Tạo mới
- **R** (Read): Xem, tra cứu
- **U** (Update): Sửa đổi, cập nhật
- **D** (Delete): Xóa
- **X** (Execute): Thực thi tác vụ đặc thù

| Nhóm Nghiệp Vụ / Use Case | Chủ trọ (Owner) | Quản lý (Manager) | Kỹ thuật (Technician) | Kế toán (Accountant) | Nhân sự (HR) | Người thuê (Tenant) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Quản lý Tài khoản & Phân quyền** | CRUD | R | - | - | - | - |
| **Cấu hình Đơn giá & Cài đặt hệ thống** | CRUD | R | - | R | - | - |
| **Quản lý Danh mục Phòng** | CRUD | CRUD | R | R | - | R (Xem phòng mình) |
| **Quản lý Hồ sơ Người thuê** | R | CRUD | R | R | - | U (Sửa thông tin cá nhân) |
| **Quản lý Hợp đồng thuê** | R | CRUD | - | R | - | R (Xem hợp đồng của mình) |
| **Chốt Chỉ số Điện Nước** | R | CRUD | R | R | - | R (Xem số phòng mình) |
| **Quản lý Hóa đơn & Báo giá** | R | R | - | CRUD | - | R (Xem hóa đơn mình) |
| **Thanh toán & Ghi nhận tiền** | R | - | - | CRUD | - | X (Thanh toán VietQR) |
| **Quản lý Công nợ** | R | R | - | CRUD | - | R (Xem nợ cá nhân) |
| **Gửi Yêu cầu Sửa chữa** | R | C | - | - | - | CRUD (Tạo yêu cầu cá nhân) |
| **Điều phối Sự cố cho Kỹ thuật** | R | CRUD | - | - | - | - |
| **Xử lý Sự cố & Khắc phục** | R | R | CRUD | - | - | R (Theo dõi trạng thái) |
| **Ghi nhận Vật tư & Chi phí sửa** | R | R | CRUD | R | - | - |
| **Quản lý Hồ sơ Nhân sự** | R | - | - | - | CRUD | - |
| **Phân công Ca & Chấm công** | R | R | R | - | CRUD | - |
| **Báo cáo Thống kê & Doanh thu** | CRUD | R | - | CRUD | R | - |

---

## 5. ĐẶC TẢ CHI TIẾT CÁC USE CASE CỐT LÕI (USE CASE SPECIFICATIONS)

### 5.1. Đặc tả Use Case UC-01: Chốt chỉ số điện nước & Lập hóa đơn tự động
- **Tên Use Case**: Chốt chỉ số điện nước định kỳ và tự động tạo hóa đơn tiền phòng.
- **Mã định danh**: `UC_RECORD_UTILITY_INVOICE`
- **Tác nhân chính (Primary Actor)**: Bộ phận Quản lý (Manager), Bộ phận Kế toán (Accountant).
- **Mục đích**: Ghi nhận chỉ số điện/nước hàng tháng của từng phòng, tính lượng tiêu thụ, nhân đơn giá cấu hình và tự sinh hóa đơn thanh toán cho khách.
- **Tiền điều kiện (Pre-conditions)**:
  1. Quản lý đã đăng nhập vào hệ thống với vai trò `manager` hoặc `accountant`.
  2. Phòng đang ở trạng thái `Đang thuê` và có hợp đồng còn hiệu lực.
  3. Biểu giá điện (đ/kWh), nước (đ/m3) đã được Chủ trọ cấu hình trong hệ thống.
- **Hậu điều kiện (Post-conditions)**:
  1. Bản ghi chỉ số điện nước mới được lưu vào bảng `UtilityReadings`.
  2. Hóa đơn mới được khởi tạo ở bảng `Invoices` với trạng thái `Chưa thanh toán`.
  3. Cổng khách thuê hiển thị ngay hóa đơn kèm mã VietQR tương ứng.

#### Luồng sự kiện chính (Basic Flow):
1. Quản lý chọn menu **Quản lý Điện & Nước**.
2. Hệ thống hiển thị danh sách tất cả các phòng kèm chỉ số cũ tháng trước (`PrevElectric`, `PrevWater`).
3. Quản lý chọn nút **Ghi chỉ số mới** cho phòng cần chốt (hoặc chọn chốt hàng loạt).
4. Hệ thống hiển thị biểu mẫu nhập chỉ số mới:
   - Số điện mới (kWh).
   - Số nước mới ($m^3$).
   - Tháng và Năm ghi nhận.
5. Quản lý nhập giá trị và nhấn **Lưu & Tính tiền**.
6. Hệ thống kiểm tra hợp lệ: Số mới $\ge$ Số cũ.
7. Hệ thống tự động tính:
   - Lượng tiêu thụ: $\Delta E = E_{mới} - E_{cũ}$, $\Delta W = W_{mới} - W_{cũ}$.
   - Tiền điện $= \Delta E \times$ Đơn giá điện.
   - Tiền nước $= \Delta W \times$ Đơn giá nước.
   - Tiền tổng $=$ Tiền phòng cơ bản $+$ Tiền điện $+$ Tiền nước $+$ Phí dịch vụ cố định.
8. Hệ thống tự sinh bản ghi Hóa đơn thanh toán (`Invoices`) với mã hóa đơn duy nhất (VD: `INV-202610-101`).
9. Hệ thống thông báo thành công và chuyển trạng thái hóa đơn sẵn sàng cho Kế toán đối soát.

#### Luồng sự kiện thay thế / Ngoại lệ (Alternative / Exception Flows):
- **4a. Chỉ số mới nhỏ hơn chỉ số cũ**:
  - Hệ thống báo lỗi: *"Chỉ số mới không được nhỏ hơn chỉ số kỳ trước (Cũ: X). Vui lòng kiểm tra lại đồng hồ công tơ."*
  - Yêu cầu người dùng hiệu chỉnh lại dữ liệu.
- **8a. Phòng đã được chốt chỉ số trong tháng hiện tại**:
  - Hệ thống cảnh báo: *"Phòng này đã có dữ liệu chốt tháng X/YYYY. Bạn có muốn cập nhật lại chỉ số không?"*
  - Nếu Quản lý đồng ý: Hệ thống cập nhật lại chỉ số và tính toán lại hóa đơn đã tạo.

---

### 5.2. Đặc tả Use Case UC-02: Gửi và Phân công xử lý sự cố kỹ thuật
- **Tên Use Case**: Tiếp nhận, phân công và xử lý yêu cầu sửa chữa.
- **Mã định danh**: `UC_MAINTENANCE_WORKFLOW`
- **Tác nhân tham gia**: Người thuê (Tenant), Bộ phận Quản lý (Manager), Bộ phận Kỹ thuật (Technician).
- **Mục đích**: Đảm bảo quy trình báo hỏng từ khách được điều phối nhanh chóng tới thợ kỹ thuật, có nghiệm thu và minh bạch chi phí.
- **Tiền điều kiện**: Khách thuê đã đăng nhập cổng khách thuê hoặc Quản lý ghi nhận tiếp nhận qua điện thoại.

#### Luồng sự kiện chính (Basic Flow):
1. **Khách thuê** vào cổng Tenant, chọn **Gửi yêu cầu sửa chữa**.
2. Khách điền danh mục (Điện/Nước/Điều hòa/Thiết bị), mô tả chi tiết hư hỏng, mức độ ưu tiên và gửi yêu cầu.
3. Yêu cầu hiển thị trên bảng điều khiển của **Bộ phận Quản lý** ở trạng thái `Chờ tiếp nhận`.
4. **Bộ phận Quản lý** xem chi tiết sự cố, chọn kỹ thuật viên phù hợp từ danh sách nhân sự kỹ thuật đang làm việc và nhấn **Phân công**.
5. Trạng thái sự cố đổi thành `Đã phân công`. Kỹ thuật viên được giao nhận được thông báo/thấy yêu cầu trong danh sách việc cần làm.
6. **Kỹ thuật viên** đến kiểm tra thực tế, nhấn **Bắt đầu xử lý** (trạng thái chuyển `Đang xử lý`).
7. Sau khi khắc phục xong, Kỹ thuật viên nhập:
   - Nội dung đã xử lý.
   - Vật tư/linh kiện đã thay thế.
   - Chi phí vật tư phát sinh (nếu có).
8. Kỹ thuật viên nhấn **Hoàn thành sửa chữa**.
9. Hệ thống cập nhật trạng thái sự cố thành `Hoàn thành`.
10. Khách thuê nhận thông báo hoàn tất và có thể chấm điểm đánh giá chất lượng phục vụ.

---

### 5.3. Đặc tả Use Case UC-03: Thanh toán hóa đơn qua VietQR
- **Tên Use Case**: Thanh toán tiền phòng và dịch vụ qua mã VietQR động.
- **Mã định danh**: `UC_PAY_VIETQR`
- **Tác nhân tham gia**: Người thuê (Tenant), Hệ thống Ngân hàng VietQR (Napas), Bộ phận Kế toán (Accountant).
- **Mục đích**: Cho phép khách thuê thanh toán hóa đơn tức thì 24/7 bằng bất kỳ ứng dụng ngân hàng nào qua chuẩn VietQR mà không cần nhập thủ công số tài khoản hay số tiền.

#### Luồng sự kiện chính (Basic Flow):
1. Khách thuê đăng nhập Cổng khách thuê, chọn menu **Hóa đơn & Thanh toán**.
2. Khách thuê xem hóa đơn chưa thanh toán và nhấn nút **Thanh toán VietQR**.
3. Hệ thống tạo chuỗi VietQR chuẩn EMVCo động chứa:
   - Mã định danh ngân hàng nhận (VD: MBBank - 970422).
   - Số tài khoản thụ hưởng của Chủ trọ.
   - Số tiền chính xác cần thanh toán (`TotalAmount - PaidAmount`).
   - Cú pháp nội dung chuyển khoản tự động: `THANH TOAN PHONG [SoPhong] HD [MaHoaDon]`.
4. Khách thuê mở ứng dụng Ngân hàng trên điện thoại (VCB, Techcombank, MB, Momo...), quét mã QR hiển thị trên màn hình.
5. Ứng dụng ngân hàng tự động điền đúng người nhận, số tiền và nội dung. Khách xác nhận OTP và hoàn tất chuyển khoản.
6. Hệ thống Ngân hàng xử lý giao dịch thành công.
7. Khách thuê nhấn nút **Đã chuyển khoản - Xác nhận**.
8. Kế toán kiểm tra biến động số dư tài khoản ngân hàng, nhấn **Xác nhận thanh toán** trên giao diện Kế toán.
9. Hệ thống tự động:
   - Ghi nhận một phiếu thu vào bảng `Payments`.
   - Cập nhật số tiền đã đóng (`PaidAmount`) trong hóa đơn.
   - Chuyển trạng thái hóa đơn thành `Đã thanh toán`.
   - Cập nhật công nợ phòng về mức 0 VNĐ.

---

## 6. MÃ NGUỒN PLANTUML (DÙNG CHO DRAW.IO / STARUML / PLANTTEXT)

Bạn có thể sao chép đoạn mã PlantUML dưới đây và dán trực tiếp vào [PlantText](https://www.planttext.com/) hoặc [Draw.io](https://app.diagrams.net/) (chọn *Arrange -> Insert -> Advanced -> PlantUML*) để tự động sinh file vẽ UML tiêu chuẩn:

```plantuml
@startuml QuanLyCanHoDichVu_UseCaseDiagram
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false
skinparam roundcorner 12
skinparam handwritten false
skinparam arrowColor #2563EB
skinparam actorBorderColor #1E40AF
skinparam usecaseBorderColor #1E40AF

' ================= ACTORS =================
actor "Chủ trọ\n(Owner)" as Owner
actor "Bộ phận Quản lý\n(Manager)" as Manager
actor "Bộ phận Kỹ thuật\n(Technician)" as Tech
actor "Bộ phận Kế toán\n(Accountant)" as Acc
actor "Bộ phận Nhân sự\n(HR)" as HR
actor "Người thuê\n(Tenant)" as Tenant
actor "Hệ thống VietQR\n(Napas 24/7)" as VietQR << Secondary >>

' Kế thừa Actor
actor "Nhân viên\n(Staff)" as Staff << Abstract >>
Manager -up-|> Staff
Tech -up-|> Staff
Acc -up-|> Staff
HR -up-|> Staff

' ================= SYSTEM BOUNDARY =================
rectangle "Hệ Thống Quản Lý Căn Hộ Dịch Vụ & Phòng Trọ" {

  ' Gói Phân Quyền & Hệ Thống
  package "Quản Trị & Cấu Hình" {
    usecase "UC01: Đăng nhập / Đổi mật khẩu" as UC_Login
    usecase "UC02: Quản lý tài khoản & Phân quyền" as UC_User
    usecase "UC03: Thiết lập biểu giá điện, nước, phòng" as UC_Price
    usecase "UC04: Xem báo cáo doanh thu & Hoạt động" as UC_Report
  }

  ' Gói Vận Hành Căn Hộ
  package "Vận Hành Căn Hộ" {
    usecase "UC05: Quản lý danh mục phòng & Trạng thái" as UC_Room
    usecase "UC06: Quản lý hồ sơ người thuê" as UC_Tenant
    usecase "UC07: Quản lý hợp đồng & Bàn giao phòng" as UC_Contract
    usecase "UC08: Chốt chỉ số điện & nước định kỳ" as UC_Utility
    usecase "UC09: Tiếp nhận & Điều phối sự cố" as UC_AssignTech
  }

  ' Gói Kỹ Thuật
  package "Xử Lý Sự Cố Kỹ Thuật" {
    usecase "UC10: Tiếp nhận sự cố được giao" as UC_TechJob
    usecase "UC11: Cập nhật tiến độ & Nghiệm thu" as UC_TechFix
    usecase "UC12: Ghi nhận vật tư & Chi phí sửa" as UC_TechCost
  }

  ' Gói Kế Toán
  package "Kế Toán & Doanh Thu" {
    usecase "UC13: Quản lý & Lập hóa đơn định kỳ" as UC_Invoice
    usecase "UC14: Ghi nhận thanh toán tiền mặt/chuyển khoản" as UC_Payment
    usecase "UC15: Quản lý công nợ khách thuê" as UC_Debt
    usecase "UC16: Báo cáo tài chính doanh thu" as UC_AccReport
  }

  ' Gói Nhân Sự
  package "Quản Lý Nhân Sự" {
    usecase "UC17: Quản lý hồ sơ nhân viên" as UC_Emp
    usecase "UC18: Quản lý phòng ban & Chức danh" as UC_Dept
    usecase "UC19: Điểm danh & Chấm công" as UC_Attend
    usecase "UC20: Phân công ca trực" as UC_Shift
  }

  ' Gói Khách Thuê
  package "Cổng Khách Thuê" {
    usecase "UC21: Tra cứu thông tin phòng & Hợp đồng" as UC_ClientInfo
    usecase "UC22: Thanh toán qua mã VietQR" as UC_ClientPay
    usecase "UC23: Gửi yêu cầu sửa chữa hỏng hóc" as UC_ClientReq
  }

}

' ================= LIÊN KẾT TÁC NHÂN VÀ USE CASE =================
Staff --> UC_Login
Owner --> UC_Login
Tenant --> UC_Login

Owner --> UC_User
Owner --> UC_Price
Owner --> UC_Report

Manager --> UC_Room
Manager --> UC_Tenant
Manager --> UC_Contract
Manager --> UC_Utility
Manager --> UC_AssignTech

Tech --> UC_TechJob
Tech --> UC_TechFix

Acc --> UC_Invoice
Acc --> UC_Payment
Acc --> UC_Debt
Acc --> UC_AccReport

HR --> UC_Emp
HR --> UC_Dept
HR --> UC_Attend
HR --> UC_Shift

Tenant --> UC_ClientInfo
Tenant --> UC_ClientPay
Tenant --> UC_ClientReq

' Quan hệ <<include>> và <<extend>>
UC_Invoice ..> UC_Utility : <<include>>
UC_AssignTech ..> UC_ClientReq : <<include>>
UC_TechFix <.. UC_TechCost : <<extend>>
UC_ClientPay ..> VietQR : <<include>>
UC_Payment ..> VietQR : <<include>>

@enduml
```

---
*Tài liệu được khởi tạo và đồng bộ tự động với cơ sở dữ liệu `QuanLyCanHoDichVu` và mã nguồn ứng dụng web.*
