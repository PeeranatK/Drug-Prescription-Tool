const {Client} = require('pg')

const client = new Client({
    //host: "localhost",
    host: "projesct.c7y1eguubfia.ap-southeast-1.rds.amazonaws.com",
    user: "postgres",
    port: 5432,
    password: "peeranat32766",
    database: "Project"
})

module.exports = client