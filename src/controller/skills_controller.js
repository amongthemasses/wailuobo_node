const App = require("koa");
const MysqlConn = require("../mysql_conn");
const ResponseCode = require("../../config").responseCode;

class SkillsController {
    /**
     *
     * @param {App.ParameterizedContext} ctx
     */
    async getSKills(ctx) {
        let { phoneNumber } = ctx.request.query || {};
        if (!phoneNumber || typeof phoneNumber != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            });
        }
        let query = `
            SELECT a.id,
                   a.base_id,
                   a.phone_number,
                   a.name,
                   a.power,
                   a.sort,
                   a.update_date,
                   b.id AS skills_type_id,
                   b.skills_type
            FROM skills AS a
                     LEFT JOIN skills_type AS b ON a.skills_type_id = b.id
            WHERE phone_number = ${phoneNumber} ORDER BY b.id, a.sort
        `;
        try {
            let result = await MysqlConn.sqlQuery(query);
            let resList = {};
            result.forEach((item, index) => {
                if (resList[item.skills_type_id]) {
                    resList[item.skills_type_id].push(item);
                } else {
                    resList[item.skills_type_id] = [];
                    resList[item.skills_type_id].push(item);
                }
            });
            return (ctx.body = {
                code: ResponseCode.success,
                data: { list: result ? result : [], obj: resList },
                message: "查询完成",
            });
        } catch (error) {
            return (ctx.body = {
                code: ResponseCode.error,
                message: error.message,
                error,
            });
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     */
    async addSKills(ctx) {
        let { baseId, phoneNumber, skillsTypeId, name, power, sort } =
            ctx.request.body || {};
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
        if (!skillsTypeId || typeof skillsTypeId != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'skillsTypeId'",
            });
        }
        if (!name || typeof name != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'name'",
            });
        }
        if (!power || typeof power != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'power'",
            });
        }
        if (!sort) {
            sort = 0;
        }
        try {
            let skillsTestQuery = `
                SELECT COUNT(id) counts
                FROM skills
                WHERE name = '${name}'
                  AND skills_type_id = ${skillsTypeId} AND phone_number = ${phoneNumber} AND base_id = ${baseId}
            `;
            let [countResult] = await MysqlConn.sqlQuery(skillsTestQuery);
            if (countResult.counts > 0) {
                return (ctx.body = {
                    code: ResponseCode.error,
                    data: [],
                    message: "数据已存在！",
                });
            }
            let skillsTypeQuery = `
                SELECT COUNT(id) counts
                FROM skills
                WHERE skills_type_id = ${skillsTypeId} AND phone_number = '${phoneNumber}' AND base_id = ${baseId}
            `;
            let [countSkillsResult] = await MysqlConn.sqlQuery(skillsTypeQuery);
            if (countSkillsResult.counts >= 5) {
                return (ctx.body = {
                    code: ResponseCode.error,
                    data: [],
                    message: "同一技能类型下，数据上限5条！",
                });
            }
            let val = `'${baseId}','${phoneNumber}','${skillsTypeId}','${name}','${power}','${sort}',NOW(),NOW()`;
            let query = `INSERT INTO skills (base_id, phone_number, skills_type_id, name, power, sort, create_date,
                                             update_date)
                         VALUES (${val})`;
            let result = await MysqlConn.sqlQuery(query);
            return (ctx.body = {
                code: ResponseCode.success,
                data: { insertId: result.insertId },
                message: "插入成功！",
            });
        } catch (error) {
            return (ctx.body = {
                code: ResponseCode.error,
                message: error.message,
                error,
            });
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     */
    async deleteSKills(ctx) {
        let { skillsId } = ctx.request.body || {};
        if (!skillsId || typeof skillsId != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'skillsId'",
            });
        }
        let query = `DELETE
                     FROM skills
                     WHERE id = ${skillsId}`;
        try {
            let result = await MysqlConn.sqlQuery(query);
            return (ctx.body = { code: ResponseCode.success, message: "删除成功！" });
        } catch (error) {
            return (ctx.body = {
                code: ResponseCode.error,
                message: error.message,
                error,
            });
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     */
    async updateSKills(ctx) {
        let { id, baseId, phoneNumber, skillsTypeId, name, power, sort } =
            ctx.request.body || {};
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
        if (!skillsTypeId || typeof skillsTypeId != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'skillsTypeId'",
            });
        }
        if (!name || typeof name != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'name'",
            });
        }
        if (!power || typeof power != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'power'",
            });
        }
        if (!sort || typeof sort != "number") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'sort'",
            });
        }
        let vals = `base_id=${baseId},phone_number='${phoneNumber}',skills_type_id=${skillsTypeId},name='${name}',power='${power}',sort=${sort}`;
        let query = `UPDATE skills
                     SET ${vals}
                     WHERE id = ${id}`;
        try {
            let result = await MysqlConn.sqlQuery(query);
            return (ctx.body = { code: ResponseCode.success, message: "修改成功！" });
        } catch (error) {
            return (ctx.body = {
                code: ResponseCode.error,
                message: error.message,
                error,
            });
        }
    }
}

module.exports = new SkillsController();
