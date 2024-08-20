import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
// extended is use for object inside object
app.use(express.static("public"))
// static is used to save file or images that can be publically accessed
app.use(cookieParser())
// cookie-parser is used to parse cookie in the request from server to perform CRUD operation
// initially express was unable to take json data for that we use bodyparser
// checking between client and server- middleware

export { app }