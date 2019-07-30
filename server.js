import express from 'express'

import getDrivers from './Corresplot/getDrivers.js'

const app = express()
const PORT = process.env.PORT || 39528

app.use(express.static('.'))


app.get('/', (req, res) => res.redirect('/Corresplot/'))

app.get('/drivers', (req, res) => {
    getDrivers().then(drivers => res.json(drivers))
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))