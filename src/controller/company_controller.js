const App = require("koa");
const ResponseCode = require("../../config").responseCode;
const MysqlConn = require("../mysql_conn");
const dayjs = require("dayjs");

class CompanyController {


    /**
     * 
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code:Number,data:Object<any>,message:String} |{code:Number,error:Error,message:String} >} 
     */
    async getCompanyItem(ctx) {
        let { companyId } = ctx.request.query || {};
        if (!companyId) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'companyId'" };
        }
        let query = `
            SELECT a.*,
                   (SELECT GROUP_CONCAT(bt.id, '|,|', bt.text SEPARATOR '|.|')
                    FROM company_text AS bt
                    WHERE a.id = bt.company_id) AS texts,
                   (SELECT GROUP_CONCAT(ct.id, '|,|', ct.main_text SEPARATOR '|.|')
                    FROM company_main AS ct
                    WHERE a.id = ct.company_id) AS main_texts
            FROM company AS a
            WHERE id = ${companyId}
        `;
        try {
            let [result] = await MysqlConn.sqlQuery(query);
            if (result.texts) {
                result.texts = result.texts.split("|.|").map(it => {
                    let [key, val] = it.split("|,|")
                    return { text_id: Number(key), text: val };
                })
            } else {
                result.texts = [];
            }
            if (result.main_texts) {
                result.main_texts = result.main_texts.split("|.|").map(it => {
                    let [key, val] = it.split("|,|")
                    return { main_text_id: Number(key), main_text: val };
                })
            } else {
                result.main_texts = [];
            }
            return ctx.body = { code: ResponseCode.success, data: result ? result : {}, messgae: "获取成功！" };
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, error, messgae: error.message };
        }
    }
    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: string}|{code: number, message: *, error: *}|{code: number, data: *, message: string}>}
     */
    async getCompany(ctx) {
        let { phoneNumber } = ctx.request.query || {};
        if (!phoneNumber || typeof phoneNumber !== "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            });
        }
        let query = `
            SELECT a.*,
                   (SELECT GROUP_CONCAT(bt.id, '|,|', bt.text SEPARATOR '|.|')
                    FROM company_text AS bt
                    WHERE a.id = bt.company_id) AS texts,
                   (SELECT GROUP_CONCAT(ct.id, '|,|', ct.main_text SEPARATOR '|.|')
                    FROM company_main AS ct
                    WHERE a.id = ct.company_id) AS main_texts
            FROM company AS a
            WHERE a.phone_number = '${phoneNumber}'
            ORDER BY a.start_date DESC
        `;
        try {
            let result = await MysqlConn.sqlQuery(query);
            let reList = result.map((item, i) => {
                if (item.texts) {
                    let __texts = String(item.texts).trim().split("|.|");
                    item.texts = __texts.map((it, k) => {
                        let [key, val] = String(it).split("|,|");
                        return { text_id: key, text: val };
                    });
                } else {
                    item.texts = [];
                }
                if (item.main_texts) {
                    let __main_texts = String(item.main_texts).trim().split("|.|");
                    item.main_texts = __main_texts.map((it, k) => {
                        let [key, val] = String(it).split("|,|");
                        return { main_text_id: key, main_text: val };
                    });
                } else {
                    item.main_texts = [];
                }
                return item;
            });
            return (ctx.body = {
                code: ResponseCode.success,
                data: reList,
                message: "获取成功！",
            });
        } catch (error) {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: error.message,
                error,
            });
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: *[], message: string}>}
     */
    async insertCompany(ctx) {
        let {
            baseId,
            phoneNumber,
            post,
            company,
            startDate,
            endDate,
            address,
            texts,
            mainTexts,
        } = ctx.request.body || {};
        if (!baseId || typeof baseId != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'baseId'",
            });
        }
        if (!phoneNumber || typeof phoneNumber != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            });
        }
        if (!post || typeof post != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'post'",
            });
        }
        if (!company || typeof company != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'company'",
            });
        }
        if (!startDate || typeof startDate != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'startDate'",
            });
        }
        if (!endDate || typeof endDate != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'endDate'",
            });
        }
        if (!address || typeof address != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'address'",
            });
        }
        if (!texts || texts.length === 0) {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'texts'",
            });
        }
        if (!mainTexts) mainTexts = [];

        let conn = await MysqlConn.getConn();
        try {
            let query = `
                INSERT INTO company (base_id, phone_number, post, company, start_date, end_date, address, update_date,
                                     create_date)
                VALUES (${baseId}, '${phoneNumber}', '${post}', '${company}',
                        '${dayjs(startDate).format("YYYY-MM-DD HH:mm:ss")}',
                        '${dayjs(endDate).format("YYYY-MM-DD HH:mm:ss")}', '${address}',
                        NOW(), NOW())
            `;
            await conn.beginTransaction();
            let { insertId } = await MysqlConn.connQuery(conn, query);
            let __texts = texts.map((t, i) => {
                return `(${insertId},'${t}')`;
            });
            let textsQuery = `
                INSERT INTO company_text (company_id, text)
                VALUES ${__texts.join(",")}
            `;

            await MysqlConn.connQuery(conn, textsQuery);
            if (mainTexts.length > 0) {
                let __mtTexts = mainTexts.map((t, i) => {
                    return `(${insertId},'${t}')`;
                });
                let mTextsQuery = `
                    INSERT INTO company_main (company_id, main_text)
                    VALUES ${__mtTexts.join(",")}
                `;
                await MysqlConn.connQuery(conn, mTextsQuery);
            }
            conn.commit();
            conn.release();
            return (ctx.body = {
                code: ResponseCode.success,
                data: { insertId },
                message: "创建成功！",
            });
        } catch (error) {
            await conn.rollback();
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: error.message,
                error,
            });
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: string}|{code: number, message: string}|{code: number, message: string}|{code: number, message: *, error: *}|{code: number, data: {}, message: string}|{code: number, message: string}|{code: number, message: string}|{code: number, message: string}|{code: number, message: string}>}
     */
    async updateCompany(ctx) {
        let { companyId, phoneNumber, post, company, startDate, endDate, address } =
            ctx.request.body || {};
        if (!companyId || typeof companyId != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'companyId'",
            });
        }
        if (!phoneNumber || typeof phoneNumber != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            });
        }
        if (!post || typeof post != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'post'",
            });
        }
        if (!company || typeof company != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'company'",
            });
        }
        if (!startDate || typeof startDate != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'startDate'",
            });
        }
        if (!endDate || typeof endDate != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'endDate'",
            });
        }
        if (!address || typeof address != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'address'",
            });
        }
        try {
            let query = `
                UPDATE company
                SET phone_number = '${phoneNumber}',
                    post         = '${post}',
                    company      = '${company}',
                    start_date   = '${dayjs(startDate).format("YYYY-MM-DD HH:mm:ss")}',
                    end_date     = '${dayjs(endDate).format("YYYY-MM-DD HH:mm:ss")}',
                    address      = '${address}'
                WHERE id = ${companyId}
            `;
            let result = await MysqlConn.sqlQuery(query);
            return (ctx.body = {
                code: ResponseCode.success,
                data: {},
                message: "修改成功！",
            });
        } catch (error) {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: error.message,
                error,
            });
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, data: {}, message: string}|{code: number, message: string}|{code: number, message: *, error: *}>}
     */
    async deleteCompany(ctx) {
        let { companyId } = ctx.request.body || {};
        if (!companyId || typeof companyId != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'companyId",
            });
        }
        let query = `
            DELETE
            FROM company
            WHERE id = ${companyId}
        `;
        let textQuery = `
            DELETE
            FROM company_text
            WHERE company_id = (${companyId})
        `;
        let tMainQuery = `
            DELETE
            FROM company_main
            WHERE company_id = (${companyId})
        `;
        let conn = await MysqlConn.getConn();
        try {
            await conn.beginTransaction();
            await MysqlConn.connQuery(conn, query);
            await MysqlConn.connQuery(conn, textQuery);
            await MysqlConn.connQuery(conn, tMainQuery);
            conn.commit();
            conn.release();
            return (ctx.body = {
                code: ResponseCode.success,
                data: {},
                message: "删除成功！",
            });
        } catch (error) {
            await conn.rollback();
            return (ctx.body = {
                code: ResponseCode.error,
                message: error.message,
                error,
            });
        }
    }
}

module.exports = new CompanyController();
