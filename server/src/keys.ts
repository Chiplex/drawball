const mariaDBConfiguartion = {
    database:{
        host:'localhost',
        user: 'root',
        password: '',
        database: 'draw'
    }
};

const sequelizeTSConfigutarion = {
    database: 'draw',
    dialect: "mariadb",
    username: 'root',
    password: '',
    models: [__dirname + "/models/"]
};

export { mariaDBConfiguartion, sequelizeTSConfigutarion };
