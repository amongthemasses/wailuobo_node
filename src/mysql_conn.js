const mysql = require("mysql");
const MysqlConfig = require("../config").mysql;

class MysqlConnection {
    constructor() {
        this.pool = mysql.createPool({ connectionLimit: 10, ...MysqlConfig });
    }

    /**
     *
     * @returns {mysql.PoolConnection}
     */
    async getConn() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error("获取连接出现了错误！！", err);
                    return reject(err);
                } else {
                    return resolve(connection);
                }
            });
        });
    }

    /**
     *
     * @param {mysql.PoolConnection} conn
     * @param {String} queryString
     * @param {Array<String>} queryParames
     * @returns
     */
    async connQuery(conn, queryString, queryParames = []) {
        return new Promise((resolve, reject) => {
            conn.query(queryString, queryParames, (qeuryErr, result) => {
                if (qeuryErr) {
                    console.error("查询语句貌似出错了！！", qeuryErr);
                    return resolve(qeuryErr);
                } else {
                    return reject(result);
                }
            });
        });
    }

    async sqlQeury(queryString, queryParames = []) {
        let conn;
        try {
            conn = await this.getConn();
            let result = await this.connQuery(conn, queryString, queryParames);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            return error;
        }
    }

    /**
     *
     * @param {Array<String>} querys
     * @param {Array<Array<String>>} parames
     */
    async sqlAffair(querys, parames = []) {
        let conn;
        try {
            conn = await this.getConn();
        } catch (error) {
            return error;
        }
        try {
            await this.connQuery(conn, "BENGIN");
            let sqlQuerys = [];
            querys.forEach((value, index) => {
                let pm = parmans[index] ? parames[index] : [];
                sqlQuerys.push(this.connQuery(conn, value, pm));
            });
            await Promise.all(sqlQuerys);
            let result = await this.connQuery(conn, "COMMIT");
            conn.release();
            return result;
        } catch (error) {
            await this.connQuery(conn, "ROLLBACK");
            conn.release();
            return error;
        }
    }
}

module.exports = new MysqlConnection();