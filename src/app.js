import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app =  express()
app.use(cors({
    origin: process.env.CORS_ORIGIN, //for now, allowing from all sources
    credentials: true,
}))

app.use(express.json({limit : "16kb"}))                         //accept json data (forms)  
app.use(express.urlencoded({extended: true , limit: "16kb"}))   //accept from URLs
app.use(express.static("public"))                               //To store images, pdf etc - if needed
app.use(cookieParser())                                         //to be able to access and set user's browser cookies



//Routers for each version

//version 1 - v1
import product_router_v1 from './routes/v1/product.routes.js'
import stockmovement_router_v1 from './routes/v1/stockmovement.routes.js'
import supplier_router_v1 from './routes/v1/supplier.routes.js'
app.use('/api/v1/products', product_router_v1)
app.use('/api/v1/stockmovements', stockmovement_router_v1)
app.use('/api/v1/suppliers', supplier_router_v1)

//version 2 - v2
import user_router_v2 from './routes/v2/user.routes.js'
import product_router_v2 from './routes/v2/product.routes.js'
import supplier_router_v2 from './routes/v2/supplier.routes.js'
import store_router_v2 from './routes/v2/store.routes.js'
import stockmovement_router_v2 from './routes/v2/stockmovement.routes.js'
import store_product_router_v2 from './routes/v2/store_product.routes.js'
import store_supplier_product_router_v2 from './routes/v2/store_supplier_product.routes.js'
import reporting_router_v2 from './routes/v2/reporting.routes.js'
import { default_limiter } from './middlewares/request_throttle.middleware.js'


app.use('/api/v2/users', user_router_v2)
app.use('/api/v2/products', product_router_v2)
app.use('/api/v2/suppliers', supplier_router_v2)
app.use('/api/v2/stores', store_router_v2)
app.use('/api/v2/stockmovements', stockmovement_router_v2)
app.use('/api/v2/store_products', store_product_router_v2)
app.use('/api/v2/store_supplier_products', store_supplier_product_router_v2)
app.use('/api/v2/reportings', reporting_router_v2)
//app.use(default_limiter)  -- uncomment this when using v2

//version 3 - v3
import user_router_v3 from './routes/v3/user.routes.js'
import product_router_v3 from './routes/v3/product.routes.js'
import supplier_router_v3 from './routes/v3/supplier.routes.js'
import store_router_v3 from './routes/v3/store.routes.js'
import stockmovement_router_v3 from './routes/v3/stockmovement.routes.js'
import store_product_router_v3 from './routes/v3/store_product.routes.js'
import store_supplier_product_router_v3 from './routes/v3/store_supplier_product.routes.js'
import reporting_router_v3 from './routes/v3/reporting.routes.js'
import { default_limiter_v3 } from './middlewares/distributed_api_rate_limiting.middleware.js'

app.use('/api/v3/users', user_router_v3)
app.use('/api/v3/products', product_router_v3)
app.use('/api/v3/suppliers', supplier_router_v3)
app.use('/api/v3/stores', store_router_v3)
app.use('/api/v3/stockmovements', stockmovement_router_v3)
app.use('/api/v3/store_products', store_product_router_v3)
app.use('/api/v3/store_supplier_products', store_supplier_product_router_v3)
app.use('/api/v3/reportings', reporting_router_v3)
app.use(default_limiter_v3)









export { app }