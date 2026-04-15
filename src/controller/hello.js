const mysqlConn = require("../mysql_conn");
const App = require("koa");

module.exports = class HelloController {
    
    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     */
    static async getHello(ctx) {
        let query = "select * from infos where id = ?";
        let value = [1];
        try {
            ctx.body = await mysqlConn.sqlQuery(query, value);
        } catch (error) {
            ctx.body = error;
        }
    }
}
