# KTX Campus — Website quản lý ký túc xá

Đồ án giao diện website quản lý ký túc xá sinh viên, hỗ trợ xem thông tin phòng ở, danh sách sinh viên, hóa đơn và thông báo từ ban quản lý.

## Công nghệ sử dụng

- ReactJS: xây dựng giao diện theo component.
- Vite: chạy môi trường phát triển và build project.
- React Router: điều hướng giữa các trang.
- CSS thuần: định dạng giao diện và bố cục trên điện thoại.

## Các trang

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ, thống kê tổng quan và thông báo mới |
| `/rooms` | Danh sách phòng, sức chứa, giá phòng và tình trạng còn chỗ |
| `/students` | Danh sách sinh viên nội trú |
| `/invoices` | Thông tin hóa đơn và trạng thái thanh toán |
| `/notifications` | Thông báo từ ban quản lý |
| `/about-us` | Giới thiệu website |

Website hỗ trợ chuyển trang bằng menu hoặc truy cập trực tiếp qua URL. Đường dẫn không tồn tại hiển thị trang 404.

## Cài đặt và chạy

Yêu cầu Node.js 22.12+ hoặc 24 LTS.

```bash
git clone https://github.com/bkhnaq/quan-ly-ky-tuc-xa.git
cd quan-ly-ky-tuc-xa
npm install
npm run dev
```

Truy cập **http://localhost:3000**.

Build và xem trước bản production:

```bash
npm run build
npm run preview
```

## Cấu trúc project

```text
src/
├── components/
│   └── Layout.jsx       # Header, menu và footer dùng chung
├── pages/
│   ├── Dashboard.jsx    # Trang chủ
│   ├── Rooms.jsx        # Phòng ở
│   ├── Students.jsx     # Sinh viên
│   ├── Invoices.jsx     # Hóa đơn
│   ├── Notifications.jsx
│   └── About.jsx
├── App.jsx              # Khai báo các route
├── main.jsx             # Khởi tạo ứng dụng
├── data.js              # Dữ liệu mẫu
└── styles.css           # Định dạng giao diện
```

## Phạm vi

Phiên bản hiện tại phục vụ bài tập giao diện, sử dụng dữ liệu mẫu tĩnh. Website chưa kết nối cơ sở dữ liệu, chưa có đăng nhập, thêm/sửa/xóa dữ liệu hoặc thanh toán thực tế.
