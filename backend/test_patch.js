const { updateEstadoPedido } = require('./src/controllers/pedidos.controller');

const req = {
  params: { id: '17' },
  body: { estado: 'preparando' },
  app: { get: () => null }
};
const res = {
  json: (data) => console.log('SUCCESS:', data),
  status: (code) => ({ json: (data) => console.log('ERROR:', code, data) })
};

updateEstadoPedido(req, res).catch(console.error);
