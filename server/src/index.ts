import express from 'express'
import cors from 'cors'
import { Pool } from 'pg'

const app = express()
const port = process.env.PORT || 6666

app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
})

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
