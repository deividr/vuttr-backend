import app from './config/app'
import { createConnection } from 'typeorm'

createConnection()
  .then((connection) => {
    app.listen(3000, () => {
      console.log('Server is running in http://localhost:3000...')
    })
  })
  .catch((error) => {
    console.log('Connection to database was failed with error: ', error)
  })
