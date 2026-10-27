import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { notices } from '../data';
import { getStatistics, getApiError } from '../services/api';

export default function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    getStatistics(controller.signal)
      .then(response => setStatistics(response.data))
      .catch(error => { if (!controller.signal.aborted) setError(getApiError(error)); });
    return () => controller.abort();
  }, [reload]);

  return (
    <>
      <section className="hero">
        <span className="eyebrow">CHÀO MỪNG ĐẾN VỚI KTX CAMPUS</span>
        <h1>Quản lý ký túc xá sinh viên</h1>
        <p>Tra cứu phòng ở, thông tin sinh viên và cập nhật thông báo từ ban quản lý.</p>
        <Link to="/rooms" className="button">Xem danh sách phòng</Link>
      </section>

      {error && <div className="feedback error" role="alert">{error} <button className="button secondary" onClick={() => setReload(value => value + 1)}>Thử lại</button></div>}
      {!statistics && !error && <p role="status">Đang tải thống kê...</p>}
      {statistics && <section className="stats-grid" aria-label="Thống kê ký túc xá">
        <div className="card stat"><span>Tổng số phòng</span><strong>{statistics.totalRooms}</strong></div>
        <div className="card stat"><span>Chỗ đang sử dụng</span><strong>{statistics.occupiedPlaces}</strong></div>
        <div className="card stat"><span>Phòng còn chỗ</span><strong>{statistics.availableRooms}</strong></div>
      </section>}

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
