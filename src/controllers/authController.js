import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const nuevoUsuario = await Usuario.create({
    nombre: req.body.nombre,
    apellido: req.body.apellido, 
    email: req.body.email,
    password: req.body.password, 
    telefono: req.body.telefono
  });

  const token = signToken(nuevoUsuario._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { usuario: nuevoUsuario }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  
  const usuario = await Usuario.findOne({ email }).select('+password')
  
  if (usuario) {
    const match = await usuario.correctPassword(password, usuario.password)
    console.log('Contraseñas coinciden:', match)
  }

  if (!usuario || !(await usuario.correctPassword(password, usuario.password))) {
    return next(new AppError('Email o contraseña incorrectos', 401))
  }

  const token = signToken(usuario._id)
  res.status(200).json({ status: 'success', token })
});

export const esPropioOAdmin = catchAsync(async (req, res, next) => {
  const esAdmin = req.user.rol === 'admin'
  const esPropio = req.user._id.toString() === req.params.id

  if (!esAdmin && !esPropio) {
    return next(new AppError('Solo puedes modificar tu propia cuenta', 403))
  }
  next()
})  