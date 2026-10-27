// Các danh sách dưới đây vẫn là dữ liệu mẫu độc lập.
// Phòng ở và thống kê được lấy từ backend bằng Axios (services/api.js).

export const students = [
  { id: 'SV001', name: 'Nguyễn Minh Anh', faculty: 'Công nghệ thông tin', room: 'B101' },
  { id: 'SV002', name: 'Trần Quốc Bảo', faculty: 'Quản trị kinh doanh', room: 'A101' },
  { id: 'SV003', name: 'Lê Hoàng Nam', faculty: 'Công nghệ thông tin', room: 'A101' },
  { id: 'SV004', name: 'Phạm Ngọc Linh', faculty: 'Ngoại ngữ', room: 'B101' },
  { id: 'SV005', name: 'Võ Đức Huy', faculty: 'Kỹ thuật điện', room: 'A103' },
  { id: 'SV006', name: 'Đặng Thu Hà', faculty: 'Kinh tế', room: 'B102' },
  { id: 'SV007', name: 'Bùi Gia Hân', faculty: 'Ngoại ngữ', room: 'B101' },
  { id: 'SV008', name: 'Đỗ Tuấn Kiệt', faculty: 'Kỹ thuật điện', room: 'A103' },
  { id: 'SV009', name: 'Hồ Phương Thảo', faculty: 'Kinh tế', room: 'B102' },
  { id: 'SV010', name: 'Nguyễn Thành Đạt', faculty: 'Công nghệ thông tin', room: 'A101' },
  { id: 'SV011', name: 'Trần Khánh Vy', faculty: 'Quản trị kinh doanh', room: 'B103' },
  { id: 'SV012', name: 'Lê Minh Khang', faculty: 'Kinh tế', room: 'A102' },
  { id: 'SV013', name: 'Ngô Nhật Minh', faculty: 'Kỹ thuật điện', room: 'A102' },
  { id: 'SV014', name: 'Đinh Quốc Hưng', faculty: 'Kinh tế', room: 'A102' },
  { id: 'SV015', name: 'Vũ Hải Đăng', faculty: 'Công nghệ thông tin', room: 'A102' },
  { id: 'SV016', name: 'Phan Bảo Ngọc', faculty: 'Ngoại ngữ', room: 'B101' },
  { id: 'SV017', name: 'Lý Thanh Trúc', faculty: 'Kinh tế', room: 'B103' },
  { id: 'SV018', name: 'Mai Thùy Dương', faculty: 'Ngoại ngữ', room: 'B103' },
];

export const invoices = [
  { id: 'HD001', room: 'A101', month: '10/2026', amount: 2100000, paid: true },
  { id: 'HD002', room: 'A102', month: '10/2026', amount: 2800000, paid: false },
  { id: 'HD003', room: 'B101', month: '10/2026', amount: 2800000, paid: true },
  { id: 'HD004', room: 'B102', month: '10/2026', amount: 1400000, paid: false },
];

export const notices = [
  { id: 1, date: '20/10/2026', title: 'Thông báo thu phí ký túc xá tháng 10', content: 'Sinh viên vui lòng hoàn tất phí phòng và điện nước trước ngày 25/10/2026 tại văn phòng ban quản lý.' },
  { id: 2, date: '19/10/2026', title: 'Bảo trì hệ thống nước tòa A', content: 'Hệ thống nước tòa A tạm ngưng từ 08:00 đến 11:00 ngày 22/10/2026 để bảo trì. Sinh viên chủ động dự trữ nước sinh hoạt.' },
  { id: 3, date: '18/10/2026', title: 'Hoạt động Chủ nhật xanh', content: 'Mời sinh viên tham gia dọn vệ sinh khuôn viên lúc 07:00 ngày 25/10/2026. Tập trung tại sân chung ký túc xá.' },
];

export function formatMoney(amount) {
  return amount.toLocaleString('vi-VN') + ' đ';
}
