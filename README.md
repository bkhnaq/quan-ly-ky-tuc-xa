# KTX Campus — Website quản lý ký túc xá

Đồ án website quản lý ký túc xá sinh viên. Frontend React kết nối backend ASP.NET Core bằng Axios; module phòng ở hỗ trợ thêm, xem, sửa, xóa và lưu dữ liệu trong SQLite.

## Công nghệ sử dụng

- ReactJS: xây dựng giao diện theo component.
- Vite: chạy môi trường phát triển và build project.
- React Router: điều hướng giữa các trang.
- CSS thuần: định dạng giao diện và bố cục trên điện thoại.
- Axios: gửi request GET, POST, PUT, DELETE từ frontend.
- ASP.NET Core 10 Web API: xử lý request bằng controllers.
- EF Core 10 và SQLite: truy cập database, quản lý schema bằng migration.

## Các trang

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ, thống kê tổng quan và thông báo mới |
| `/rooms` | Danh sách phòng, thêm/sửa/xóa phòng và tình trạng còn chỗ |
| `/students` | Danh sách sinh viên nội trú |
| `/invoices` | Thông tin hóa đơn và trạng thái thanh toán |
| `/notifications` | Thông báo từ ban quản lý |
| `/about-us` | Giới thiệu website |

Website hỗ trợ chuyển trang bằng menu hoặc truy cập trực tiếp qua URL. Đường dẫn không tồn tại hiển thị trang 404.

## Cài đặt và chạy

Yêu cầu **Node.js 22.12+ hoặc 24 LTS** và **.NET 10 SDK**. Mở hai terminal tại thư mục gốc project.

Terminal 1 — backend và database:

```bash
dotnet restore backend/Ktx.Api
dotnet tool restore
dotnet ef database update --project backend/Ktx.Api
dotnet run --project backend/Ktx.Api
```

API chạy ở `http://localhost:5000/api/rooms`. Migration tạo database và 6 phòng mẫu ở lần đầu; dữ liệu được giữ khi khởi động lại.

Mở **http://localhost:5000/swagger** để xem toàn bộ API và thử request bằng **Try it out → Execute** (môi trường Development).

Terminal 2 — frontend:

```bash
npm install
npm run dev
```

Truy cập **http://localhost:3000**, mở **Phòng ở** để thử thêm, sửa và xóa. Nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd` thay `npm`.

Chỉ xóa được phòng có số người đang ở bằng 0. Khi API chưa chạy, frontend hiển thị thông báo lỗi kết nối. Địa chỉ API có thể cấu hình qua `.env` theo `.env.example`.

Build và xem trước bản production:

```bash
npm run build
npm run preview
```

## API và database

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| GET | `/api/rooms` | Lấy danh sách phòng |
| GET | `/api/rooms/{id}` | Lấy chi tiết phòng |
| POST | `/api/rooms` | Thêm phòng |
| PUT | `/api/rooms/{id}` | Sửa phòng |
| DELETE | `/api/rooms/{id}` | Xóa phòng trống |
| GET | `/api/statistics` | Thống kê trang chủ |

Chi tiết cấu hình kết nối database, cài EF Core, tạo migration và các request mẫu: **[Tài liệu backend](backend/README.md)**.

## Cấu trúc project

```text
backend/Ktx.Api/
├── Controllers/         # RoomsController, StatisticsController
├── Contracts/           # DTO và validation
├── Models/              # Model Room
├── Data/                # KtxDbContext
├── Migrations/          # Migration InitialCreate và snapshot
├── appsettings.json     # Chuỗi kết nối SQLite, CORS
└── Program.cs           # Cấu hình API, EF Core và CORS
src/
├── components/          # Layout dùng chung
├── pages/               # Nội dung các trang
├── services/api.js      # Các request Axios
├── App.jsx              # React Router
├── main.jsx             # Khởi tạo frontend
├── data.js              # Dữ liệu mẫu cho các module chưa nối API
└── styles.css           # CSS
scripts/test-api.mjs     # Kiểm tra CRUD và validation
```

## Kiểm tra

Khi backend đang chạy:

```bash
npm run test:api
```

Script kiểm tra CRUD, validation, mã trùng, chặn xóa phòng có người ở, thống kê và CORS; tự dọn phòng thử nghiệm. Build backend bằng `dotnet build backend/Ktx.Api`.

## Phạm vi

Module phòng ở và thống kê đã dùng API/database. Số người ở phòng được nhập thủ công; danh sách sinh viên, hóa đơn, thông báo vẫn là dữ liệu mẫu độc lập. Project phục vụ học tập tại máy, chưa có đăng nhập/phân quyền hoặc thanh toán thực tế.
