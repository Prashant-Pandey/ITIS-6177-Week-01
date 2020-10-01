const mariadb = require('mariadb');
const { connection_string } = require("./const");
const pool = mariadb.createPool(connection_string);
const tableName = 'company';

exports.getCompanys = async () => {
    let conn, res;
    try {
        conn = await pool.getConnection();
        res = await conn.query(`select * from ${tableName}`);
    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release(); 
        return res;
    }
}

exports.getCompany = async (id) => {
    let conn, res;
    try {
        conn = await pool.getConnection();
        res = await conn.query(`select * from ${tableName} where COMPANY_ID = '${id}'`);
    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release(); 
        return res;
    }
}

exports.createCompany = async (id, name, city) => {
    let conn, res;
    try {
        conn = await pool.getConnection();
        res = await conn.query(`insert into ${tableName} values('${id}', '${name}', '${city}')`);
    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release(); //release to pool
        return res;
    }
}

exports.searchCompanys = async (params) => {
    if(!params.searchTerm){
        return { error: 'Please validate your query term', status: 400 };
    }

    let conn, res = [];
    try {
        conn = await pool.getConnection();
        const tmp = await conn.query(`select * from ${tableName}`);
        res = tmp.filter((val)=>{
            return val.COMPANY_NAME.match(params.searchTerm)||val.COMPANY_CITY.match(params.searchTerm);
        })
    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release(); //release to pool
        return res;
    }
}

exports.deleteCompany = async (id) => {
    let conn, res;
    try {
        conn = await pool.getConnection();
        res = await conn.query(`DELETE FROM ${tableName} WHERE COMPANY_ID='${id}';`);
    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release(); 
        return res;
    }
}