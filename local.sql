/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 80043
 Source Host           : localhost:3306
 Source Schema         : local

 Target Server Type    : MySQL
 Target Server Version : 80043
 File Encoding         : 65001

 Date: 02/04/2026 09:43:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bm_enum
-- ----------------------------
DROP TABLE IF EXISTS `bm_enum`;
CREATE TABLE `bm_enum`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `bm_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bm_enum
-- ----------------------------
INSERT INTO `bm_enum` VALUES (1, '销售部');
INSERT INTO `bm_enum` VALUES (2, '研发部');
INSERT INTO `bm_enum` VALUES (3, '设计部');
INSERT INTO `bm_enum` VALUES (4, '技术部');

-- ----------------------------
-- Table structure for infos
-- ----------------------------
DROP TABLE IF EXISTS `infos`;
CREATE TABLE `infos`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `old` int(0) NOT NULL,
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `bm_id` int(0) NOT NULL COMMENT '部门编号',
  `xc` int(0) NOT NULL COMMENT '薪酬',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of infos
-- ----------------------------
INSERT INTO `infos` VALUES (1, '刘伟', 20, '男', '12345678769', 1, 8000);
INSERT INTO `infos` VALUES (2, '刘伯温', 21, '男', '1234557890', 5, 10000);
INSERT INTO `infos` VALUES (3, '诸葛亮', 22, '男', '1234567894', 1, 8400);

SET FOREIGN_KEY_CHECKS = 1;
