import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import { prisma } from '../lib/prisma'

const pump = promisify(pipeline)

export async function imagesRoutes(app: FastifyInstance) {
  app.post('/images', async (req, reply) => {
    // get uploaded image and limit its size
    const upload = await req.file({
      limits: {
        fileSize: 5_242_880,
      },
    })

    if (!upload) {
      return reply.send(400).send()
    }

    // check if image is an image
    const mimetypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimetypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.send(400).send()
    }

    // generate file name
    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const filename = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', filename),
    )

    await pump(upload.file, writeStream)

    const fullURL = req.protocol.concat('://').concat(req.hostname)

    const fileURL = new URL(`/uploads/${filename}`, fullURL).toString()

    const image = await prisma.image.create({
      data: {
        id: fileId,
        url: fileURL,
      },
    })

    return { image }
  })
}
