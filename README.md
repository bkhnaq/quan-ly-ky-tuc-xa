# Website quản lý ký túc xá

Bài tập ReactJS + Vite, CSS thuần và React Router. Giao diện đơn giản, sử dụng dữ liệu mẫu, chưa có backend hoặc chức năng thêm/sửa/xóa.

## Chạy project

Cài Node.js 22.12+ hoặc 24 LTS, mở terminal tại thư mục project:

```bash
npm install
npm run dev
```

Mở **http://localhost:3000**.

Nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd install` và `npm.cmd run dev`.

## Các trang

| URL | Nội dung |
| --- | --- |
| `/` | Trang chủ |
| `/rooms` | Danh sách phòng ở |
| `/students` | Danh sách sinh viên |
| `/invoices` | Hóa đơn mẫu |
| `/notifications` | Thông báo |
| `/about-us` | Giới thiệu |

Click menu hoặc mở trực tiếp `http://localhost:3000/about-us` để chuyển trang. URL không tồn tại hiển thị trang 404.

## Các file cần hiểu

- `index.html`: trang HTML gốc.
- `src/main.jsx`: khởi tạo React, bọc ứng dụng bằng `BrowserRouter`.
- `src/App.jsx`: khai báo đường dẫn bằng `Routes` và `Route`.
- `src/components/Layout.jsx`: header, menu `NavLink`, footer và `Outlet`.
- `src/pages/`: nội dung các trang, viết HTML bằng cú pháp JSX của React.
- `src/data.js`: mảng dữ liệu mẫu; các trang dùng `.map()` để hiển thị.
- `src/styles.css`: CSS chung và định dạng trên điện thoại.

## Build

```bash
npm run build
npm run preview
```

Vite tạo bản build trong `dist/`. Khi triển khai lên hosting cần cấu hình SPA fallback về `index.html` để mở trực tiếp các URL con. Bài tập chỉ yêu cầu nộp repository, không bắt buộc triển khai website.

## Đưa lên GitHub

1. Đăng nhập tài khoản **bkhnaq**, mở <https://github.com/new>.
2. Tạo repo tên **quan-ly-ky-tuc-xa**, để trống README và `.gitignore`.
3. Nếu chưa có Git trong thư mục project, chạy:

   ```bash
   git init -b main
   git add .
   git commit -m "Tao website quan ly ky tuc xa bang React"
   ```

4. Kết nối repository và push:

   ```bash
   git remote add origin https://github.com/bkhnaq/quan-ly-ky-tuc-xa.git
   git push -u origin main
   ```

   Nếu đã có `origin`, kiểm tra bằng `git remote -v` trước khi thêm.

5. Sau khi push thành công, nộp link:

   ```text
   https://github.com/bkhnaq/quan-ly-ky-tuc-xa
   ```

Đây là địa chỉ dự kiến; repository chỉ tồn tại sau khi được tạo và push.

Tài liệu: [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/start/declarative/routing).
