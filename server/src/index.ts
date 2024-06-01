require('dotenv').config()

if (process.env.NODE_ENV === 'production') {
  require('module-alias/register')
}

import app from 'lib/express'
import routes from './routes'

const port = process.env.API_PORT || 3001

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  routes(app)
})
