import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Usuario from '../models/Usuario.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No estás logueado. Por favor inicia sesión.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await Usuario.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('El usuario dueño de este token ya no existe.', 401));
  }

  

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return next(new AppError('No tienes permiso para realizar esta acción', 403))
    }
    next()
  }
}

export const esPropioOAdmin = catchAsync(async (req, res, next) => {
  const esAdmin = req.user.rol === 'admin'
  const esPropio = req.user._id.toString() === req.params.id

  if (!esAdmin && !esPropio) {
    return next(new AppError('Solo puedes modificar tu propia cuenta', 403))
  }
  next()
})