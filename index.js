require('dotenv').config()
const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send('Home Page')
})

app.get("/about", (req, res) => {
    res.send('<h1>About Page </h1>')
})

app.listen(process.env.port || 7000, () => {
    console.log(`Server Started ! at https://locallhost:${process.env.port}`);
})