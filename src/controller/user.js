const App = require("koa");
const Jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const ResponseCode = require("../../config").responseCode;
const AuthConfig = require("../../config").auth;

module.exports = class UserController {

    /**
     * 
     * @param {App.ParameterizedContext}
     */
    static async userRegister(ctx) {
        let parametes = ctx.request.body || {};
        if (!parametes.username || (typeof parametes.username != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'username'" };
        }
        if (!parametes.password || (typeof parametes.password != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'password'" };
        }
        let hashPwd = await bcryptjs.hash(parametes.password, 10);
        return ctx.body = { code: ResponseCode.success, pwd: hashPwd };
    }

    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     */
    static async userLogin(ctx) {
        let parametes = ctx.request.body || {};
        if (!parametes.username || (typeof parametes.username != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'username'" };
        }
        if (!parametes.password || (typeof parametes.password != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'password'" };
        }
        try {
            let _hashPwd = "$2b$10$uNGrTejZg9q5DzI8DJMEsuTFHUis4gaBmHVj5gnLu1adXQiO5l8QG"; // 数据库数据
            let result = await bcryptjs.compare(parametes.password, _hashPwd);

            if (!result) {
                return ctx.body = { code: ResponseCode.error, message: "密码不正确" };
            }
            let refreshToken = Jwt.sign({ usernmae: parametes.usernmae, type: "refresh" }, AuthConfig.secretKey, { expiresIn: AuthConfig.refreshExpiresIn });
            let accessToken = Jwt.sign({ usernmae: parametes.usernmae, type: "access" }, AuthConfig.secretKey, { expiresIn: AuthConfig.accessExpiresIn });
            return ctx.body = { code: ResponseCode.success, tokens: { refreshToken, accessToken }, message: "登录成功" };
        } catch (error) {
            return ctx.body = { code: ResponseCode.error, message: error.message, error };
        }

    }

    /**
     * 
     * @param {App.ParameterizedContext} ctx 
     */
    static async refreshToken(ctx) {
        let parametes = ctx.request.body || {};
        if (!parametes.refreshToken || (typeof parametes.refreshToken != "string")) {
            return ctx.body = { code: ResponseCode.missingParameter, message: "missing parameter 'refreshToken'" }
        }
        let tokenValue;
        try {
            tokenValue = Jwt.verify(parametes.refreshToken, AuthConfig.secretKey);
        } catch (error) {
            return ctx.body = { code: ResponseCode.invalidRefreshToken, message: "无效的 refresh token 请登录" };
        };
        if (tokenValue.type == "refresh") {
            let accessToken = Jwt.sign({ username: tokenValue.usernmae, type: "access" }, AuthConfig.secretKey, { expiresIn: AuthConfig.accessExpiresIn });
            return ctx.body = { code: ResponseCode.success, accessToken, message: "access token 刷新成功" }
        } else {
            return ctx.body = { code: ResponseCode.error, message: "客户端错误 refresh token 无效" };
        }
    }
}