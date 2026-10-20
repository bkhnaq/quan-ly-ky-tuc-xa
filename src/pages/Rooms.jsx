import { rooms, formatMoney } from '../data';

export default function Rooms() {
  return (
    <>
      <h1>Danh sách phòng ở</h1>
      <p className="page-description">Thông tin phòng, số người đang ở và giá phòng theo tháng.</p>

      <div className="room-grid">
        {rooms.map(room => (
          <article className="card room-card" key={room.id}>
            <span className="eyebrow">TÒA {room.building}</span>
            <h2>Phòng {room.id}</h2>
            <p>Số người: {room.occupied}/{room.capacity}</p>
            <p>Giá phòng: <strong>{formatMoney(room.price)}</strong>/người/tháng</p>
            <span className={`badge ${room.occupied < room.capacity ? '' : 'full'}`}>
              {room.occupied < room.capacity ? 'Còn chỗ' : 'Đã đầy'}
            </span>
          </article>
        ))}
      </div>
    </>
  );
}
