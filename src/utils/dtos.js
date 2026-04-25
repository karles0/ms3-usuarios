export const toUsuarioPublicoDTO = (usuario) => ({
  nombre:   usuario.nombre,
  apellido: usuario.apellido,
  pais:     usuario.direccion?.pais
})

export const toUsuarioAdminDTO = (usuario) => ({
  id:        usuario._id,
  nombre:    usuario.nombre,
  apellido:  usuario.apellido,
  email:     usuario.email,
  telefono:  usuario.telefono,
  direccion: usuario.direccion,
  rol:       usuario.rol,
  creadoEn:  usuario.createdAt
})