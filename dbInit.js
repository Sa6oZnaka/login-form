let mysql = require('mysql'),
    db = 'loginApp',
    dbconfig = require('./databaseConfig');
let connection = mysql.createConnection(dbconfig);
let tables = [ `CREATE TABLE IF NOT EXISTS user(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
);`];
// 'P' - pending, 'F' - friends, 'B' - blocked

connection.query(`CREATE DATABASE IF NOT EXISTS ?? CHARSET \'utf8\'`, db, function (err) {
    if (err) throw err;
    connection.changeUser({
        database: db
    }, function (err) {
        if (err) throw err;
        for(let i = 0; i < tables.length; i ++){
            connection.query(tables[i], function (err) {
                if (err) throw err;
            });
        }
    });
});

module.exports = connection;