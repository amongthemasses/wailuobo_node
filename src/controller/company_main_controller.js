const App = require("koa");
const MysqlConn = require("../mysql_conn");
const ResponseCode = require("../../config").responseCode;

class CompanyMainController {
    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: string}|{code: number, message: string}|{code: number, message: *, error: *}|{code: number, data: {insertId: *}, message: string}>}
     */
    async addCompanyMain(ctx) {
        let {companyId, mainText} = ctx.request.body || {};
        if (!companyId) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'companyId'"};
        }
        if (!mainText) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'mainText'"};
        }
        try {
            let query = `
                INSERT INTO company_main(company_id, main_text)
                VALUES (${companyId}, '${mainText}')
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
    async deleteCompanyMainText(ctx) {
        let {id} = ctx.request.body || {};
        if (!id) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'id'"};
        }
        let query = `
            DELETE
            FROM company_main
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

module.exports = new CompanyMainController();