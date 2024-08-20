const asyncHandler = ()=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
        // here instead of promise try catch can also be used
    }
}