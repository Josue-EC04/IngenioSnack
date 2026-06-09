const jwt = require('jsonwebtoken');

async function test() {
  const token = jwt.sign({ id: 1, rol: 'admin', nombre: 'Test Admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

  const res = await fetch('http://localhost:3001/api/pedidos/17/estado', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ estado: 'preparando' })
  });

  const data = await res.json();
  console.log('STATUS:', res.status);
  console.log('BODY:', data);
}

test().catch(console.error);
