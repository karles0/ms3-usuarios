import { swaggerSpec } from '../config/swagger.js'
import fs from 'fs'
import yaml from 'js-yaml'

const yamlStr = yaml.dump(swaggerSpec)
fs.writeFileSync('./openapi.yml', yamlStr, 'utf8')
console.log('openapi.yml generado')