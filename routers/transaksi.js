const { response, request } = require("express")
const express = require("express")
const app = express()
const {auth} = require("./login")

app.use(express.json())
app.use(auth)

const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi

app.get("/", async (request, response)  => {
    let dataTransaksi = await transaksi.findAll({
        include: [
            {model: models.member, as: "member"},
            {model: models.users, as: "user"},
            {
                model: models.detail_transaksi, 
                as: "detail_transaksi",
            include: [
                {model: models.paket, as:"paket"}
            ]}
        ]
    })
    return response.json(dataTransaksi)
})

app.post("/", (request, response) => {
    let newTransaksi = {
        id_member: request.body.id_member,
        tgl: request.body.tgl,
        batas_waktu: request.body.batas_waktu,
        tgl_bayar: request.body.tgl_bayar,
        status: 1,
        dibayar: request.body.dibayar,
        id_user: request.body.id_user
    }

    transaksi.create(newTransaksi)
    .then(result => {
        let newIDTransakasi = result.id_transaksi

        let detail = request.body.detail_transaksi
        for (let i = 0; i < detail.length; i++) {
            detail[i].id_transaksi = newIDTransakasi
        }

        detail_transaksi.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `Data Transaksi Berhasil Ditambahkan`
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

app.put("/:id_transaksi", async (request, response) => {
    let dataTransaksi = {
        id_member : request.body.id_member,
        tgl : request.body.tgl,
        batas_waktu : request.body.batas_waktu,
        tgl_bayar : request.body.tgl_bayar,
        status : request.body.status,
        dibayar : request.body.dibayar,
        id_user : request.body.id_user,
    }

    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    transaksi.update(dataTransaksi, {where: parameter})
    .then(async (result) => {
        await detail_transaksi.destroy({where: parameter})
        
        let detail = request.body.detail_transaksi
        for (let i = 0; i < detail.length; i++) {
            detail[i].id_transaksi = request.params.id_transaksi            
        }

        detail_transaksi.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: "data berhasil di update"
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

app.delete( "/:id_transaksi", (request, response) => {
    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    detail_transaksi.destroy({where: parameter})
    .then(result => {
        transaksi.destroy({where: parameter})
        .then(result => {
            return response.json({
                message: 'Data Berhasil Dihapus'
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

app.post("/status/:id_transaksi", (request,response) => {
    let data = {
        status: request.body.status
    }

    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    transaksi.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data Status Berhasil Diubah`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

app.get("/bayar/:id_transaksi", (request, response) => {
    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    let data = {
        tgl_bayar: new Date().toISOString().split("T")[0],
        dibayar: true
    }

    transaksi.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Transaksi Telah Dibayar`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

module.exports = app