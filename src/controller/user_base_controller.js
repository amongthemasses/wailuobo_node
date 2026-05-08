const App = require("koa");
const fs = require("fs");
const path = require("path");

const ResponseCode = require("../../config").responseCode;
const MysqlConn = require("../mysql_conn");
const { responseCode } = require("../../config");
const staticDir = require("../../config").static;

class UserBaseController {


    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     */
    async diffirentSetCode(ctx) {
        let { phoneNumber, setCode } = ctx.request.body || {};
        if (!phoneNumber || typeof phoneNumber != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            });
        }
        if (!setCode || typeof setCode != "string" || setCode.length !== 6) {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'setCode'",
            });
        }
        let query = `SELECT COUNT(id) AS is_true FROM user_base WHERE phone_number = '${phoneNumber}' AND set_code = '${setCode}'`;
        try {
            let [res] = await MysqlConn.sqlQuery(query);
            if (Number(res.is_true)) {
                return ctx.body = { code: responseCode.success, data: {}, message: "验证通过" };
            } else {
                return ctx.body = { code: responseCode.missingParameter, data: {}, message: "编码不正确，请核实手机号与编码是否匹配！" };
            }
        } catch (error) {
            return ctx.body = { code: responseCode.error, error, message: error.message };
        }
    }
    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     */
    async searchUserIsTrue(ctx) {
        let { phoneNumber } = ctx.request.query || {};
        if (!phoneNumber || typeof phoneNumber != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            });
        }
        let query = `SELECT COUNT(id) as id FROM user_base WHERE phone_number = '${phoneNumber}'`;
        try {
            let [result] = await MysqlConn.sqlQuery(query);
            return ctx.body = { code: ResponseCode.success, data: { isTrue: Number(result.id) ? true : false, }, message: "检查完成！" }
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, message: error.message, error }
        }
    }
    /**
     *@param {App.ParameterizedContext} ctx
     */
    async getMessage(ctx) {
        let { phoneNumber } = ctx.request.query || {};
        if (!phoneNumber || typeof phoneNumber != "string") {
            return (ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            });
        }
        let query = `SELECT id,
                            set_code,
                            first_name,
                            show_title,
                            img_url,
                            user_tip,
                            phone_number,
                            email,
                            address,
                            weixin,
                            github,
                            net_address,
                            update_date,
                            create_date
                     FROM user_base
                     WHERE phone_number = ${phoneNumber}`;
        try {
            let [result] = await MysqlConn.sqlQuery(query);
            return ctx.body = { code: responseCode.success, data: result, message: "获取成功！", };
        } catch (error) {
            return ctx.body = { code: responseCode.error, message: error.message, error, };
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     */
    async createBase(ctx) {
        let { phoneNumber, setCode } = ctx.request.body || {};
        if (!phoneNumber || typeof phoneNumber != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            };
        }
        if (!setCode || typeof setCode != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'setCode'",
            };
        }
        if (setCode.length !== 6) {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "error parameter 'set code' length == 6 ",
            };
        }

        let firstName = "菜萝卜";
        let showTitle = "这是一条初始的个人自我描述的信息记得修改哦！";
        let imgUrl = "/images/default.png";
        let userTip = "Nodejs前端开发工程师";
        let email = "这是初始邮箱信息@163.com";
        let address = "中国-北海";
        let weixin = "这是你的微信号";
        let github = "https://github.com/你的仓库地址";
        let netAddress = "http://localhost:8000";
        let updateDate = "NOW()";
        let createDate = "NOW()";
        let values = `'${firstName}','${showTitle}','${imgUrl}','${userTip}','${phoneNumber}','${email}','${address}','${weixin}','${setCode}','${github}','${netAddress}',${updateDate},${createDate}`;
        let insertSql = `INSERT INTO user_base (first_name, show_title, img_url, user_tip, phone_number, email, address,
                                                weixin, set_code,github,net_address,update_date,create_date)
                         VALUES (${values})
        `;
        try {
            let testQuery = `
                SELECT 
                    COUNT(id) AS is_true
                FROM user_base
                WHERE phone_number = ${phoneNumber}
            `;
            let [testResult] = await MysqlConn.sqlQuery(testQuery);
            if (testResult.is_true > 0) {
                throw Error("该号码已存在");
            }
            let result = await MysqlConn.sqlQuery(insertSql);
            return ctx.body = { code: ResponseCode.success, message: "插入成功" };
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, message: error.message, error, };
        }
    }

    /**
     * @param {App.ParameterizedContext} ctx
     *
     */
    async updateBase(ctx) {
        let parametes = ctx.request.body || {};
        let header = ctx.request.header || {};
        let oldSetCode = header["setcode"];
        let phoneNumber = header["phonenumber"];
        let {
            setCode,
            firstName,
            showTitle,
            userTip,
            email,
            address,
            weixin,
            github,
            netAddress
        } = parametes;

        if (!phoneNumber || typeof phoneNumber != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'phoneNumber'",
            };
        }
        if (!oldSetCode || typeof oldSetCode != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'oldSetCode'",
            };
        }
        if (!setCode || typeof setCode != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'setCode'",
            };
        }
        if (setCode.length !== 6) {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "error parameter 'setCode' length == 6 ",
            };
        }
        if (!firstName || typeof firstName != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'firstName'",
            };
        }
        if (!showTitle || typeof showTitle != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'showTitle'",
            };
        }
        if (!userTip || typeof userTip != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'userTip'",
            };
        }
        if (!email || typeof email != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'email'",
            };
        }
        if (!address || typeof address != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'address'",
            };
        }
        if (!weixin || typeof weixin != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'weixin'",
            };
        }
        if (!github || typeof github != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'github'",
            };
        }
        if (!netAddress || typeof netAddress != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter 'netAddress'",
            };
        }

        let values = `first_name='${firstName}',show_title='${showTitle}',user_tip='${userTip}',email='${email}',address='${address}',weixin='${weixin}',set_code='${setCode}',github='${github}',net_address='${netAddress}',update_date=NOW()`;
        let query = `UPDATE user_base SET ${values} WHERE phone_number = '${phoneNumber}' AND set_code = '${oldSetCode}'`;
        try {
            let result = await MysqlConn.sqlQuery(query);
            return ctx.body = { code: ResponseCode.success, message: "修改成功！" };
        } catch (error) {
            return ctx.body = {
                code: ResponseCode.error,
                message: error.message,
                error,
            };
        }
    }

    /**
     *
     * @param {App.ParameterizedContext} ctx
     */
    async uploadImage(ctx) {
        let { file } = ctx.request.files;
        if (!file) {
            return ctx.body = {
                code: responseCode.missingFile,
                message: "missing parameter 'file'",
            };
        }
        let { phoneNumber } = ctx.request.body || {};
        if (!phoneNumber || typeof phoneNumber != "string") {
            return ctx.body = {
                code: ResponseCode.missingParameter,
                message: "missing parameter phoneNumber'",
            };
        }
        let _netFilepath = `/uploads/${file.newFilename}`;
        let conn = await MysqlConn.getConn();
        try {
            await conn.beginTransaction(); // 事务开始
            let dListQuery = `
                SELECT img_url
                FROM user_base
                WHERE phone_number = '${phoneNumber}'
            `;
            let dataList = await MysqlConn.connQuery(conn, dListQuery);
            if (dataList[0].img_url !== "/images/default.png") {
                try {
                    fs.unlinkSync(path.join(staticDir, dataList[0].img_url));
                } catch (error) {
                    console.error(error);
                }
            }
            let reSavePath = `/images/${file.newFilename}`;
            fs.cpSync(
                path.join(staticDir, _netFilepath),
                path.join(staticDir, reSavePath),
            );
            let query = `
                UPDATE user_base
                SET img_url='${reSavePath}'
                WHERE phone_number = '${phoneNumber}'
            `;
            await MysqlConn.connQuery(conn, query);
            conn.commit();
            conn.release(); // 事务结束
            return ctx.body = {
                code: responseCode.success,
                data: { url: reSavePath },
                messgae: "上传成功",
            };
        } catch (error) {
            console.error(error);
            await conn.rollback();
            fs.unlinkSync(file.filepath);
            return ctx.body = {
                code: responseCode.error,
                message: error.message,
                error,
            };
        }
    }
}

module.exports = new UserBaseController();
