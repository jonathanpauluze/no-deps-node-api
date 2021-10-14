import http from 'http'
import https from 'https'
import url from 'url'
import { StringDecoder } from 'string_decoder'
import fs from 'fs'

import config from './config.js'
import { router } from './router.js'

// Create HTTP server
const httpServer = http.createServer((request, response) => {
  unifiedServer(request, response)
})

httpServer.listen(config.httpPort, () => {
  console.log(`🚀 The server is listening on port ${config.httpPort} in ${config.envName} mode!`)
})

// Create HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}

const httpsServer = https.createServer(httpsServerOptions, (request, response) => {
  unifiedServer(request, response)
})

httpsServer.listen(config.httpsPort, () => {
  console.log(`🚀 The server is listening on port ${config.httpsPort} in ${config.envName} mode!`)
})

const unifiedServer = (request, response) => {
  const parsedUrl = url.parse(request.url, true)

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  const queryStringObject = parsedUrl.query

  const method = request.method.toLowerCase()

  const headers = request.headers

  // Get the payload
  const decoder = new StringDecoder('utf-8')
  let buffer = ''

  request.on('data', (data) => {
    buffer += decoder.write(data)
  })

  request.on('end', () => {
    buffer += decoder.end()


    const chosenHandler = router[trimmedPath] ? router[trimmedPath] : router.notFound
    const payload = buffer ? JSON.parse(buffer) : {}

    const data = {
      path: trimmedPath,
      query: queryStringObject,
      method,
      headers,
      payload,
    }

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200
      payload = typeof (payload) === 'object' ? payload : {}

      const payloadString = JSON.stringify(payload)

      response.setHeader('Content-Type', 'application/json')
      response.writeHead(statusCode)
      response.end(payloadString)

      console.log(`[${method}] [${statusCode}] on ${path}`)
    })
  })
}
