import { notices } from '../data';

export default function Notifications() {
  return (
    <>
      <h1>Thông báo</h1>
      <p className="page-description">Cập nhật thông tin từ ban quản lý ký túc xá.</p>

      {notices.map(notice => (
        <article className="card notice-card" key={notice.id}>
          <span className="date">{notice.date}</span>
          <h2>{notice.title}</h2>
          <p>{notice.content}</p>
          <small>Ban quản lý KTX Campus</small>
        </article>
      ))}
    </>
  );
}
