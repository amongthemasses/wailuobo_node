const App = require("koa");
const fs = require("fs");
const ResponseCode = require("../../config").responseCode;
const MysqlConn = require("../mysql_conn");
const { responseCode } = require("../../config");

class UserBaseController {
    /**
     *@param {App.ParameterizedContext} ctx
     */
    async getMessage(ctx) {
        let parametes = ctx.query || {};
        if (!parametes.phoneNumber || (typeof parametes.phoneNumber != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'phone number'" };
        }
        let phoneNumber = parametes.phoneNumber;
        let query = `SELECT id,first_name,show_title,img_url,user_tip,phone_number,email,address,weixin,create_date FROM user_base WHERE phone_number=${phoneNumber}`;
        try {
            let result = await MysqlConn.sqlQeury(query);
            ctx.body = { code: responseCode.success, data: result, message: "获取成功！" };
        } catch (error) {
            ctx.body = { code: responseCode.error, error: error.message, error };
        }
    }

    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     */
    async createBase(ctx) {
        let parametes = ctx.body || {};
        let { phoneNumber, setCode } = parametes;
        if (!phoneNumber || (typeof phoneNumber != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'phone number'" };
        }
        if (!setCode || (typeof setCode != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'set code'" };
        }
        if (setCode.length !== 6) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "error parameter 'set code' length == 6 " };
        }
        let firstName = "菜络卜";
        let showTitle = "这是一条初试的个人自我描述的信息记得修改哦！";
        let imgUrl = "/images/defalut_user.png";
        let userTip = "Nodejs前端开发工程师";
        let email = "这是事例邮件@163.com";
        let address = "中国";
        let weixin = "thisisyourweixin";
        let createDate = "NOW()";
        let values = `${firstName},${showTitle},${imgUrl},${userTip},${phoneNumber},${email},${address},${weixin},${setCode},${createDate}`;
        let insertSql = `INSERT INTO user_base (first_name,show_title,img_url,user_tip,phone_number,email,address,weixin,set_code,create_date) VALUES (${values})`;
        try {
            let result = await MysqlConn.sqlQeury(insertSql);
            return ctx.body = { code: ResponseCode.success, message: "插入成功" };
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, message: error.message, error };
        }
    }

    async updateBase() {
        let parametes = ctx.body || {};
        let { phoneNumber, setCode, firstName, showTitle, userTip, email, address, weixin } = parametes;


        if (!phoneNumber || (typeof phoneNumber != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'phone number'" };
        }
        if (!setCode || (typeof setCode != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'set code'" };
        }
        if (setCode.length !== 6) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "error parameter 'set code' length == 6 " };
        }
        if (!firstName || (typeof firstName != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'first name'" };
        }
        if (!showTitle || (typeof showTitle != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'show title'" };
        }
        if (!userTip || (typeof userTip != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'user tip'" };
        }
        if (!email || (typeof email != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'email'" };
        }
        if (!address || (typeof address != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'address'" };
        }
        if (!weixin || (typeof weixin != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'weixin'" };
        }

        let values = `first_name=${firstName},show_title=${showTitle},img_url=${imgUrl},user_tip=${userTip},email=${email},address=${address},weixin=${weixin}`;
        let query = `UPDATE user_base SET ${values} WHERE phone_number=${phoneNumber} AND set_code=${setCode}`;
        try {
            let result = await MysqlConn.sqlQeury(query);
            return ctx.body = { code: ResponseCode.success, message: "修改成功！" };
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, message: error.message, error };
        }

    }

    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     */
    async uploadImage(ctx) {
        let file = ctx.file;
        let { phoneNumber, setCode } = ctx.request.body;
        if (!file) {
            return ctx.body = { code: responseCode.missingFile, message: "missing parameter 'file'" };
        }
        let fileAddres = `/public/uploads/${file.filename}`;
        let conn = MysqlConn.getConn();
        try {
            await MysqlConn.connQuery(conn, "BENGIN"); // 事务开始
            let dataList = await MysqlConn.connQuery(`SELECT img_url  FROM user_base WHERE phone_number=${phoneNumber} AND set_code=${setCode}`);
            await fs.unlink(dataList[0].img_url);
            await MysqlConn.connQuery(`UPDATE user_base SET img_url=${fileAddres} WHERE phone_number=${phoneNumber} AND set_code=${setCode}`);
            await MysqlConn.connQuery(conn, "COMMIT"); // 事务结束
            return ctx.body = {
                code: responseCode.success,
                data: {
                    url: fileAddres,
                    name: file.originalname,
                    size: file.size,
                    databaseResult: result
                },
                messgae: "上传成功"
            };
        } catch (error) {
            await fs.unlink(fileAddres);
            await MysqlConn.connQuery(conn, "ROLLBACK");
            return ctx.body = { code: responseCode.error, message: error.message, error };
        }
    }
}

module.exports = new UserBaseController();