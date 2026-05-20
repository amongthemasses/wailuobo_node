/*
 Navicat Premium Dump SQL

 Source Server         : wailuobo
 Source Server Type    : MySQL
 Source Server Version : 80408 (8.4.8)
 Source Host           : 127.0.0.1:3306
 Source Schema         : wailuobo

 Target Server Type    : MySQL
 Target Server Version : 80408 (8.4.8)
 File Encoding         : 65001

 Date: 20/05/2026 11:49:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for company
-- ----------------------------
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `base_id` int NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `post` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `company` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `update_date` datetime NOT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_bid_pnum` (`base_id`,`phone_number`) USING BTREE,
  KEY `index_bid` (`base_id`) USING BTREE,
  KEY `index_pnum` (`phone_number`) USING BTREE,
  CONSTRAINT `base_id_cp` FOREIGN KEY (`base_id`) REFERENCES `user_base` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of company
-- ----------------------------
BEGIN;
INSERT INTO `company` (`id`, `base_id`, `phone_number`, `post`, `company`, `start_date`, `end_date`, `address`, `update_date`, `create_date`) VALUES (1, 1, '19238057615', 'ads', 'asdf', '2026-01-20 11:44:19', '2026-06-20 11:44:19', 'asdf', '2026-05-20 03:44:27', '2026-05-20 03:44:27');
COMMIT;

-- ----------------------------
-- Table structure for company_main
-- ----------------------------
DROP TABLE IF EXISTS `company_main`;
CREATE TABLE `company_main` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `main_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_id_cid` (`id`,`company_id`) USING BTREE,
  KEY `index_cid` (`company_id`),
  CONSTRAINT `cp_man` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of company_main
-- ----------------------------
BEGIN;
INSERT INTO `company_main` (`id`, `company_id`, `main_text`) VALUES (1, 1, 'asdf');
INSERT INTO `company_main` (`id`, `company_id`, `main_text`) VALUES (2, 1, 'asdf');
COMMIT;

-- ----------------------------
-- Table structure for company_text
-- ----------------------------
DROP TABLE IF EXISTS `company_text`;
CREATE TABLE `company_text` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_id` (`id`,`company_id`) USING BTREE,
  KEY `index_cid` (`company_id`),
  CONSTRAINT `cp_text` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of company_text
-- ----------------------------
BEGIN;
INSERT INTO `company_text` (`id`, `company_id`, `text`) VALUES (1, 1, 'asdf');
INSERT INTO `company_text` (`id`, `company_id`, `text`) VALUES (2, 1, 'asdf');
COMMIT;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `base_id` int NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_id_pnum` (`base_id`,`phone_number`),
  KEY `index_bid` (`base_id`),
  KEY `index_pnum` (`phone_number`),
  CONSTRAINT `base_id_pro` FOREIGN KEY (`base_id`) REFERENCES `user_base` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of project
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for project_text
-- ----------------------------
DROP TABLE IF EXISTS `project_text`;
CREATE TABLE `project_text` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_id_pid` (`id`,`project_id`) USING BTREE,
  KEY `index_pid` (`project_id`),
  CONSTRAINT `pro_text` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of project_text
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for project_tips
-- ----------------------------
DROP TABLE IF EXISTS `project_tips`;
CREATE TABLE `project_tips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `tip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_id_pid` (`id`,`project_id`),
  KEY `index_pid` (`project_id`),
  CONSTRAINT `pro_tips` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of project_tips
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for skills
-- ----------------------------
DROP TABLE IF EXISTS `skills`;
CREATE TABLE `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `base_id` int NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `skills_type_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `power` int NOT NULL,
  `sort` int DEFAULT NULL,
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_name` (`name`) USING BTREE,
  KEY `index_id_pnum` (`base_id`,`phone_number`) USING BTREE,
  KEY `index_id` (`base_id`),
  KEY `index_pnum` (`phone_number`) USING BTREE,
  KEY `type_sk` (`skills_type_id`),
  CONSTRAINT `base_id_sk` FOREIGN KEY (`base_id`) REFERENCES `user_base` (`id`),
  CONSTRAINT `type_sk` FOREIGN KEY (`skills_type_id`) REFERENCES `skills_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of skills
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for skills_type
-- ----------------------------
DROP TABLE IF EXISTS `skills_type`;
CREATE TABLE `skills_type` (
  `id` int NOT NULL,
  `skills_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of skills_type
-- ----------------------------
BEGIN;
INSERT INTO `skills_type` (`id`, `skills_type`) VALUES (1, '前端技术');
INSERT INTO `skills_type` (`id`, `skills_type`) VALUES (2, '后端技术');
INSERT INTO `skills_type` (`id`, `skills_type`) VALUES (3, '开发工具');
INSERT INTO `skills_type` (`id`, `skills_type`) VALUES (4, '软技能');
COMMIT;

-- ----------------------------
-- Table structure for user_base
-- ----------------------------
DROP TABLE IF EXISTS `user_base`;
CREATE TABLE `user_base` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `first_name` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名字',
  `show_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '个人信息表述',
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片地址',
  `user_tip` varchar(255) NOT NULL COMMENT '用户职位标签',
  `phone_number` varchar(11) NOT NULL COMMENT '电话号码',
  `email` char(50) NOT NULL COMMENT '邮箱',
  `address` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '求职位置',
  `weixin` varchar(100) NOT NULL COMMENT '微信号',
  `set_code` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '修改编码',
  `github` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `net_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `update_date` datetime NOT NULL,
  `create_date` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `index_pnum` (`phone_number`),
  UNIQUE KEY `index_pnum_code` (`phone_number`,`set_code`),
  KEY `index_id_pnum` (`id`,`phone_number`) USING BTREE,
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户基础表';

-- ----------------------------
-- Records of user_base
-- ----------------------------
BEGIN;
INSERT INTO `user_base` (`id`, `first_name`, `show_title`, `img_url`, `user_tip`, `phone_number`, `email`, `address`, `weixin`, `set_code`, `github`, `net_address`, `update_date`, `create_date`) VALUES (1, '菜萝卜', '这是一条初始的个人自我描述的信息记得修改哦！', '/images/default.png', '软件开发工程师', '19238057615', '这是初始邮箱信息@163.com', '中国-北海', '这是你的微信号', '158092', 'https://github.com/你的仓库地址', 'http://localhost:8000', '2026-05-20 03:43:36', '2026-05-20 03:43:36');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
