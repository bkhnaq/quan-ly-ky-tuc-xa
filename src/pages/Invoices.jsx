import { invoices, formatMoney } from '../data';

export default function Invoices() {
  return (
    <>
      <h1>Hóa đơn ký túc xá</h1>
      <p className="page-description">Một số hóa đơn phòng và điện nước tháng 10/2026 — dữ liệu minh họa.</p>

      <div className="card table-container">
        <table>
          <thead>
            <tr><th>Mã hóa đơn</th><th>Phòng</th><th>Tháng</th><th>Số tiền</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.room}</td>
                <td>{invoice.month}</td>
                <td>{formatMoney(invoice.amount)}</td>
                <td><span className={`badge ${invoice.paid ? '' : 'unpaid'}`}>
                  {invoice.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
