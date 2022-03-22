const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

const compression = require('compression')
app.use(compression());
app.use(express.static('./public'))


app.use(function(req,res){
    fs.readFile(path.resolve('./public/index.html'),(err,content)=>{
        res.set({
            'Content-Type':'text/html;charset=utf-8'
        })
        res.send(content)
    })
})
app.listen(8081,()=>{
    console.log('server run at 8081');
})