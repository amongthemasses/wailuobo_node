const Router = require("koa-router");
const router = new Router();
const HelloController = require("./controller/hello");
const UserController = require("./controller/user");

router.get("/hello", HelloController.getHello);
// router.get("/hello2", (ctx)=>{});

/** 用户模块 */
router.post("/user/register", UserController.userRegister);
router.post("/user/login", UserController.userLogin);
router.post("/user/refresh-token", UserController.refreshToken);

module.exports = router;