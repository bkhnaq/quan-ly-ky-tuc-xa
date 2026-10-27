export default function About() {
  return (
    <>
      <h1>Giới thiệu</h1>
      <p className="page-description">Đề tài: Website quản lý ký túc xá sinh viên.</p>

      <section className="card about-content">
        <h2>Mục đích của website</h2>
        <p>Website được xây dựng để giới thiệu ký túc xá và hiển thị thông tin phòng ở, sinh viên, hóa đơn, thông báo trong cùng một hệ thống.</p>

        <h2>Các trang chính</h2>
        <ul>
          <li>Trang chủ: giới thiệu, thống kê và thông báo mới.</li>
          <li>Phòng ở: danh sách phòng và tình trạng còn chỗ.</li>
          <li>Sinh viên: danh sách sinh viên nội trú.</li>
          <li>Hóa đơn: thông tin phí phòng và điện nước.</li>
          <li>Thông báo: các thông tin từ ban quản lý.</li>
        </ul>

        <h2>Công nghệ sử dụng</h2>
        <p>ReactJS để xây dựng giao diện, Vite để chạy project, CSS để định dạng và React Router để chuyển trang bằng menu hoặc URL.</p>
        <p>Backend sử dụng ASP.NET Core Web API và EF Core để lưu phòng ở trong SQLite. Frontend gửi yêu cầu GET, POST, PUT, DELETE bằng Axios.</p>
        <p className="demo-note">Phòng ở hỗ trợ thêm, sửa, xóa và lưu dữ liệu. Các trang sinh viên, hóa đơn, thông báo vẫn là dữ liệu mẫu độc lập. Website phục vụ học tập, chưa có đăng nhập hoặc thanh toán thực tế.</p>
      </section>
    </>
  );
}
