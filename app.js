const Koa = require("koa");
const KoaStatic = require("koa-static")
const Bodyparser = require("koa-bodyparser");
const Cors = require("@koa/cors");

const router = require("./src/routes")
const Config = require("./config");
const AuthMiddleware = require("./src/middleware/auth");

const app = new Koa();

// -- 跨域 --
app.use(Cors({
    origin: (ctx) => {
        // return Config.cors.origin;
        return ctx.get("Origin") || Config.cors.origin;
    },
    credentials: Config.cors.credentials
}));

// -- 静态资源 --
app.use(KoaStatic(Config.static));

// -- body 解析 --
app.use(Bodyparser());

// -- 中间件 --
app.use(AuthMiddleware.middleware);
// app.use((ctx,next)=>{});

// -- 路由 --
app.use(router.routes(), router.allowedMethods({}));

app.listen(Config.port, () => {
    console.log(`服务器地址：http://localhost:${Config.port}`)
});