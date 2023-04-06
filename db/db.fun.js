const db = require("./db").promise()

let RunSQL = async (sql ,data) => {
    try {
        return (await db.query(sql, data))[0];
    } catch (err) {
        console.error("RunSQL:I think not working query!");
        return { err: 1, message: err.message};
    }
}

let RunSQLOne = async (sql ,data) => {
    try {
        return (await db.query(sql, data))[0][0];
    } catch (err) {
        console.error("RunSQL:I think not working query!");
        return { err: 1, message: err.message};
    }
}

module.exports = {
    RunSQL , RunSQLOne
}