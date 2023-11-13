const express = require('express');
const app = express();
app.use(express.static("public"))
const bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({extended:false})

const Sequelize = require('sequelize')
const sequelize = new Sequelize('programCars','xxx','xxx',{
        host:'localhost',
        dialect:'mysql'
    })

sequelize.authenticate().then(function(){
    console.log("Conectado!!")
}).catch((erro) => {
    console.log("Erro ao conectar: "+erro)
})

app.post('/addCar', urlencodedParser, (req, res) => { 

    var marca = req.body.marca
    var nomeCarro = req.body.nomeCarro
    var anoFabric = req.body.anoFabric
    var useOrZero = req.body.useOrZero
    var nomeDono = req.body.nomeDono
    var cpf = req.body.cpf

    var carros = []

    var newsCar = {marca:marca, nomeCarro:nomeCarro, anoFabric:anoFabric, useOrZero:useOrZero, nomeDono:nomeDono, cpf:cpf}
    carros.push(newsCar)

    var fullAnswer = ''
    for(var i = 0; i < carros.length; i++){
        fullAnswer += '<div>'
        fullAnswer += 'Marca: ' + carros[i].marca + '<br>'
        fullAnswer += 'Nome do carro: ' + carros[i].nomeCarro + '<br>'
        fullAnswer += 'Ano de Fabricação: ' + carros[i].anoFabric + '<br>'
        fullAnswer += 'Carro usado ou Carro zero? ' + carros[i].useOrZero + '<br>'
        fullAnswer += 'Nome do dono: ' + carros[i].nomeDono + '<br>'
        fullAnswer += 'Cpf do dono: ' + carros[i].cpf + '<br>'
        fullAnswer += '</div>'
    }
    res.send(fullAnswer)
})

app.listen(3000, console.log('o servidor está rodando'))