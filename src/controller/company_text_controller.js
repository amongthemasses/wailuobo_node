const App = require("koa");
const MysqlConn = require("../mysql_conn");
const ResponseCode = require("../../config").responseCode;

class CompanyTextController {
    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: string}|{code: number, message: string}|{code: number, message: *, error: *}|{code: number, data: {insertId: *}, message: string}>}
     */
    async addCompanyText(ctx) {
        let {companyId, text} = ctx.request.body || {};
        if (!companyId) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'companyId'"};
        }
        if (!text) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'text'"};
        }
        try {
            let query = `
                INSERT INTO company_text(company_id, text)
                VALUES (${companyId}, '${text}')
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
    async deleteCompanyText(ctx) {
        let {id} = ctx.request.body || {};
        if (!id) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'id'"};
        }
        let query = `
            DELETE
            FROM company_text
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

module.exports = new CompanyTextController();