const Sequelize = require('sequelize')
const sequelize = new Sequelize('programCars','root','daniloe10',{
        host:'localhost',
        dialect:'mysql'
    })

sequelize.authenticate().then(function(){
    console.log("Conectado!!")
}).catch((erro) => {
    console.log("Erro ao conectar: "+erro)
})

const info = sequelize.define('cadastro', {
    marca: {
        type: Sequelize.STRING(50)
    },
    nomeCarro: {
        type: Sequelize.STRING(50)
    },
    anoFabric: {
        type: Sequelize.INTEGER
    },
    useOrZero: {
        type: Sequelize.STRING(10)
    },
    nomeDono: {
        type: Sequelize.STRING(80)
    },
    cpf: {
        type: Sequelize.STRING(14)
    }
})

module.exports = info