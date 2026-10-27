import { useEffect, useState } from 'react';
import { formatMoney } from '../data';
import { roomApi, getApiError } from '../services/api';

const emptyForm = { id: '', building: 'A', capacity: 4, occupied: 0, price: 650000 };

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [reload, setReload] = useState(0);

  // GET: tải danh sách phòng từ database qua API.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    roomApi.getAll(controller.signal)
      .then(response => setRooms(response.data))
      .catch(error => { if (!controller.signal.aborted) setError(getApiError(error)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [reload]);

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const room = {
      id: form.id.trim().toUpperCase(),
      building: form.building.trim().toUpperCase(),
      capacity: Number(form.capacity),
      occupied: Number(form.occupied),
      price: Number(form.price),
    };
    setError('');
    setMessage('');
    if (room.occupied > room.capacity) {
      setError('Số người đang ở không được vượt sức chứa.');
      return;
    }

    setBusy(true);
    try {
      if (editingId) {
        // PUT: cập nhật phòng đã có.
        await roomApi.update(editingId, room);
        setRooms(current => current.map(item => item.id === editingId ? room : item));
        setMessage(`Đã cập nhật phòng ${room.id}.`);
      } else {
        // POST: tạo phòng mới.
        const response = await roomApi.create(room);
        setRooms(current => [...current, response.data].sort((a, b) => a.id.localeCompare(b.id)));
        setMessage(`Đã thêm phòng ${room.id}.`);
      }
      resetForm();
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleEdit(id) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await roomApi.getById(id);
      setForm(response.data);
      setEditingId(id);
      document.getElementById('room-form').scrollIntoView({ block: 'start' });
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Bạn có chắc muốn xóa phòng ${id}?`)) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      // DELETE: xóa phòng trong database.
      await roomApi.remove(id);
      setRooms(current => current.filter(room => room.id !== id));
      if (editingId === id) resetForm();
      setMessage(`Đã xóa phòng ${id}.`);
    } catch (error) {
      setError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1>Danh sách phòng ở</h1>
      <p className="page-description">Thêm, sửa, xóa phòng ở. Thông tin được lưu vào cơ sở dữ liệu.</p>

      <form className="card room-form" id="room-form" onSubmit={handleSubmit}>
        <h2>{editingId ? `Sửa phòng ${editingId}` : 'Thêm phòng mới'}</h2>
        <fieldset disabled={busy || loading}>
          <div className="form-grid">
            <label>Mã phòng
              <input name="id" value={form.id} onChange={changeField} placeholder="A104" pattern="[A-Za-z][0-9]{3}" title="Một chữ cái và ba chữ số, ví dụ A104" maxLength={4} required readOnly={Boolean(editingId)} />
            </label>
            <label>Tòa nhà
              <input name="building" value={form.building} onChange={changeField} pattern="[A-Za-z]" title="Một chữ cái, ví dụ A" maxLength={1} required />
            </label>
            <label>Sức chứa
              <input name="capacity" type="number" min="1" max="20" step="1" value={form.capacity} onChange={changeField} required />
            </label>
            <label>Số người đang ở
              <input name="occupied" type="number" min="0" max={form.capacity || 20} step="1" value={form.occupied} onChange={changeField} required />
            </label>
            <label>Giá phòng (đ/người/tháng)
              <input name="price" type="number" min="0" max="100000000" step="1" value={form.price} onChange={changeField} required />
            </label>
          </div>
          <div className="form-actions">
            <button className="button" type="submit">{busy ? 'Đang xử lý...' : editingId ? 'Lưu thay đổi' : 'Thêm phòng'}</button>
            {editingId && <button className="button secondary" type="button" onClick={resetForm}>Hủy sửa</button>}
          </div>
        </fieldset>
      </form>

      {error && <p className="feedback error" role="alert">{error}</p>}
      {message && <p className="feedback success" role="status">{message}</p>}
      <div className="section-heading room-list-heading">
        <h2>Các phòng hiện có</h2>
        <button className="button secondary" disabled={loading || busy} onClick={() => setReload(value => value + 1)}>Tải lại danh sách</button>
      </div>
      {loading ? <p role="status">Đang tải danh sách phòng...</p> : (
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
              <div className="form-actions">
                <button className="button secondary" disabled={busy} onClick={() => handleEdit(room.id)}>Sửa</button>
                <button className="button danger" disabled={busy} onClick={() => handleDelete(room.id)}>Xóa</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {!loading && !error && rooms.length === 0 && <p>Chưa có phòng nào. Hãy thêm phòng đầu tiên.</p>}
      <p className="page-description">Chỉ xóa được phòng chưa có người ở. Số người đang ở được nhập thủ công, chưa liên kết với danh sách sinh viên mẫu.</p>
    </>
  );
}
