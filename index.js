const express = require('express');
const app = express();
//app.use(express.static("public")) - usado para chamar o html
const bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({extended:false})

const { Op } = require('sequelize')
const informacoes = require('./model/cadastrar')
const user = require('./model/usuario')

// sincronizando com a pasta view
app.set('view engine', 'ejs');
app.set('views', './views')

// importanto o express-session
const session = require('express-session')

// configurando o express-session
app.use(session(({
    secret: '2C44-1T58-WFpQ350',
    resave: true,
    saveUninitialized: true,
    cookie: {
    maxAge: 3600000 * 2
    }
})));

// importanto o uuid
const uuid = require('uuid')

// importanto o bcrypt
const bcrypt = require('bcrypt')

app.get('/', (req, res) => {

    res.render('Users/login')
})

app.post('/login', urlencodedParser, async (req, res) => {

    var nomeUser = req.body.login
    var senha = req.body.senha

    user.findOne({

        attributes: ['id', 'login', 'senha', 'nome','nomePerfil'],
        where: {
            login:nomeUser
        }

    }).then(async (usuario) => {

        if(usuario != null){
            const senhaValida = await bcrypt.compare(req.body.senha, usuario.senha)

            if(senhaValida){
                req.session.userId = usuario.id;
                req.session.name = usuario.nome;
                req.session.loginUser = usuario.login;
                res.redirect('/telaPrincipal')
            }
            else {
                res.send('Senha não corresponde!')
            }
        }
        else {
            res.send('Usuario não encontrado!')
        }

    }).catch((erro) => {
        res.send('Erro ao realizar login: ' + erro)
    })
})

app.get('/buscarUsers', (req, res) => {

    if(!req.session.userId){
        res.status(401).render('Results/resultErro')
    } else {
        res.render('Users/buscaUsers')
    }
})

app.post('/resultUsers', urlencodedParser, (req, res) => {

    let resultLogin = req.body.resultLogin
    let resultPerfil = req.body.resultPerfil

    let loginFiltro = `%${resultLogin}%`
    let perfilFiltro = `%${resultPerfil}%`

    user.findAll({
        where: {
            login: { [Op.like]: loginFiltro},
            nomePerfil: { [Op.like]: perfilFiltro}
        }

    }).then((users) => {
        res.render('Results/resultBuscaUsers', {users:users})
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.get('/atualizarUsers', (req, res) => {

    let idUser = req.query.id

    user.findOne({
        where : {
            id: idUser
        }
    }).then((users) => {
        var formularioUser = `
            <form action="/updateUsers" method="post">
                <input type='hidden' name='idUp' value='${users.id}'><br>
                Login: <input type="text" name="loginUp" value='${users.login}'><br>
                Nome: <input type="text" name="nomeUp" value='${users.nome}'><br>
                Senha: <input type="text" name="senhaUp" value='${users.senha}'><br>
                Nome do Perfil: <input type="text" name="perfilUp" value='${users.nomePerfil}'><br>
                <input type="submit" value="enviar">
            </form>
        `

        res.send(formularioUser)
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.post('/updateUsers', urlencodedParser, (req, res) => {

    let idUser = req.body.idUp
    let loginUser = req.body.loginUp
    let nomeUser = req.body.nomeUp
    let senhaUser = req.body.senhaUp
    let nomePerfilUser = req.body.perfilUp

    user.update({
        login: loginUser,
        nome: nomeUser,
        senha: senhaUser,
        nomePerfil: nomePerfilUser
    } , {
        where: {
            id: idUser
        }
    }).then(() => {
        res.render('Results/resultUpdateUser')
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.get('/deleteUsers', (req, res) => {

    let id = req.query.id

    user.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.send('Dados do usuário excluído com sucesso!')
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.get('/cadastro', (req, res) => {

    res.render('Users/cadastro')

})

app.post('/resultCadastro', urlencodedParser, async (req, res) => {

    let login = req.body.login
    let personName = req.body.nome
    let password = await bcrypt.hash(req.body.senha, 10)
    let perfilName = req.body.nomePerfil

    var users = user.create({
        login:login,
        nome:personName,
        senha:password,
        nomePerfil:perfilName

    }).then(() => {
        res.render('Results/resultCadastro')
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.get('/telaPrincipal', (req, res) => {

    res.render('home', {nome: req.session.name})

})

app.get('/cadastrarCarro', (req, res) => {

    if(!req.session.userId){
        res.status(401).render('Results/resultErro')
    } else {
        res.render('Cars/cadastrarCarro')
    }

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
        res.render('Results/resultCadastroCarro')
    }).catch((erro) => {
        res.send('Erro ao inserir o produto: ' + erro)
    })
})

app.get('/buscaCarros', (req, res) => {

    if(!req.session.userId){
        res.status(401).render('Results/resultErro')
    } else {
        res.render('Cars/buscaCarros')
    }
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
        res.render('Results/resultSearch', {carros:carros})
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
        res.render('Results/resultUpdateCarros')
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