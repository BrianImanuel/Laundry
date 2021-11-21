const express = require("express")
const app = express()

app.use(express.json())

const models = require("../models/index")

const member = models.member

const {auth} = require("./login")

app.use(auth)

app.get("/", async (request, response) => {
    let dataMember = await member.findAll()

    return response.json(dataMember)
})

app.post("/", (request,response) => {
    let newMember = {
        nama: request.body.nama,
        alamat: request.body.alamat,
        jenis_kelamin:request.body.jenis_kelamin,
        telepon:request.body.telepon
    }

    member.create(newMember)
    .then(result => {
        response.json({
            message: 'Data berhasil ditambahkan'
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

app.put("/:id_member", (request, response)=>{
    // tampung data  yang akan diubah
    let data ={
        nama: request.body.nama,
        alamat: request.body.alamat,
        telepon: request.body.telepon,
        jenis_kelamin: request.body.jenis_kelamin
    }

    let parameter={
        id_member: request.params.id_member
    }

    //proses update
    member.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message:`data berhasil diubah`,
            data:result
        })
    })
    .catch(error =>{
        return response.json({
            message:error.message
        })
    })
})

app.delete("/:id_member", (request,response) => {
    let parameter = {
        id_member: request.params.id_member
    }

    member.destroy({where: parameter})
    .then(result => { 
        return response.json({ 
            message:  `Data Berhasil Dihapus`
        })
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})
module.exports = app