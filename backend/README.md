# KTX API — ASP.NET Core và EF Core

API quản lý phòng ở, viết bằng ASP.NET Core 10 theo mô hình controller. EF Core ánh xạ model `Room` sang bảng `Rooms` trong SQLite.

## Chạy backend

Yêu cầu **.NET 10 SDK**. Chạy từ thư mục gốc repository:

```bash
dotnet restore backend/Ktx.Api
dotnet tool restore
dotnet ef database update --project backend/Ktx.Api
dotnet run --project backend/Ktx.Api
```

Backend chạy tại `http://localhost:5000`. Mở `http://localhost:5000/api/rooms` để xem JSON. Đường dẫn `/` không có trang HTML.

## Swagger UI — xem và thử API

Sau khi chạy backend, mở **http://localhost:5000/swagger**. Swagger UI hiển thị các endpoint theo nhóm `Rooms` và `Statistics`.

1. Chọn endpoint cần thử, ví dụ `GET /api/rooms`.
2. Bấm **Try it out**.
3. Nhập `id` hoặc request body nếu endpoint yêu cầu.
4. Bấm **Execute**, xem mã trạng thái và JSON trong **Server response**.

Với POST/PUT, thay body mẫu bằng dữ liệu hợp lệ như ví dụ bên dưới. Các thao tác ghi sẽ thay đổi database đang dùng. Swagger được bật trong môi trường **Development**, là môi trường mặc định khi chạy `dotnet run --project backend/Ktx.Api` với launch profile có sẵn.

Tài liệu OpenAPI dạng JSON: `http://localhost:5000/swagger/v1/swagger.json`.

`database update` áp dụng migration đã có trong repository, tạo database `backend/Ktx.Api/App_Data/ktx.db` và 6 phòng mẫu. Không cần cài SQL Server. Dữ liệu thay đổi vẫn được giữ khi tắt backend. File database không được đưa lên Git; người clone project tạo lại database bằng migration.

## Endpoint

| Method | URL | Kết quả thành công |
| --- | --- | --- |
| GET | `/api/rooms` | 200, danh sách phòng |
| GET | `/api/rooms/{id}` | 200, một phòng |
| POST | `/api/rooms` | 201, phòng vừa tạo và header Location |
| PUT | `/api/rooms/{id}` | 204, cập nhật phòng |
| DELETE | `/api/rooms/{id}` | 204, xóa phòng trống |
| GET | `/api/statistics` | 200, tổng số phòng, chỗ đang sử dụng và phòng còn chỗ |

Body dùng cho POST và PUT:

```json
{
  "id": "C101",
  "building": "C",
  "capacity": 4,
  "occupied": 0,
  "price": 650000
}
```

- `400 Bad Request`: dữ liệu thiếu/sai, số người vượt sức chứa, mã phòng không khớp tòa nhà, đổi mã khi PUT.
- `404 Not Found`: không tìm thấy phòng.
- `409 Conflict`: mã phòng trùng hoặc xóa phòng có người ở.
- Mã phòng gồm một chữ cái và ba chữ số; được chuẩn hóa thành chữ hoa. Giá là số nguyên VND.

Các request mẫu nằm trong `Ktx.Api/Ktx.Api.http`, có thể chạy bằng REST Client hỗ trợ file `.http` hoặc nhập tương đương vào Postman.

## Cấu hình kết nối database

Trong `Ktx.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=App_Data/ktx.db"
  }
}
```

`Program.cs` đọc chuỗi kết nối bằng `GetConnectionString("DefaultConnection")`, chuẩn hóa đường dẫn theo thư mục backend và đăng ký:

```csharp
builder.Services.AddDbContext<KtxDbContext>(options =>
    options.UseSqlite(connection.ToString()));
```

`KtxDbContext` có `DbSet<Room> Rooms` đại diện cho bảng phòng. Controller nhận DbContext bằng dependency injection, dùng `ToListAsync`, `FindAsync`, `Add`, `Remove`, `SaveChangesAsync` để đọc và ghi dữ liệu.

Muốn dùng SQL Server cần đổi provider sang `Microsoft.EntityFrameworkCore.SqlServer`, đổi `UseSqlite` thành `UseSqlServer`, cấu hình chuỗi kết nối SQL Server và tạo bộ migration phù hợp. Chỉ thay chuỗi kết nối là chưa đủ vì migration hiện tại dành cho SQLite.

## Cài EF Core và tạo migration

Các package đã khai báo trong `Ktx.Api.csproj`; người clone chỉ cần `dotnet restore`. Các lệnh tương ứng khi thiết lập project ban đầu là:

```bash
dotnet add backend/Ktx.Api package Microsoft.EntityFrameworkCore.Sqlite --version 10.0.10
dotnet add backend/Ktx.Api package Microsoft.EntityFrameworkCore.Design --version 10.0.10
dotnet add backend/Ktx.Api package SQLitePCLRaw.bundle_e_sqlite3 --version 3.0.5
dotnet tool restore
```

Provider SQLite phục vụ truy cập dữ liệu; package Design hỗ trợ tạo migration. Bundle SQLite được nâng phiên bản để tránh phụ thuộc native cũ bị cảnh báo khi restore. Công cụ `dotnet-ef` được cố định trong `.config/dotnet-tools.json`, không cần cài global.

Migration là mã C# mô tả thay đổi cấu trúc database. Project đã tạo migration đầu tiên bằng:

```bash
dotnet ef migrations add InitialCreate --project backend/Ktx.Api
dotnet ef database update --project backend/Ktx.Api
```

**Không chạy lại `migrations add InitialCreate` khi clone**, vì migration này đã tồn tại. Sau khi chỉnh model, tạo migration có tên mới rồi áp dụng, ví dụ:

```bash
dotnet ef migrations add AddRoomDescription --project backend/Ktx.Api
dotnet ef database update --project backend/Ktx.Api
```

Chỉ dùng ví dụ này sau khi đã thêm thuộc tính tương ứng vào model. Kiểm tra lịch sử và model bằng:

```bash
dotnet ef migrations list --project backend/Ktx.Api
dotnet ef migrations has-pending-model-changes --project backend/Ktx.Api
```

Trong thư mục `Migrations`, `Up` áp dụng thay đổi, `Down` hoàn tác; snapshot giúp EF so sánh model khi tạo migration tiếp theo. Project áp dụng migration bằng CLI, không tự cập nhật schema lúc chạy API.

## Axios và CORS

Frontend gọi API tại `src/services/api.js`:

```js
api.get('/rooms');
api.get('/rooms/A101');
api.post('/rooms', room);
api.put('/rooms/A101', room);
api.delete('/rooms/A101');
```

`src/pages/Rooms.jsx` gọi các hàm này trong `useEffect` và các sự kiện submit/sửa/xóa, sau đó cập nhật giao diện. Trang chủ gọi `GET /api/statistics`.

Vì frontend và backend khác cổng, `Program.cs` đăng ký CORS cho `http://localhost:3000` và `http://127.0.0.1:3000`. Khi đổi cổng frontend, cập nhật `AllowedOrigins`. Có thể đổi địa chỉ API qua `.env` của frontend theo `.env.example`, rồi khởi động lại Vite.

## Kiểm tra API

Khi backend đang chạy, mở terminal khác ở thư mục gốc:

```bash
npm run test:api
```

Script tạo phòng thử nghiệm chưa tồn tại, kiểm tra CRUD, validation, thống kê và xóa dữ liệu thử trong khối `finally`.

## Phạm vi

Module phòng ở và thống kê dùng database. Số người ở phòng được nhập thủ công; chưa có liên kết với danh sách sinh viên mẫu. Các module sinh viên, hóa đơn, thông báo vẫn là dữ liệu tĩnh ở frontend. API phục vụ học tập tại máy, chưa có đăng nhập/phân quyền.

Tài liệu tham khảo: [ASP.NET Core Web API](https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-10.0), [EF Core với SQLite](https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app?tabs=netcore-cli), [EF Core migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/), [Axios](https://axios-http.com/docs/api_intro).
