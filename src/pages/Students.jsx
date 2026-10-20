import { students } from '../data';

export default function Students() {
  return (
    <>
      <h1>Danh sách sinh viên</h1>
      <p className="page-description">Danh sách sinh viên đang ở tại ký túc xá — dữ liệu mẫu.</p>

      <div className="card table-container">
        <table>
          <thead>
            <tr><th>Mã sinh viên</th><th>Họ và tên</th><th>Khoa / Ngành</th><th>Phòng</th></tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.faculty}</td>
                <td>{student.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
