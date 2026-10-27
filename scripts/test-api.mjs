import assert from 'node:assert/strict';

const baseUrl = process.env.API_URL || 'http://localhost:5000/api';
async function request(path, method = 'GET', body) {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10000),
  });
}

const initial = await request('/rooms');
assert.equal(initial.status, 200, 'GET rooms');
const rooms = await initial.json();
const id = Array.from({ length: 100 }, (_, i) => `Z${900 + i}`)
  .find(candidate => !rooms.some(room => room.id === candidate));
assert.ok(id, 'Cần một mã phòng Z900–Z999 chưa dùng để kiểm tra');
const room = { id, building: 'Z', capacity: 4, occupied: 0, price: 650000 };
let created = false;

try {
  assert.equal((await request(`/rooms/${id}`)).status, 404);
  assert.equal((await request(`/rooms/${id}`, 'PUT', room)).status, 404);
  assert.equal((await request(`/rooms/${id}`, 'DELETE')).status, 404);
  assert.equal((await request('/rooms', 'POST', { ...room, occupied: 5 })).status, 400);
  assert.equal((await request('/rooms', 'POST', { ...room, price: -1 })).status, 400);
  assert.equal((await request('/rooms', 'POST', { ...room, capacity: 1.5 })).status, 400);
  assert.equal((await request('/rooms', 'POST', { ...room, building: 'A' })).status, 400);
  assert.equal((await request('/rooms', 'POST', {})).status, 400);

  const added = await request('/rooms', 'POST', room);
  assert.equal(added.status, 201);
  created = true;
  assert.ok(added.headers.get('location').endsWith(`/api/rooms/${id}`));
  assert.deepEqual(await added.json(), room);
  assert.equal((await request('/rooms', 'POST', { ...room, id: id.toLowerCase() })).status, 409);
  assert.deepEqual(await (await request(`/rooms/${id.toLowerCase()}`)).json(), room);

  const updated = { ...room, capacity: 6, occupied: 2, price: 700000 };
  assert.equal((await request(`/rooms/${id}`, 'PUT', updated)).status, 204);
  assert.deepEqual(await (await request(`/rooms/${id}`)).json(), updated);
  assert.equal((await request(`/rooms/${id}`, 'PUT', { ...updated, id: 'Y999', building: 'Y' })).status, 400);
  assert.equal((await request(`/rooms/${id}`, 'DELETE')).status, 409);
  assert.deepEqual(await (await request(`/rooms/${id}`)).json(), updated);

  const stats = await (await request('/statistics')).json();
  const currentRooms = await (await request('/rooms')).json();
  assert.equal(stats.totalRooms, currentRooms.length);
  assert.equal(stats.occupiedPlaces, currentRooms.reduce((sum, item) => sum + item.occupied, 0));
  assert.equal(stats.availableRooms, currentRooms.filter(item => item.occupied < item.capacity).length);

  const cors = await fetch(`${baseUrl}/rooms`, { method: 'OPTIONS', headers: {
    Origin: 'http://localhost:3000',
    'Access-Control-Request-Method': 'PUT',
    'Access-Control-Request-Headers': 'content-type',
  } });
  assert.equal(cors.status, 204);
  assert.equal(cors.headers.get('access-control-allow-origin'), 'http://localhost:3000');

  assert.equal((await request(`/rooms/${id}`, 'PUT', { ...updated, occupied: 0 })).status, 204);
  assert.equal((await request(`/rooms/${id}`, 'DELETE')).status, 204);
  created = false;
  assert.equal((await request(`/rooms/${id}`)).status, 404);
  console.log('PASS: GET, POST, PUT, DELETE, validation, duplicate IDs, occupied-room protection, statistics, CORS.');
} finally {
  if (created) {
    await request(`/rooms/${id}`, 'PUT', room);
    const removed = await request(`/rooms/${id}`, 'DELETE');
    assert.equal(removed.status, 204, `Không dọn được phòng thử nghiệm ${id}`);
  }
}
