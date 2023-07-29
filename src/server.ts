import fastify from 'fastify'

const app = fastify()

app.listen({ port: 3001 }).then(() => {
  console.log('🚀 server running at http://localhost:3003')
})
