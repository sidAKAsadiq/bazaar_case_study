const async_handler = (request_handler) => {
    return (req,res,next) => {
        Promise.resolve(request_handler(req,res,next)).catch((error) => next(error))
    }
}


export {async_handler}