const express = require('express');
const app = express();
//app.use(express.static("public")) - usado para chamar o html
const bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({extended:false})

const { Op } = require('sequelize')
const informacoes = require('./model/cadastrar')
//informacoes.sync()

// sincronizando com a pasta view
app.set('view engine', 'ejs');
app.set('views', './views')

app.get('/', (req, res) => {

    res.render('home')
})

app.get('/cadastrarCarro', (req, res) => {

    res.render('cadastrarCarro')

})

app.post('/addCar', urlencodedParser, (req,res) => {

    var marca = req.body.marca
    var nomeCarro = req.body.nomeCarro
    var anoFabric = req.body.anoFabric
    var useOrZero = req.body.useOrZero
    var nomeDono = req.body.nomeDono
    var cpf = req.body.cpf

    // inserindo os dados no banco de dados

    var info = informacoes.create({
        marca:marca,
        nomeCarro:nomeCarro,
        anoFabric:anoFabric,
        useOrZero:useOrZero,
        nomeDono:nomeDono,
        cpf:cpf
    }).then(() => {
        res.send('Produto inserido com sucesso.')
    }).catch((erro) => {
        res.send('Erro ao inserir o produto: ' + erro)
    })
})

app.get('/buscaCarros', (req, res) => {

    res.render('buscaCarros')
})

app.post('/resultadoBusca', urlencodedParser, (req, res) => {

    var buscaMarca = req.body.marca
    var buscaNome = req.body.nomeCarro
    var buscaAno = req.body.anoFabric

    var marcaFiltro = `%${buscaMarca}%`
    var nomeFiltro = `%${buscaNome}%`
    
    informacoes.findAll({
        where: {
            marca: { [Op.like]: marcaFiltro},
            nomeCarro: { [Op.like]: nomeFiltro}
        }

    }).then((carros) => {
        res.render('resultSearch', {carros:carros})
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.get('/atualizarCarros', (req, res) => {

    var idCarro = req.query.id

    informacoes.findOne({
        where : {
            id: idCarro
        }
    }).then((carros) => {
        var formulario = `
            <form action="/updateCarros" method="post">
                <input type='hidden' name='idUp' value='${carros.id}'><br>
                Marca: <input type="text" name="marcaUp" value='${carros.marca}'><br>
                Nome do Carro: <input type="text" name="nomeUp" value='${carros.nomeCarro}'><br>
                Ano de Fabricação: <input type="text" name="anoUp" value='${carros.anoFabric}'><br>
                Usado ou Carro Zero? <input type="text" name="useOrZeroUp" value='${carros.useOrZero}'><br>
                Nome do Dono: <input type="text" name="nomeDonoUp" value='${carros.nomeDono}'><br>
                Cpf do Dono: <input type="text" name="cpfUp" value='${carros.cpf}'><br>
                <input type="submit" value="enviar">
            </form>
        `

        res.send(formulario)
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.post('/updateCarros', urlencodedParser, (req, res) => {

    let idUp = req.body.idUp
    let marcaUp = req.body.marcaUp
    let nomeUp = req.body.nomeUp
    let anoUp = req.body.anoUp
    let useOrZeroUp = req.body.useOrZeroUp
    let nomeDonoUp = req.body.nomeDonoUp
    let cpfUp = req.body.cpfUp

    informacoes.update({
        marca: marcaUp,
        nomeCarro: nomeUp,
        anoFabric: anoUp,
        useOrZero: useOrZeroUp,
        nomeDono: nomeDonoUp,
        cpf: cpfUp
    } , {
        where: {
            id: idUp
        }
    }).then((carros) => {
        res.send('Dados do carro atualizado com sucesso!')
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.get('/deleteCarros', (req, res) => {

    let idCarro = req.query.id

    informacoes.destroy({
        where: {
            id: idCarro
        }
    }).then(() => {
        res.send('Dados do carro excluído com sucesso!')
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})


app.listen(3000, console.log('o servidor está rodando'))