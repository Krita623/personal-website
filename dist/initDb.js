"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
exports.ensureAdminUser = ensureAdminUser;
var mysql_1 = require("./mysql");
var bcrypt_1 = require("bcrypt");
var userUtils_1 = require("./userUtils");
/**
 * 初始化数据库表结构
 */
function initDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var adminEmail, adminPassword, adminName, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    console.log('[InitDB] 开始初始化数据库...');
                    // 创建用户表
                    return [4 /*yield*/, (0, mysql_1.query)("\n      CREATE TABLE IF NOT EXISTS users (\n        id VARCHAR(36) PRIMARY KEY,\n        name VARCHAR(50) NOT NULL,\n        email VARCHAR(255) NOT NULL UNIQUE,\n        password VARCHAR(100) NOT NULL,\n        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',\n        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n      )\n    ")];
                case 1:
                    // 创建用户表
                    _a.sent();
                    console.log('[InitDB] 用户表初始化完成');
                    // 创建题解表
                    return [4 /*yield*/, (0, mysql_1.query)("\n      CREATE TABLE IF NOT EXISTS solutions (\n        id VARCHAR(36) PRIMARY KEY,\n        title VARCHAR(100) NOT NULL,\n        difficulty ENUM('\u7B80\u5355', '\u4E2D\u7B49', '\u56F0\u96BE') NOT NULL,\n        category VARCHAR(50) NOT NULL,\n        content TEXT NOT NULL,\n        userId VARCHAR(36) NOT NULL,\n        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n      )\n    ")];
                case 2:
                    // 创建题解表
                    _a.sent();
                    console.log('[InitDB] 题解表初始化完成');
                    // 创建留言表
                    return [4 /*yield*/, (0, mysql_1.query)("\n      CREATE TABLE IF NOT EXISTS messages (\n        id VARCHAR(36) PRIMARY KEY,\n        name VARCHAR(100) NOT NULL,\n        email VARCHAR(255) NOT NULL,\n        content TEXT NOT NULL,\n        isRead BOOLEAN DEFAULT FALSE,\n        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n      )\n    ")];
                case 3:
                    // 创建留言表
                    _a.sent();
                    console.log('[InitDB] 留言表初始化完成');
                    // 添加索引
                    return [4 /*yield*/, (0, mysql_1.query)("\n      CREATE INDEX IF NOT EXISTS idx_userId ON solutions(userId);\n      CREATE INDEX IF NOT EXISTS idx_difficulty ON solutions(difficulty);\n      CREATE INDEX IF NOT EXISTS idx_category ON solutions(category);\n      CREATE INDEX IF NOT EXISTS idx_updatedAt ON solutions(updatedAt);\n      CREATE INDEX IF NOT EXISTS idx_messages_isRead ON messages(isRead);\n    ")];
                case 4:
                    // 添加索引
                    _a.sent();
                    console.log('[InitDB] 索引创建完成');
                    adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
                    adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
                    adminName = process.env.ADMIN_NAME || '管理员';
                    return [4 /*yield*/, ensureAdminUser(adminEmail, adminPassword, adminName)];
                case 5:
                    _a.sent();
                    console.log('[InitDB] 数据库初始化成功');
                    return [2 /*return*/, true];
                case 6:
                    error_1 = _a.sent();
                    console.error('[InitDB] 数据库初始化失败:', error_1);
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * 确保存在管理员用户
 */
function ensureAdminUser(email, password, name) {
    return __awaiter(this, void 0, void 0, function () {
        var existingUser, userId, hashedPassword, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    console.log("[InitDB] \u68C0\u67E5\u7BA1\u7406\u5458\u7528\u6237: ".concat(email));
                    return [4 /*yield*/, (0, userUtils_1.findUserByEmail)(email)];
                case 1:
                    existingUser = _a.sent();
                    if (!existingUser) return [3 /*break*/, 4];
                    console.log('[InitDB] 管理员用户已存在，确保角色为admin');
                    if (!(existingUser.role !== 'admin')) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, mysql_1.execute)("\n          UPDATE users\n          SET role = 'admin'\n          WHERE id = ?\n        ", [existingUser.id])];
                case 2:
                    _a.sent();
                    console.log('[InitDB] 用户角色已更新为admin');
                    _a.label = 3;
                case 3: return [2 /*return*/];
                case 4:
                    // 创建新管理员用户
                    console.log('[InitDB] 创建新管理员用户');
                    userId = (0, mysql_1.generateUUID)();
                    return [4 /*yield*/, (0, bcrypt_1.hash)(password, 10)];
                case 5:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, (0, mysql_1.execute)("\n      INSERT INTO users (id, name, email, password, role)\n      VALUES (?, ?, ?, ?, 'admin')\n    ", [userId, name, email, hashedPassword])];
                case 6:
                    _a.sent();
                    console.log('[InitDB] 管理员用户创建成功');
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error('[InitDB] 创建管理员用户失败:', error_2);
                    throw error_2;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.default = initDatabase;
//# sourceMappingURL=initDb.js.map