const express = require('express')
const app = express()

const path = require('path')

const expressFileUpload = require('express-fileupload')

// agregamos fs para hacer unlink
const fs = require('fs');



app.use(expressFileUpload({
    limits:{
        fileSize:5000000
    },
    abortOnLimit: true,
    responseOnLimit: 'Esta muy pesado el archivo :('
}))

// app.use(require('./routes'))

app.use(express.json())
app.use('/static', express.static(path.join(__dirname, 'static')))

app.listen(3000,()=>{
    console.log('Servidor corriendo')
})


app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/formulario.html')
})

app.get('/imagen', (req,res)=>{
    res.sendFile(path.join(__dirname, 'collage.html'))
})
app.post('/imagen', (req,res)=>{
    const {posicion} = req.body
    const {target_file} = req.files
    target_file.mv(path.join(__dirname,'static','imgs', `image-${posicion}.jpg`),(err)=>{
        if(err){
            res.send('Tu archivo esta muy grande :(')
        }
        res.redirect(301,'/imagen')
    })
})



app.get('/deleteImg/:nombre',(req,res)=>{
    const {nombre} = req.params
    fs.unlink(path.join(__dirname,'static','imgs',nombre),(err)=>{
        if(err) console.log(err);
        else{
            console.log(`archivo ${nombre} eliminado`)
        }
    })
    res.redirect('back');
})