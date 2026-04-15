const App = require("koa");
const MysqlConn = require("../mysql_conn");
const ResponseCode = require("../../config").responseCode;

class ProjectTipsController {
    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: string}|{code: number, message: string}|{code: number, message: *, error: *}|{code: number, data: {insertId: *}, message: string}>}
     */
    async addProjectTips(ctx) {
        let {projectId, tips} = ctx.request.body || {};
        if (!projectId) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'projectId'"};
        }
        if (!tips || tips.length === 0) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'tips'"};
        }
        try {
            let _tips = tips.map((tip, i) => {
                return `(${projectId},${tip})`;
            })
            let query = `
                INSERT INTO project_tips(project_id, tip)
                VALUES ${_tips.join(",")}
            `;
            let result = await MysqlConn.sqlQuery(query);
            return ctx.body = {code: ResponseCode.success, data: {insertId: result.insertId}, message: "添加成功！"};
        } catch (error) {
            return ctx.body = {code: ResponseCode.error, message: error.message, error};
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: string}>}
     */
    async deleteProjectTips(ctx) {
        let {id} = ctx.request.body || {};
        if (!id) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'id'"};
        }
        let query = `
            DELETE
            FROM project_tips
            WHERE id = ${id}
        `;
        try {
            await MysqlConn.sqlQuery(query);
            return ctx.body = {code: ResponseCode.success, message: "删除成功！"};
        } catch (error) {
            return ctx.body = {code: ResponseCode.error, message: error.message, error};
        }
    }
}

module.exports = new ProjectTipsController();