import express from 'express'

const PORT = process.env.PORT || 39528

const app = express()

app.use(express.static(__dirname))

app.listen(PORT, () => console.log(`L'application de mise en relation directe écoute sur le port ${PORT}!`))