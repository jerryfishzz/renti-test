import express from 'express'
import cors from 'cors'

import routes from './routes'

const app = express()
const port = process.env.PORT || 6666

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  routes(app)
})
