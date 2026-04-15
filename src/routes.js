const Router = require("koa-router");
const router = new Router();

const UserBaseController = require("./controller/user_base_controller");
const SkillsTypeController = require("./controller/skills_type_controller");
const SkillsController = require("./controller/skills_controller");

// 1. 创建上传目录（不存在自动创建）


router.get("/get-base-message", UserBaseController.getMessage);
router.post("/create-base-message", UserBaseController.createBase);
router.post("/update-base-message", UserBaseController.updateBase);
router.post("/upload-image", UserBaseController.uploadImage);

// -- skills type --
router.get("/get-skills-type", SkillsTypeController.getSKillsType);

// -- skills --
router.get("/get-skills", SkillsController.getSKills);
router.get("/add-skills", SkillsController.addSKills);
router.get("/update-skills", SkillsController.updateSKills);
router.get("/delete-skills", SkillsController.deleteSKills);

// -- project --

module.exports = router;