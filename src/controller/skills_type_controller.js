const App = require("koa");
const MysqlConn = require("../mysql_conn");
const ResponseCode = require("../../config").responseCode;

class SkillsTypeController {
    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns
     */
    async getSKillsType(ctx) {
        let query = `
            SELECT *
            FROM skills_type LIMIT 0,5
        `;
        try {
            let result = await MysqlConn.sqlQuery(query);
            return ctx.body = {code: ResponseCode.success, data: result, message: "获取成功！"};
        } catch (error) {
            return ctx.bdoy = {code: ResponseCode.error, message: error.message, error};
        }
    }
}

module.exports = new SkillsTypeController();