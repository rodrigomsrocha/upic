import fastify from 'fastify'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { imagesRoutes } from './routes/images'
import { resolve } from 'node:path'

const app = fastify()

app.register(multipart)
app.register(fastifyStatic, {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(imagesRoutes)

app.listen({ port: 3001 }).then(() => {
  console.log('🚀 server running at http://localhost:3001')
})
