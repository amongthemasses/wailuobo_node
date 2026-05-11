const App = require("koa");
const MysqlConn = require("../mysql_conn");
const path = require("node:path");
const fs = require("fs");

const { uploadsDir, responseCode } = require("../../config");
const ResponseCode = require("../../config").responseCode;
const staticDir = require("../../config").static;

class ProjectController {


    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     * @returns {Promise<{code:Number,message:String,data:Object}|{code:Number,message:String,error:Error}>}
     */
    async getProjectItem(ctx) {
        let { projectId } = ctx.request.query || {};
        if (!projectId) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'projectId'" };
        }
        let query = `
            SELECT a.*,
                   (SELECT GROUP_CONCAT(bt.id, '|,|', bt.tip SEPARATOR '|.|')
                    FROM project_tips AS bt
                    WHERE a.id = bt.project_id) AS tips,
                   (SELECT GROUP_CONCAT(ct.id, '|,|', ct.text SEPARATOR '|.|')
                    FROM project_text AS ct
                    WHERE a.id = ct.project_id) AS texts
            FROM project AS a
            WHERE a.id = '${projectId}'
        `;
        try {
            let [result] = await MysqlConn.sqlQuery(query);
            if (result) {
                if (result.tips) {
                    result.tips = result.tips.split("|.|").map((it, i) => {
                        let [key, val] = String(it).split("|,|");
                        return { tip_id: Number(key), tip: val };
                    });
                } else {
                    result.tips = [];
                }
                if (result.texts) {
                    result.texts = result.texts.split("|.|").map((it, i) => {
                        let [key, val] = String(it).split("|,|");
                        return { text_id: Number(key), text: val };
                    })
                } else {
                    result.texts = [];
                }
            };
            return ctx.body = { code: ResponseCode.success, data: result ? result : {}, message: "获取成功" };
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, error, message: error.message };
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async getProjects(ctx) {
        let { phoneNumber } = ctx.request.query || {};
        if (!phoneNumber || (typeof phoneNumber != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'phoneNumber'" };
        }
        let query = `
            SELECT a.*,
                   (SELECT GROUP_CONCAT(bt.id, '|,|', bt.tip SEPARATOR '|.|')
                    FROM project_tips AS bt
                    WHERE a.id = bt.project_id) AS tips,
                   (SELECT GROUP_CONCAT(ct.id, '|,|', ct.text SEPARATOR '|.|')
                    FROM project_text AS ct
                    WHERE a.id = ct.project_id) AS texts
            FROM project AS a
            WHERE a.phone_number = '${phoneNumber}' ORDER BY a.create_date ASC
        `;
        try {
            let proList = await MysqlConn.sqlQuery(query);

            let reList = proList.map((it, i) => {
                if (it.tips) {
                    let __tips = String(it.tips).trim().split('|.|');
                    it.tips = __tips.map((v, i) => {
                        let [key, val] = String(v).split("|,|");
                        return { tip_id: Number(key), tip: val };
                    });
                } else {
                    it.tips = [];
                }
                if (it.texts) {
                    let __texts = String(it.texts).trim().split('|.|');
                    it.texts = __texts.map((v, i) => {
                        let [key, val] = String(v).split("|,|");
                        return { text_id: Number(key), text: val };
                    });
                } else {
                    it.texts = [];
                }
                return it;
            });
            return ctx.body = { code: ResponseCode.success, data: reList, message: "获取成功！" };
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, message: error.message, error };
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async addProject(ctx) {
        let { baseId, phoneNumber, name, description, imgUrl, texts, tips } = ctx.request.body || {};
        if (!baseId || (typeof baseId != "number")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'baseId'" };
        }
        if (!phoneNumber || (typeof phoneNumber != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'phoneNumber'" };
        }
        if (!name || (typeof name != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'name'" };
        }
        if (!description || (typeof description != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'description'" };
        }
        if (!imgUrl || (typeof imgUrl != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'imgUrl'" };
        }
        if (!texts || texts.length === 0) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'texts'" };
        }
        if (!tips || tips.length === 0) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'tips'" };
        }
        let [sp, uploadsDir, filename] = imgUrl.trim().split("/");
        let conn = await MysqlConn.getConn();
        try {
            await conn.beginTransaction();
            if (filename) {
                fs.cpSync(path.join(staticDir, imgUrl), path.join(staticDir, `/images/${filename}`));
            }
            let query = `
                INSERT INTO project (base_id, phone_number, name, description, img_url, create_date, update_date)
                VALUES (${baseId}, '${phoneNumber}', '${name}', '${description}', '/images/${filename}', NOW(),
                        NOW())
            `;
            let result = await MysqlConn.connQuery(conn, query);
            let project_id = result.insertId;

            let textVal = texts.map((it, i) => {
                return `(${project_id},'${it}')`;
            })
            let textQuery = `
                INSERT INTO project_text (project_id, text)
                VALUES ${textVal.join(",")}
            `;

            let tipVal = tips.map((it, i) => {
                return `(${project_id},'${it}')`;
            })
            let tipQuery = `
                INSERT INTO project_tips (project_id, tip)
                VALUES ${tipVal.join(",")}
            `;

            await MysqlConn.connQuery(conn, textQuery);

            await MysqlConn.connQuery(conn, tipQuery);
            conn.commit();
            conn.release();
            return ctx.body = { code: ResponseCode.success, data: {}, message: "添加成功！" };
        } catch (error) {
            // await conn.rollback();
            return ctx.body = { code: ResponseCode.error, message: error.message, error };
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
            return ctx.body = { code: responseCode.missingFile, message: "missing parameter 'file'" };
        }
        let file = files.file;
        let netFilepath = `/uploads/${file.newFilename}`;
        try {
            return ctx.body = { code: ResponseCode.success, data: { imageUrl: netFilepath }, message: "图片以上传至服务器" };
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, message: error.message, error };
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async updateProject(ctx) {
        let { id, baseId, phoneNumber, name, description, imgUrl } = ctx.request.body || {};
        if (!id || (typeof id != "number")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'id'" };
        }
        if (!baseId || (typeof baseId != "number")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'baseId'" };
        }
        if (!phoneNumber || (typeof phoneNumber != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'phoneNumber'" };
        }
        if (!name || (typeof name != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'name'" };
        }
        if (!description || (typeof description != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'description'" };
        }
        if (!imgUrl || (typeof imgUrl != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'imgUrl'" };
        }
        let conn = await MysqlConn.getConn()
        try {
            await conn.beginTransaction();
            let query = ``;
            let [resCount] = await MysqlConn.connQuery(conn, `
                SELECT COUNT(id) AS counts
                FROM project
                WHERE img_url = '${imgUrl}'
                  AND id = ${id}
            `);
            let rDF = { img_url: "" };
            if (resCount.counts > 0) {
                query = `
                    UPDATE project
                    SET base_id      = ${baseId},
                        phone_number = '${phoneNumber}',
                        name         = '${name}',
                        description  = '${description}',
                        update_date  = NOW()
                    WHERE id = ${id}
                `;
                rDF.img_url = ""
            } else {
                let [sp, uploads, filename] = imgUrl.trim().split("/");
                fs.cpSync(path.join(staticDir, imgUrl), path.join(staticDir, `/images/${filename}`));
                query = `
                    UPDATE project
                    SET base_id      = ${baseId},
                        phone_number = '${phoneNumber}',
                        name         = '${name}',
                        description  = '${description}',
                        img_url      = '/images/${filename}',
                        update_date  = NOW()
                    WHERE id = ${id}
                `;
                [rDF] = await MysqlConn.connQuery(conn, `
                    SELECT img_url
                    FROM project
                    WHERE id = ${id}
                `);
            }

            let result = await MysqlConn.connQuery(conn, query);
            if (rDF.img_url) { // 存入数据库后删除旧文件
                fs.unlinkSync(path.join(staticDir, rDF.img_url));
            }
            conn.commit();
            conn.release();
            return ctx.body = { code: ResponseCode.success, data: {}, message: "修改成功！" };
        } catch (error) {
            await conn.rollback();
            return ctx.body = { code: ResponseCode.error, message: error.message, error };
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @returns {Promise<{code: number, message: *, error: *}|{code: number, data: {}, message: string}>}
     */
    async deleteProjects(ctx) {
        let { id } = ctx.request.body || {};
        if (!id || (typeof id != "number")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'id'" };
        }
        let query = `
            DELETE
            FROM project
            WHERE id = ${id}
        `;
        let tipQuery = `
            DELETE
            FROM project_tips
            WHERE project_id = ${id}
        `;
        let textQuery = `
            DELETE
            FROM project_text
            WHERE project_id = ${id}
        `;
        let conn = await MysqlConn.getConn();
        try {
            await conn.beginTransaction();
            let rfd = await MysqlConn.connQuery(conn, `
                SELECT img_url
                FROM project
                WHERE id = ${id}
            `);
            await MysqlConn.connQuery(conn, query);
            await MysqlConn.connQuery(conn, tipQuery);
            await MysqlConn.connQuery(conn, textQuery);
            if (rfd.length > 0) {
                fs.unlinkSync(path.join(staticDir, rfd[0].img_url));
            }
            conn.commit();
            conn.release();
            return ctx.body = { code: ResponseCode.success, data: {}, message: "删除成功！" };
        } catch (error) {
            await conn.rollback();
            return ctx.body = { code: ResponseCode.error, message: error.message, error };
        }
    }
}

module.exports = new ProjectController();