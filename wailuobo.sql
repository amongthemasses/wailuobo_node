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

 Date: 08/05/2026 17:57:02
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of company
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for company_main
-- ----------------------------
DROP TABLE IF EXISTS `company_main`;
CREATE TABLE `company_main` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `main_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of company_main
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for company_text
-- ----------------------------
DROP TABLE IF EXISTS `company_text`;
CREATE TABLE `company_text` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of company_text
-- ----------------------------
BEGIN;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  KEY `sk_ty` (`skills_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  PRIMARY KEY (`id`,`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户基础表';

-- ----------------------------
-- Records of user_base
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
