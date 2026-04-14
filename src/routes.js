const Router = require("koa-router");
const multer = require("multer");
const router = new Router();
const UserBaseController = require("./controller/user_base_controller");


// 1. 创建上传目录（不存在自动创建）
const uploadDir = path.join(__dirname, '../public/uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

// 2. 配置 multer 存储
const storage = multer.diskStorage({
    // 上传目录
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    // 文件名：时间戳 + 原始后缀（防止重名覆盖）
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const filename = Date.now() + ext
        cb(null, filename)
    }
})

// 3. 初始化上传（限制文件大小 5MB）
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
})

router.get("/get-base-message", UserBaseController.getMessage);
router.post("/create-base-message", UserBaseController.createBase);
router.post("/upload-image", upload.single('image'), UserBaseController.uploadImage);

module.exports = router;