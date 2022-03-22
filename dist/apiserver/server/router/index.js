const express=require('express')
const questionRouter=require('./question')
const userRouter=require('./user')
const companyRouter=require('./company')



const router=express.Router();
module.exports=router

router.use(
    express.urlencoded({extended:false}),
    express.json()
)

router.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header("Access-Control-Allow-Headers","content-type,Authorization");
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS,PATCH");
    next();
})

router.use('/question',questionRouter)
router.use('/user',userRouter)
router.use('/company',companyRouter)

