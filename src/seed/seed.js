import mongoose from 'mongoose'
import { faker } from '@faker-js/faker/locale/es'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import Usuario from '../models/Usuario.js'

dotenv.config()

const TOTAL = 20000
const BATCH = 500

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Conectado. Borrando datos previos...')
  await Usuario.deleteMany({})

  // ── Admin fijo ──────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123', 12)
  await Usuario.create({
    nombre: 'Admin',
    apellido: 'ShopCloud',
    email: 'admin@shopcloud.com',
    password: passwordHash,
    telefono: '999000000',
    rol: 'admin',
    direccion: { calle: 'Av. Principal 123', ciudad: 'Lima', pais: 'Perú' }
  })
  console.log(' Admin creado — email: admin@shopcloud.com / pass: admin123')

  // ── 20,000 usuarios normales ─────────────────────────
  let insertados = 0
  while (insertados < TOTAL) {
    const lote = Array.from({ length: BATCH }, () => ({
      nombre:    faker.person.firstName(),
      apellido:  faker.person.lastName(),
      email:     faker.internet.email(),
      password: '$2b$12$EV1Zyexp8gF9sjrPAPIcrO/NwEr9OF1KQsswSCn.VDsFPuvFUFqay', // "pass123" hasheado
      telefono:  faker.phone.number(),
      rol:       'user',
      direccion: {
        calle:   faker.location.streetAddress(),
        ciudad:  faker.location.city(),
        pais:    'Perú'
      }
    }))
    await Usuario.insertMany(lote, { ordered: false })
    insertados += lote.length
    console.log(`  ${insertados}/${TOTAL} usuarios insertados`)
  }

  console.log(' Seed completado')
  await mongoose.disconnect()
}

seed().catch(console.error)