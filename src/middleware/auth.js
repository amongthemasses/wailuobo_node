const App = require("koa");
const Jwt = require("jsonwebtoken");
const ResponseCode = require("../../config").responseCode;
const AuthConfig = require("../../config").auth;
const notTokenModule = ["user"];

class authMiddleware {

    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     * @param {App.Next} next 
     */
    static async middleware(ctx, next) {
        // 检查是否需要验证
        let UrlnotTokenModule = notTokenModule.some((val) => {
            return String(ctx.request.originalUrl).search(val) != -1;
        });
        if (UrlnotTokenModule) { // 不需要验证
            await next();
        } else { // 需要验证
            let token = ctx.request.header.authorization;
            if (token) {
                let tokenValue;
                try {
                    tokenValue = Jwt.verify(token, AuthConfig.secretKey);
                } catch (error) {
                    return ctx.body = { code: ResponseCode.invalidAccessToken, message: "客户端 token 过期" };
                }
                if (tokenValue.type == "access") {
                    await next();
                } else {
                    return ctx.body = { code: ResponseCode.error, message: "客户端携带 token 没有访问权限" };
                }
            } else {
                return ctx.body = { code: ResponseCode.error, message: "客户端 token 不存在" };
            }
        }
    }
}

module.exports = authMiddleware;