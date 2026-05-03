import mongoose from 'mongoose'
import { faker } from '@faker-js/faker/locale/es'
import dotenv from 'dotenv'
import Usuario from '../models/Usuario.js'

dotenv.config()

const TOTAL = 20000
const BATCH = 20   // puedes subir a 100 si va fluido

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 5 // importante para poca RAM
  })

  console.log('Conectado. Borrando datos previos...')
  await Usuario.deleteMany({})

  // Admin fijo
  await Usuario.create({
    nombre: 'Admin',
    apellido: 'ShopCloud',
    email: 'admin@shopcloud.com',
    password: 'admin123',
    telefono: '999000000',
    rol: 'admin',
    direccion: {
      calle: 'Av. Principal 123',
      ciudad: 'Lima',
      pais: 'Perú'
    }
  })

  console.log('Admin creado')

  let insertados = 0

  while (insertados < TOTAL) {
    const lote = []

    for (let i = 0; i < BATCH && insertados < TOTAL; i++) {
      const id = insertados + i

      lote.push({
        nombre: faker.person.firstName(),
        apellido: faker.person.lastName(),

        // 🔥 EMAIL ÚNICO SIN COSTO
        email: `user_${id}@shopcloud.com`,

        password: '$2b$12$EV1Zyexp8gF9sjrPAPIcrO/NwEr9OF1KQsswSCn.VDsFPuvFUFqay',
        telefono: faker.phone.number(),
        rol: 'user',
        direccion: {
          calle: faker.location.streetAddress(),
          ciudad: faker.location.city(),
          pais: 'Perú'
        }
      })
    }

    try {
      await Usuario.insertMany(lote, {
        ordered: false,
        lean: true // ⚡ menos overhead de mongoose
      })
    } catch (e) {
      if (e.code !== 11000) throw e
      // ignoramos duplicados (aunque ya no deberían existir)
    }

    insertados += lote.length
    console.log(`${insertados}/${TOTAL}`)

    // 🧠 liberar CPU / RAM
    await new Promise(r => setTimeout(r, 100))

    // 🧠 pausa más larga cada cierto tiempo
    if (insertados % 2000 === 0) {
      console.log('Pausa de recuperación...')
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  console.log('Seed completado 🚀')
  await mongoose.disconnect()
}

seed().catch(console.error)