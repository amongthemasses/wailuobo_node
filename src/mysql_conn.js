const mysql = require("mysql2/promise");
const MysqlConfig = require("../config").mysql;

class MysqlConnection {
    constructor() {
        this.pool = mysql.createPool({...MysqlConfig});
    }

    /**
     *
     * @returns {mysql.PoolConnection}
     */
    async getConn() {

        try {
            return await this.pool.getConnection();
        } catch (error) {
            console.error("获取连接出现了错误！！", error);
            throw error;
        }
    }

    /**
     *
     * @param {mysql.PoolConnection} conn
     * @param {String} queryString
     * @param {Array<String>} queryParams
     * @returns
     */
    async connQuery(conn, queryString, queryParams = []) {
        try {
            let [result] = await conn.query(queryString, queryParams)
            return result;
        } catch (error) {
            console.error("查询语句貌似出错了！！", error);
            throw error;
        }
    }

    async sqlQuery(queryString, queryParams = []) {
        let conn;
        try {
            conn = await this.getConn();
            let result = await this.connQuery(conn, queryString, queryParams);
            conn.release();
            return result;
        } catch (error) {
            conn.release();
            return error;
        }
    }
}

module.exports = new MysqlConnection();