const { request } = require("express")
const express = require("express")
const app = express()
const md5 = require("md5")
app.use(express.json())

const {auth} = require("./login")
app.use(auth)

const models = require("../models/index")
const users = models.users

app.get("/", async (request, response) => {
    let dataUsers = await users.findAll()

    return response.json(dataUsers)
})

app.post("/", (request,response) => {
    let newUsers = {
       nama: request.body.nama,
       username: request.body.username,
       password: md5(request.body.password),
       role: request.body.role
    }

    users.create(newUsers)
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

app.put("/:id_user", (request, response)=>{

    let data ={
       nama: request.body.nama,
       username: request.body.username,
       role: request.body.role
    }

    if (request.body.password) {
        data.password = md5(request.body.password)
    }

    let parameter={
        id_user: request.params.id_user
    }

    users.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data Berhasil Diubah`,
            data:result
        })
    })
    .catch(error =>{
        return response.json({
            message:error.message
        })
    })
})

app.delete("/:id_users", (request,response) => {
    let parameter = {
        id_users: request.params.id_users
    }

    users.destroy({where: parameter})
    .then(result => { 
        return response.json({ 
            message: `Data Berhasil Dihapus`,
            data: result
        })
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

module.exports = app