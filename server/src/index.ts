import express from 'express'
import cors from 'cors'
import { Pool } from 'pg'

import { db } from './db'

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

app.get('/accounts/:id', async (req, res) => {
  try {
    const account = await db('accounts').where('id', req.params.id).first()
    console.log('account')
    console.log(account)
    return res.sendStatus(200)
  } catch (error) {
    console.error(error)
    throw error
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
