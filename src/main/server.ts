import './config/better-module-alias'
import app from './config/app'
import { createConnection } from 'typeorm'

createConnection()
  .then((connection) => {
    app.listen(process.env.PORT, () => {
      console.log('Server is running in port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log('Connection to database was failed with error: ', error)
  })
