const App = require("koa");
const MysqlConn = require("../mysql_conn");
const path = require("node:path");
const fs = require("fs");

const {uploadsDir, responseCode} = require("../../config");
const ResponseCode = require("../../config").responseCode;
const staticDir = require("../../config").static;

class ProjectController {

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async getProjects(ctx) {
        let {phoneNumber} = ctx.request.query || {};
        if (!phoneNumber || (typeof phoneNumber != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'phoneNumber'"};
        }
        let query = `
            SELECT a.*,
                   GROUP_CONCAT(bt.id, '|,|', bt.tip SEPARATOR '|.|')  AS tips,
                   GROUP_CONCAT(ct.id, '|,|', ct.text SEPARATOR '|.|') AS texts,
            FROM project AS a
                     LEFT JOIN project_tips AS bt ON a.id = bt.project_id
                     LEFT JOIN project_text AS ct ON a.id = ct.project_id
            WHERE phone_number = '${phoneNumber}'
        `;
        try {
            let proList = await MysqlConn.sqlQuery(query);

            let reList = proList.map((it, i) => {
                if (it.tips) {
                    let __tips = String(it.tips).trim().split('|.|');
                    it.tips = __tips.map((v, i) => {
                        let [key, val] = String(v).split("|,|");
                        return {tip_id: key, tip: val};
                    });
                } else {
                    it.tips = [];
                }
                if (it.texts) {
                    let __texts = String(it.texts).trim().split('|.|');
                    it.texts = __texts.map((v, i) => {
                        let [key, val] = String(v).split("|,|");
                        return {text_id: key, text: val};
                    });
                } else {
                    it.texts = [];
                }
                return it;
            });
            return ctx.body = {code: ResponseCode.success, data: reList, message: ""};
        } catch (error) {
            return ctx.body = {code: ResponseCode.error, message: error.message, error};
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async addProject(ctx) {
        let {baseId, phoneNumber, name, description, imgUrl, texts, tips} = ctx.request.body || {};
        if (!baseId || (typeof baseId != "number")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'baseId'"};
        }
        if (!phoneNumber || (typeof phoneNumber != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'phoneNumber'"};
        }
        if (!name || (typeof name != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'name'"};
        }
        if (!description || (typeof description != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'description'"};
        }
        if (!imgUrl || (typeof imgUrl != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'imgUrl'"};
        }
        if (!texts || texts.length === 0) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'texts'"};
        }
        if (!tips || tips.length === 0) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'tips'"};
        }
        let [uploadsDir, filename] = imgUrl.trim().split("/");
        let conn = MysqlConn.getConn();
        try {
            fs.renameSync(path.join(staticDir, imgUrl), path.join(staticDir, `/images/${filename}`));
            let query = `
                INSERT INTO project (base_id, phone_number, name, description, img_url, create_date, updte_date)
                VALUES (${baseId}, '${phoneNumber}', '${name}', '${description}', '${imgUrl}', NOW(), NOW())
            `;
            await conn.beginTransaction();

            let result = await MysqlConn.connQuery(conn, query);
            let project_id = result.insertId;

            let textVal = texts.map((it, i) => {
                return `(${project_id},${it})`;
            })
            let textQuery = `
                INSERT INTO project_text (project_id, text)
                VALUES ${textVal.join(",")}
            `;

            let tipVal = tips.map((it, i) => {
                return `(${project_id},${it})`;
            })
            let tipQuery = `
                INSERT INTO project_tip (project_id, tip)
                VALUES ${tipVal.join(",")}
            `;

            await MysqlConn.connQuery(conn, textQuery);

            await MysqlConn.connQuery(conn, tipQuery);
            conn.commit();
            return ctx.body = {code: ResponseCode.success, data: {}, message: "添加成功！"};
        } catch (error) {
            await conn.rollback();
            return ctx.body = {code: ResponseCode.error, message: error.message, error};
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async uploadProjectImage(ctx) {
        let files = ctx.request.files;
        if (!files) {
            return ctx.body = {code: responseCode.missingFile, message: "missing parameter 'file'"};
        }
        let file = files.file;
        let netFilepath = `/uploads/${file.newFilename}`;
        try {
            return ctx.body = {code: ResponseCode.success, data: {imageUrl: netFilepath}, message: ""};
        } catch (error) {
            return ctx.body = {code: ResponseCode.error, message: error.message, error};
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async updateProject(ctx) {
        let {id, baseId, phoneNumber, name, description, imgUrl} = ctx.request.body || {};
        if (!baseId || (typeof baseId != "number")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'baseId'"};
        }
        if (!phoneNumber || (typeof phoneNumber != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'phoneNumber'"};
        }
        if (!name || (typeof name != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'name'"};
        }
        if (!description || (typeof description != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'description'"};
        }
        if (!imgUrl || (typeof imgUrl != "string")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'imgUrl'"};
        }
        let query = `
            UPDATE project
            SET base_id      = ${baseId},
                phone_number = ${phoneNumber},
                description  = ${description},
                img_url      = ${imgUrl};
            WHERE id =
            ${id};
        `;
        try {
            let result = await MysqlConn.sqlQuery(query);
            return ctx.body = {code: ResponseCode.success, data: {}, message: "修改成功！"};
        } catch (error) {
            return ctx.body = {code: ResponseCode.error, message: error.message, error};
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async deleteProjects(ctx) {
        let {id} = ctx.request.body || {};
        if (!id || (typeof id != "number")) {
            return ctx.body = {code: ResponseCode.missingParameter, message: "missing parameter 'id'"};
        }
        let query = `
            DELETE
            FROM project
            WHERE id = ${id}
        `;
        let tipQuery = `
            DELETE
            FROM project_tip
            WHERE project_id = (${id})
        `;
        let textQuery = `
            DELETE
            FROM project_text
            WHERE project_id = (${id})
        `;
        let conn = await MysqlConn.getConn();
        try {
            await conn.beginTransaction();
            await MysqlConn.connQuery(conn, query);
            await MysqlConn.connQuery(conn, tipQuery);
            await MysqlConn.connQuery(conn, textQuery);
            return ctx.body = {code: ResponseCode.success, data: {}, message: "删除成功！"};
        } catch (error) {
            await conn.rollback();
            return ctx.body = {code: ResponseCode.error, message: error.message, error};
        }
    }
}

module.exports = new ProjectController();