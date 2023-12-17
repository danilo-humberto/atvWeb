const Sequelize = require('sequelize')
const sequelize = new Sequelize('programCars','root','daniloe10',{
        host:'localhost',
        dialect:'mysql'
})

const user = sequelize.define('usuario', {
    login: {
        type: Sequelize.STRING(15)
    },
    nome: {
        type: Sequelize.STRING(100)
    },
    senha: {
        type: Sequelize.STRING(100)
    },
    nomePerfil: {
        type: Sequelize.STRING(100)
    }
})

module.exports = user;