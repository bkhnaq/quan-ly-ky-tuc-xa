import { Link } from 'react-router';
import { rooms, students, notices } from '../data';

export default function Dashboard() {
  const availableRooms = rooms.filter(room => room.occupied < room.capacity).length;

  return (
    <>
      <section className="hero">
        <span className="eyebrow">CHÀO MỪNG ĐẾN VỚI KTX CAMPUS</span>
        <h1>Quản lý ký túc xá sinh viên</h1>
        <p>Tra cứu phòng ở, thông tin sinh viên và cập nhật thông báo từ ban quản lý.</p>
        <Link to="/rooms" className="button">Xem danh sách phòng</Link>
      </section>

      <section className="stats-grid" aria-label="Thống kê ký túc xá">
        <div className="card stat"><span>Tổng số phòng</span><strong>{rooms.length}</strong></div>
        <div className="card stat"><span>Sinh viên nội trú</span><strong>{students.length}</strong></div>
        <div className="card stat"><span>Phòng còn chỗ</span><strong>{availableRooms}</strong></div>
      </section>

      <section className="card">
        <div className="section-heading">
          <h2>Thông báo mới</h2>
          <Link to="/notifications">Xem tất cả →</Link>
        </div>
        {notices.slice(0, 2).map(notice => (
          <article className="notice" key={notice.id}>
            <span className="date">{notice.date}</span>
            <h3>{notice.title}</h3>
            <p>{notice.content}</p>
          </article>
        ))}
      </section>

      <section className="card intro">
        <h2>Về ký túc xá</h2>
        <p>KTX Campus mang đến không gian sinh hoạt thuận tiện cho sinh viên. Website hỗ trợ theo dõi thông tin nội trú và các hoạt động tại ký túc xá.</p>
        <Link to="/about-us">Tìm hiểu thêm →</Link>
      </section>
    </>
  );
}
