import Usuario from '../models/Usuario.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { toUsuarioPublicoDTO, toUsuarioAdminDTO } from '../utils/dtos.js'   

const aplicarDTO = (usuario, rol) =>
  rol === 'admin' ? toUsuarioAdminDTO(usuario) : toUsuarioPublicoDTO(usuario)

export const getAllUsuarios = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limitParam = req.query.limit

  // 🔥 soporta ingesta sin romper memoria
  const limit = parseInt(limitParam) || 20
  const skip = (page - 1) * limit

  const usuarios = await Usuario.find()
    .select('-password') // 🔥 importante
    .skip(skip)
    .limit(limit)
    .lean()

  const total = await Usuario.countDocuments()

  res.status(200).json({
    status: 'success',
    results: usuarios.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: usuarios.map(u => aplicarDTO(u, req.user.rol))
  })
})

export const getUsuario = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findById(req.params.id)
  if (!usuario) return next(new AppError('Usuario no encontrado', 404))

  res.status(200).json({
    status: 'success',
    data: aplicarDTO(usuario, req.user.rol)
  })
})

export const actualizarDireccion = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findByIdAndUpdate(
    req.params.id,
    { direccion: req.body.direccion },
    { new: true, runValidators: true }
  );
  
  if (!usuario) {
    return next(new AppError('Usuario no encontrado', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: usuario
  });
});

// Solo admin — asignar rol a un usuario

export const asignarRol = catchAsync(async (req, res, next) => {
  const { rol } = req.body
  if (!['user', 'admin'].includes(rol)) {
    return next(new AppError('Rol inválido. Usa: user o admin', 400))
  }
  const usuario = await Usuario.findByIdAndUpdate(
    req.params.id,
    { rol },
    { new: true, runValidators: true }
  )
  if (!usuario) return next(new AppError('Usuario no encontrado', 404))

  res.status(200).json({ status: 'success', data: toUsuarioAdminDTO(usuario) })
})

// Solo admin — eliminar cuenta
export const eliminarUsuario = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findByIdAndDelete(req.params.id)
  if (!usuario) return next(new AppError('Usuario no encontrado', 404))
  res.status(204).json({ status: 'success', data: null })
})