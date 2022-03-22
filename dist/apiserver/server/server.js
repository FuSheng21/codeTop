const express = require('express')
const router = require('./router')
const fs=require('fs')
const path=require('path')


const app = express()

app.use(express.static('./public'))

// 数据接口
app.use('/api',router)

app.listen(3388,()=>{
    console.log('server is running at port 3388')
})

