import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { default_limiter } from './middlewares/request_throttle.middleware.js'
const app =  express()



app.use(cors({
    origin: process.env.CORS_ORIGIN, //for now, allowing from all sources
    credentials: true,
}))

app.use(express.json({limit : "16kb"})) //accept json data (forms)  
app.use(express.urlencoded({extended: true , limit: "16kb"})) //accept from URLs
app.use(express.static("public")) //To store images, pdf etc
app.use(cookieParser()) //to be able to access and set user's browser cookies

app.use(default_limiter) // in v2 - for requests throttling - limiting api requests


//Routers for each version

//version 1 - v1
import product_router from './routes/v1/product.routes.js'
import stockmovement_router from './routes/v1/stockmovement.routes.js'
import supplier_router from './routes/v1/supplier.routes.js'
app.use('/api/v1/products', product_router)
app.use('/api/v1/stockmovements', stockmovement_router)
app.use('/api/v1/suppliers', supplier_router)

//version 2 - v2
import user_router from './routes/v2/user.routes.js'
import product_router from './routes/v2/product.routes.js'
import supplier_router from './routes/v2/supplier.routes.js'
import store_router from './routes/v2/store.routes.js'
import stockmovement_router from './routes/v2/stockmovement.routes.js'
import store_product_router from './routes/v2/store_product.routes.js'
import store_supplier_product_router from './routes/v2/store_supplier_product.routes.js'
import reporting_router from './routes/v2/reporting.routes.js'
import { default_limiter } from './middlewares/request_throttle.middleware.js'

app.use('/api/v2/users', user_router)
app.use('/api/v2/products', product_router)
app.use('/api/v2/suppliers', supplier_router)
app.use('/api/v2/stores', store_router)
app.use('/api/v2/stockmovements', stockmovement_router)
app.use('/api/v2/store_products', store_product_router)
app.use('/api/v2/store_supplier_products', store_supplier_product_router)
app.use('/api/v2/reportings', reporting_router)





export { app }