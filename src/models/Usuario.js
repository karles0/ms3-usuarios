import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre:    { type: String, required: true },
  apellido:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  telefono:  { type: String },
  direccion: {
    calle:   { type: String },
    ciudad:  { type: String },
    pais:    { type: String, default: 'Perú' }
  },
  rol: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
  },
  password: { type: String, required: true, select: false },

}, { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

usuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

usuarioSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.model('Usuario', usuarioSchema)