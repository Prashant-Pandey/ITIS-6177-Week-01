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
        res = await conn.query(`select * from ${tableName} where COMPANY_ID = ?`, [id]);
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
        res = await conn.query(`insert into ${tableName} values(?, ?, ?)`, [id, name, city]);
    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release(); //release to pool
        return res;
    }
}

exports.searchCompanys = async (searchTerm) => {
    let conn, res = [];
    try {
        conn = await pool.getConnection();
        const tmp = await conn.query(`select * from ${tableName}`);
        const lowecaseSearchTerm = searchTerm.toLowerCase();
        res = tmp.filter((val) => {
            const company_name = val.COMPANY_NAME===null?'':val.COMPANY_NAME.toLowerCase();
            const company_id = val.COMPANY_ID===null?'':val.COMPANY_ID.toLowerCase();
            const company_city = val.COMPANY_CITY===null?'':val.COMPANY_CITY.toLowerCase();
            return company_id.match(lowecaseSearchTerm) || company_name.match(lowecaseSearchTerm) || company_city.match(lowecaseSearchTerm);
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
        res = await conn.query(`DELETE FROM ${tableName} WHERE COMPANY_ID=?`, [id]);
    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release();
        return res;
    }
}


exports.updateCompany = async (oldId, id, name, city) => {
    let conn, res;
    try {
        conn = await pool.getConnection();
        res = await conn.query(`select COMPANY_ID from ${tableName} where COMPANY_ID=?`, [oldId]);

        if (res.length === 0) {
            // create
            res = await conn.query(`insert into ${tableName} values(?, ?, ?)`, [id, name, city]);
        } else {
            // update
            res = await conn.query(`UPDATE ${tableName} SET COMPANY_ID=?, COMPANY_NAME=?, COMPANY_CITY=? WHERE COMPANY_ID=?`, [id, name, city, oldId]);
        }
    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release(); //release to pool
        return res;
    }
}

exports.updatePartialCompany = async (oldId, id, name, city) => {
    let conn, res;
    try {
        conn = await pool.getConnection();
        if (name !== null || name !== undefined) {
            res = await conn.query(`UPDATE ${tableName} SET COMPANY_NAME=? WHERE COMPANY_ID=?`, [name, oldId]);
        }
        if (city !== null || city !== undefined) {
            res = await conn.query(`UPDATE ${tableName} SET COMPANY_CITY=? WHERE COMPANY_ID=?`, [city, oldId]);
        }
        if (id !== null || id !== undefined) {
            res = await conn.query(`UPDATE ${tableName} SET COMPANY_ID=? WHERE COMPANY_ID=?`, [id, oldId]);
        }

    } catch (err) {
        res = { error: err };
    } finally {
        if (conn) conn.release(); //release to pool
        return res;
    }
}