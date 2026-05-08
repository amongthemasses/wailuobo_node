const ResponseCode = require("../../config").responseCode;
const MysqlConn = require("../mysql_conn");

//  模块验证白名单
const ModuleWhiteMenu = ["show", "uploads", "images"];

class AipAuthMiddleware {
    /**
     *
     * @param {App.ParameterizedContext} ctx
     * @param {App.Next} next
     */
    static async middleware(ctx, next) {
        // 检查是否需要验证
        let UrlNotSetCode = ModuleWhiteMenu.some((val) => {
            return String(ctx.request.originalUrl).search(val) !== -1;
        });
        if (UrlNotSetCode) { // 不需要验证
            await next();
        } else { // 需要验证
            let { setcode, phonenumber } = ctx.request.header || {};
            let props = (setcode !== undefined && phonenumber !== undefined);
            // 有时间这里 加redis缓存， 优化mysql访问量
            if (props) {
                let query = `
                    SELECT COUNT(id) AS id
                    FROM user_base
                    WHERE phone_number = ${phonenumber}
                      AND set_code = ${setcode}
                `;
                let [result] = await MysqlConn.sqlQuery(query);
                if (result.id > 0) {
                    await next();
                } else {
                    return ctx.body = { code: ResponseCode.invalidAccessToken, message: "嘿 bro！ 你的信息验证不通过！请规范使用" };
                }
            } else {
                return ctx.body = { code: ResponseCode.invalidAccessToken, message: "客户端没有访问权限" };
            }
        }
    }
}

module.exports = AipAuthMiddleware;