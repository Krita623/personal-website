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
exports.generateId = generateId;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.userExists = userExists;
exports.findUserById = findUserById;
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.validateUserCredentials = validateUserCredentials;
exports.isUserAdmin = isUserAdmin;
exports.setUserAsAdmin = setUserAsAdmin;
var bcrypt_1 = require("bcrypt");
var mysql_1 = require("./mysql");
/**
 * 用户相关工具函数
 * 提供用户身份验证、创建等功能
 */
/**
 * 生成随机的UUID
 */
function generateId() {
    return (0, mysql_1.generateUUID)();
}
/**
 * 哈希密码
 */
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, bcrypt_1.hash)(password, 10)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 验证密码
 */
function verifyPassword(hashedPassword, candidatePassword) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, bcrypt_1.compare)(candidatePassword, hashedPassword)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    console.error('[UserUtils] 密码验证失败:', error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * 检查用户是否存在
 */
function userExists(email) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[UserUtils] \u68C0\u67E5\u7528\u6237\u662F\u5426\u5B58\u5728: ".concat(email));
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT id FROM users WHERE email = ?\n  ", [email])];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, !!user];
            }
        });
    });
}
/**
 * 通过ID查找用户
 */
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[UserUtils] \u901A\u8FC7ID\u67E5\u627E\u7528\u6237: ".concat(id));
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT id, name, email, password, role, createdAt, updatedAt \n    FROM users \n    WHERE id = ?\n  ", [id])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 通过邮箱查找用户
 */
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[UserUtils] \u901A\u8FC7\u90AE\u7BB1\u67E5\u627E\u7528\u6237: ".concat(email));
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT id, name, email, password, role, createdAt, updatedAt \n    FROM users \n    WHERE email = ?\n  ", [email])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 创建新用户
 */
function createUser(data) {
    return __awaiter(this, void 0, void 0, function () {
        var id, hashedPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[UserUtils] \u521B\u5EFA\u65B0\u7528\u6237: ".concat(data.name, " (").concat(data.email, ")"));
                    id = (0, mysql_1.generateUUID)();
                    return [4 /*yield*/, hashPassword(data.password)];
                case 1:
                    hashedPassword = _a.sent();
                    // 插入用户记录
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    INSERT INTO users (id, name, email, password, role)\n    VALUES (?, ?, ?, ?, ?)\n  ", [
                            id,
                            data.name,
                            data.email,
                            hashedPassword,
                            data.role || 'user'
                        ])];
                case 2:
                    // 插入用户记录
                    _a.sent();
                    return [4 /*yield*/, findUserById(id)];
                case 3: 
                // 获取创建的用户
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 更新用户信息
 */
function updateUser(id, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var setClauses, params, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("[UserUtils] \u66F4\u65B0\u7528\u6237\u4FE1\u606F\uFF0CID: ".concat(id));
                    setClauses = [];
                    params = [];
                    // 动态构建更新字段
                    if (updates.name !== undefined) {
                        setClauses.push('name = ?');
                        params.push(updates.name);
                    }
                    if (updates.email !== undefined) {
                        setClauses.push('email = ?');
                        params.push(updates.email);
                    }
                    if (!(updates.password !== undefined)) return [3 /*break*/, 2];
                    setClauses.push('password = ?');
                    _b = (_a = params).push;
                    return [4 /*yield*/, hashPassword(updates.password)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 2;
                case 2:
                    if (updates.role !== undefined) {
                        setClauses.push('role = ?');
                        params.push(updates.role);
                    }
                    // 总是更新updatedAt
                    setClauses.push('updatedAt = NOW()');
                    // 添加ID参数
                    params.push(id);
                    if (!(setClauses.length <= 1)) return [3 /*break*/, 4];
                    console.log('[UserUtils] 没有要更新的字段');
                    return [4 /*yield*/, findUserById(id)];
                case 3: return [2 /*return*/, _c.sent()];
                case 4: 
                // 执行更新
                return [4 /*yield*/, (0, mysql_1.execute)("\n    UPDATE users\n    SET ".concat(setClauses.join(', '), "\n    WHERE id = ?\n  "), params)];
                case 5:
                    // 执行更新
                    _c.sent();
                    return [4 /*yield*/, findUserById(id)];
                case 6: 
                // 获取更新后的用户
                return [2 /*return*/, _c.sent()];
            }
        });
    });
}
/**
 * 删除用户
 */
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[UserUtils] \u5220\u9664\u7528\u6237\uFF0CID: ".concat(id));
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    DELETE FROM users\n    WHERE id = ?\n  ", [id])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result > 0];
            }
        });
    });
}
/**
 * 验证用户登录
 */
function validateUserCredentials(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, isPasswordValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[UserUtils] \u9A8C\u8BC1\u7528\u6237\u767B\u5F55: ".concat(email));
                    return [4 /*yield*/, findUserByEmail(email)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        console.log('[UserUtils] 用户不存在');
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, verifyPassword(user.password, password)];
                case 2:
                    isPasswordValid = _a.sent();
                    if (!isPasswordValid) {
                        console.log('[UserUtils] 密码无效');
                        return [2 /*return*/, null];
                    }
                    console.log('[UserUtils] 用户验证成功');
                    return [2 /*return*/, user];
            }
        });
    });
}
/**
 * 检查用户是否是管理员
 */
function isUserAdmin(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[UserUtils] \u68C0\u67E5\u7528\u6237\u662F\u5426\u662F\u7BA1\u7406\u5458\uFF0CID: ".concat(userId));
                    return [4 /*yield*/, findUserById(userId)];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.role) === 'admin'];
            }
        });
    });
}
/**
 * 设置用户为管理员
 */
function setUserAsAdmin(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[UserUtils] \u8BBE\u7F6E\u7528\u6237\u4E3A\u7BA1\u7406\u5458\uFF0CID: ".concat(userId));
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    UPDATE users\n    SET role = 'admin', updatedAt = NOW()\n    WHERE id = ?\n  ", [userId])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result > 0];
            }
        });
    });
}
exports.default = {
    hashPassword: hashPassword,
    verifyPassword: verifyPassword,
    userExists: userExists,
    findUserById: findUserById,
    findUserByEmail: findUserByEmail,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    validateUserCredentials: validateUserCredentials,
    isUserAdmin: isUserAdmin,
    setUserAsAdmin: setUserAsAdmin
};
//# sourceMappingURL=userUtils.js.map