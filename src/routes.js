const Router = require("koa-router");
const router = new Router();

const UserBaseController = require("./controller/user_base_controller");
const SkillsTypeController = require("./controller/skills_type_controller");
const SkillsController = require("./controller/skills_controller");
const ProjectController = require("./controller/project_controller");

// 1. 创建上传目录（不存在自动创建）


router.get("/get-base-message", UserBaseController.getMessage);
router.post("/create-base-message", UserBaseController.createBase);
router.post("/update-base-message", UserBaseController.updateBase);
router.post("/upload-image", UserBaseController.uploadImage);

// -- skills type --
router.get("/get-skills-type", SkillsTypeController.getSKillsType);

// -- skills --
router.get("/get-skills", SkillsController.getSKills);
router.post("/add-skills", SkillsController.addSKills);
router.post("/update-skills", SkillsController.updateSKills);
router.post("/delete-skills", SkillsController.deleteSKills);

// -- project --
router.get("/get-project", ProjectController.getProjects);
router.post("/add-project", ProjectController.addProject);
router.post("/upload-image-project", ProjectController.uploadProjectImage);
router.post("/update-project", ProjectController.updateProject);
router.post("/delete-project", ProjectController.deleteProjects);

module.exports = router;