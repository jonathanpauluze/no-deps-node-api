import { notFoundRoute } from './routes/notFound.route.js'
import { pingRoute } from './routes/ping.route.js'

const router = {
  notFound: notFoundRoute,
  ping: pingRoute,
}

export { router }
