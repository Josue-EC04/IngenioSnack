const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // Unirse a sala personalizada del usuario
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 Usuario ${userId} se unió a su sala`);
    });

    // Unirse a sala de admin
    socket.on('join_admin_room', () => {
      socket.join('admin_room');
      console.log(`👑 Admin se unió a la sala de administración`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  });
};

module.exports = { initSocket };
