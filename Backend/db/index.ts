const { Client } = require('pg')

const client = new Client({
  user: 'dev_user',
  host: 'localhost',
  database: 'db',
  password: 'password',
  port: 5432,
})

export default client.connect();