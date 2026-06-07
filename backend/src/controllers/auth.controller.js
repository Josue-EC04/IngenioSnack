const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
  const { nombre, correo, codigo_estudiante, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos' });
  }

  // Validar que sea correo institucional UNCP
  // Permitir también correos normales para facilidad de prueba
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ error: 'Correo electrónico inválido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Verificar si el correo ya existe
    const existingUser = await prisma.user.findUnique({ where: { correo } });
    if (existingUser) {
      return res.status(409).json({ error: 'Este correo ya está registrado' });
    }

    // Verificar código de estudiante si fue proporcionado
    if (codigo_estudiante) {
      const existingCodigo = await prisma.user.findUnique({ where: { codigo_estudiante } });
      if (existingCodigo) {
        return res.status(409).json({ error: 'Este código de estudiante ya está registrado' });
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombre,
        correo,
        codigo_estudiante: codigo_estudiante || null,
        password_hash,
        rol: 'estudiante',
      },
    });

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registro exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        codigo_estudiante: user.codigo_estudiante,
        rol: user.rol,
        puntos_fidelidad: user.puntos_fidelidad,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { correo } });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const passwordValida = await bcrypt.compare(password, user.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        codigo_estudiante: user.codigo_estudiante,
        rol: user.rol,
        puntos_fidelidad: user.puntos_fidelidad,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        codigo_estudiante: true,
        rol: true,
        puntos_fidelidad: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
};

module.exports = { register, login, getMe };
