import  mariadb  from "mariadb";
import { mariaDBConfiguartion, sequelizeTSConfigutarion } from "./keys";
import { Sequelize } from "sequelize-typescript";

// const pool = mariadb.createPool(mariaDBConfiguartion);
// pool.getConnection()
//     .then(connection => {
//         console.log("DB connected");
//     }).catch(err => {
//         console.log(err);
//     });

const sequelize = new Sequelize({
    database: 'draw',
    dialect: "mariadb",
    username: 'root',
    password: '',
    models: [__dirname + "/models/"]
});
sequelize.addModels([__dirname + "/models/"]);

export { sequelize };