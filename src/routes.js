const Router = require("koa-router");
const router = new Router();

const UserBaseController = require("./controller/user_base_controller");
const SkillsTypeController = require("./controller/skills_type_controller");
const SkillsController = require("./controller/skills_controller");
const ProjectController = require("./controller/project_controller");
const ProjectTextController = require("./controller/project_text_controller");
const ProjectTipsController = require("./controller/project_tips_controller");
const CompanyController = require("./controller/company_controller");
const CompanyMainController = require("./controller/company_main_controller");
const CompanyTextController = require("./controller/company_text_controller");

// 1. 创建上传目录（不存在自动创建）


router.get("/show/get-base-message", UserBaseController.getMessage);

router.post("/show/create-base-message", UserBaseController.createBase);
router.post("/setting/update-base-message", UserBaseController.updateBase);
router.post("/setting/upload-image", UserBaseController.uploadImage);

// -- skills type --
router.get("/show/get-skills-type", SkillsTypeController.getSKillsType);

// -- skills --
router.get("/show/get-skills", SkillsController.getSKills);

router.post("/setting/add-skills", SkillsController.addSKills);
router.post("/setting/update-skills", SkillsController.updateSKills);
router.post("/setting/delete-skills", SkillsController.deleteSKills);

// -- project --
router.get("/show/get-project", ProjectController.getProjects);

router.post("/setting/add-project", ProjectController.addProject);
router.post("/setting/upload-image-project", ProjectController.uploadProjectImage);
router.post("/setting/update-project", ProjectController.updateProject);
router.post("/setting/delete-project", ProjectController.deleteProjects);

// -- project text --
router.post("/setting/add-project-text", ProjectTextController.addProjectText);
router.post("/setting/delete-project-text", ProjectTextController.deleteProjectText);

// -- project tips --
router.post("/setting/add-project-tips", ProjectTipsController.addProjectTips);
router.post("/setting/delete-project-tips", ProjectTipsController.deleteProjectTips);

// -- company --
router.get("/show/get-company", CompanyController.getCompany);

router.post("/setting/add-company", CompanyController.insertCompany);
router.post("/setting/update-company", CompanyController.updateCompany);
router.post("/setting/delete-company", CompanyController.deleteCompany);

// -- company text --
router.post("/setting/add-company-text", CompanyTextController.addCompanyText);
router.post("/setting/delete-company-text", CompanyTextController.deleteCompanyText);

// -- company main --
router.post("/setting/add-company-main", CompanyMainController.addCompanyMain);
router.post("/setting/delete-company-main", CompanyMainController.deleteCompanyMainText);

module.exports = router;