# KTX Campus — Website quản lý ký túc xá

Đồ án website quản lý ký túc xá sinh viên. Frontend React kết nối backend ASP.NET Core bằng Axios; hỗ trợ đăng ký/đăng nhập và quản lý phòng ở, lưu dữ liệu trong SQLite.

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
| `/register` | Đăng ký bằng email và mật khẩu |
| `/login` | Đăng nhập |
| `/account` | Thông tin tài khoản đang đăng nhập |
| `/` | Trang chủ, thống kê tổng quan và thông báo mới |
| `/rooms` | Danh sách phòng, thêm/sửa/xóa phòng và tình trạng còn chỗ |
| `/students` | Danh sách sinh viên nội trú |
| `/invoices` | Thông tin hóa đơn và trạng thái thanh toán |
| `/notifications` | Thông báo từ ban quản lý |
| `/about-us` | Giới thiệu website |

Website hỗ trợ chuyển trang bằng menu hoặc URL. Trang chủ, phòng ở, sinh viên, hóa đơn và tài khoản yêu cầu đăng nhập; thông báo và giới thiệu xem được công khai. Đường dẫn không tồn tại hiển thị trang 404.

## Cài đặt và chạy

Yêu cầu **Node.js 22.12+ hoặc 24 LTS** và **.NET 10 SDK**. Mở hai terminal tại thư mục gốc project.

Terminal 1 — backend và database:

```bash
dotnet restore backend/Ktx.Api
dotnet tool restore
dotnet ef database update --project backend/Ktx.Api
dotnet run --project backend/Ktx.Api
```

API chạy ở `http://localhost:5000`. Migration tạo database, bảng `Rooms` và `Users`, cùng 6 phòng mẫu ở lần đầu. Nếu đã chạy phiên bản cũ, chạy lại `database update` để thêm bảng `Users`; dữ liệu phòng được giữ nguyên.

Mở **http://localhost:5000/swagger** để xem toàn bộ API và thử request bằng **Try it out → Execute** (môi trường Development).

Terminal 2 — frontend:

```bash
npm install
npm run dev
```

Truy cập **http://localhost:3000/register**, tạo tài khoản rồi đăng nhập. Mở **Phòng ở** để thử thêm, sửa và xóa. Nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd` thay `npm`.

Chỉ xóa được phòng có số người đang ở bằng 0. Khi API chưa chạy, frontend hiển thị thông báo lỗi kết nối. Địa chỉ API có thể cấu hình qua `.env` theo `.env.example`.

## Đăng ký và đăng nhập

1. Nhập email, mật khẩu và nhập lại mật khẩu tại `/register`.
2. React và API kiểm tra email hợp lệ; mật khẩu 8–128 ký tự có ít nhất một chữ cái và một chữ số. Email trùng không phân biệt chữ hoa/thường sẽ bị từ chối.
3. Backend dùng `PasswordHasher` để hash mật khẩu rồi lưu tài khoản vào bảng `Users`.
4. Khi đăng nhập, backend truy vấn theo email đã chuẩn hóa và gọi `VerifyHashedPassword` để kiểm tra mật khẩu.
5. Đăng nhập đúng: API tạo cookie HttpOnly có thời hạn 8 giờ; `AuthContext` giữ thông tin user và lưu `{ id, email, createdAt }` vào localStorage với key `ktx-user`.
6. Tải lại trang: Context gọi `/api/auth/me` để xác thực lại. Chỉnh sửa localStorage không thể vượt qua xác thực API. Đăng xuất xóa cookie, Context và cache localStorage; các tab cùng origin cập nhật theo sự kiện `storage`.

**Không lưu mật khẩu/hash/token trong localStorage.** Cookie xác thực do trình duyệt gửi tự động qua Axios `withCredentials`. Nếu localStorage bị chặn, Context vẫn hoạt động và khôi phục user bằng cookie.

Mặc định API dùng cùng hostname với frontend (localhost hoặc 127.0.0.1), cổng 5000. Nếu cấu hình `.env`, giữ cùng hostname vì cookie dùng `SameSite=Strict`. Khi phiên hết hạn hoặc API trả 401, trang quản lý yêu cầu đăng nhập lại.

Build và xem trước bản production:

```bash
npm run build
npm run preview
```

## API và database

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| POST | `/api/auth/register` | Tạo tài khoản |
| POST | `/api/auth/login` | Kiểm tra tài khoản, tạo cookie phiên |
| GET | `/api/auth/me` | Lấy user hiện tại (cần đăng nhập) |
| POST | `/api/auth/logout` | Xóa cookie phiên |
| GET | `/api/rooms` | Lấy danh sách phòng |
| GET | `/api/rooms/{id}` | Lấy chi tiết phòng |
| POST | `/api/rooms` | Thêm phòng |
| PUT | `/api/rooms/{id}` | Sửa phòng |
| DELETE | `/api/rooms/{id}` | Xóa phòng trống |
| GET | `/api/statistics` | Thống kê trang chủ |

API phòng và thống kê có `[Authorize]`, trả 401 nếu chưa đăng nhập. Trong Swagger, chạy `POST /api/auth/login` trước; trình duyệt sẽ gửi cookie cho các request tiếp theo.

Chi tiết cấu hình kết nối database, cài EF Core, tạo migration và các request mẫu: **[Tài liệu backend](backend/README.md)**.

## Cấu trúc project

```text
backend/Ktx.Api/
├── Controllers/         # AuthController, RoomsController, StatisticsController
├── Contracts/           # DTO và validation
├── Models/              # Room, AppUser
├── Data/                # KtxDbContext
├── Migrations/          # InitialCreate, AddUsers và snapshot
├── appsettings.json     # Chuỗi kết nối SQLite, CORS
└── Program.cs           # Cấu hình API, EF Core và CORS
src/
├── components/          # Layout dùng chung
├── context/AuthContext.jsx # User, khôi phục phiên và localStorage
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

Script kiểm tra đăng ký, đăng nhập, validation, cookie/401, CRUD, thống kê, CORS và đăng xuất. Mỗi lần chạy tạo một tài khoản có email ngẫu nhiên thuộc `example.test`, giữ lại tài khoản test và tự dọn phòng thử nghiệm. Nên chạy trên database thử riêng. Build backend bằng `dotnet build backend/Ktx.Api`.

## Phạm vi

Tài khoản, phòng ở và thống kê dùng API/database. Số người ở phòng được nhập thủ công; sinh viên, hóa đơn, thông báo vẫn là dữ liệu mẫu. Mọi tài khoản đã đăng nhập có cùng quyền quản lý phòng trong bản bài tập này. Chưa có phân quyền vai trò, xác minh email, quên mật khẩu, giới hạn lần đăng nhập sai hoặc thanh toán thực tế. Khi triển khai thực tế cần HTTPS và bổ sung các cơ chế này.
