const Koa = require("koa");
const KoaStatic = require("koa-static");
const KoaBody = require('koa-body').koaBody;
const Cors = require("@koa/cors");
const path = require("path");
const fs = require("fs");

const router = require("./src/routes")
const Config = require("./config");
// const AuthMiddleware = require("./src/middleware/auth");
const AipAuthMiddleware = require("./src/middleware/aip_auth");

const app = new Koa();

// -- 跨域 --
app.use(Cors({
    origin: (ctx) => {
        // return Config.cors.origin;
        return ctx.get("Origin") || Config.cors.origin;
    }, credentials: Config.cors.credentials
}));

// -- body 解析 --
const dir = Config.uploadsDir;
!fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });
app.use(KoaBody({
    multipart: true, // 允许上传文件
    formidable: {
        uploadDir: dir, keepExtensions: true, // 保留文件后缀
        maxFileSize: 10 * 1024 * 1024, // 最大 10MB
        onFileBegin: (name, file) => {
            const ext = path.extname(file.originalFilename);
            const __name = Date.now() + ext;
            file.__path = `${dir}/${__name}`;
            file.__name = __name;
        },
    }
}))
// -- 中间件 --
// app.use(AuthMiddleware.middleware);
// app.use((ctx,next)=>{});
app.use(AipAuthMiddleware.middleware);

// -- 路由 --
app.use(router.routes(), router.allowedMethods({}));

// -- 静态资源 --
app.use(KoaStatic(Config.static,{
     maxage: 604800000 // 7天 * 24小时 * 60分 * 60秒 * 1000毫秒
}));

app.listen(Config.port, () => {
    console.log(`服务器地址：http://${Config.host}:${Config.port}`)
});