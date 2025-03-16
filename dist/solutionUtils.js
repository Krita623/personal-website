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
exports.getAllSolutions = getAllSolutions;
exports.getUserSolutions = getUserSolutions;
exports.getSolutionById = getSolutionById;
exports.createSolution = createSolution;
exports.updateSolution = updateSolution;
exports.deleteSolution = deleteSolution;
exports.isSolutionOwnedByUser = isSolutionOwnedByUser;
exports.getSolutionCount = getSolutionCount;
exports.getUserSolutionCount = getUserSolutionCount;
var mysql_1 = require("./mysql");
/**
 * 获取所有题解
 */
function getAllSolutions() {
    return __awaiter(this, void 0, void 0, function () {
        var solutions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[SolutionUtils] 获取所有题解');
                    return [4 /*yield*/, (0, mysql_1.query)("\n    SELECT id, title, difficulty, category, content, userId, createdAt, updatedAt\n    FROM solutions\n    ORDER BY createdAt DESC\n  ")];
                case 1:
                    solutions = _a.sent();
                    return [2 /*return*/, solutions];
            }
        });
    });
}
/**
 * 获取用户的所有题解
 */
function getUserSolutions(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var solutions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SolutionUtils] \u83B7\u53D6\u7528\u6237\u9898\u89E3\uFF0C\u7528\u6237ID: ".concat(userId));
                    return [4 /*yield*/, (0, mysql_1.query)("\n    SELECT id, title, difficulty, category, content, userId, createdAt, updatedAt\n    FROM solutions\n    WHERE userId = ?\n    ORDER BY createdAt DESC\n  ", [userId])];
                case 1:
                    solutions = _a.sent();
                    return [2 /*return*/, solutions];
            }
        });
    });
}
/**
 * 通过ID获取题解
 */
function getSolutionById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SolutionUtils] \u83B7\u53D6\u9898\u89E3 ID: ".concat(id));
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT id, title, difficulty, category, content, userId, createdAt, updatedAt\n    FROM solutions\n    WHERE id = ?\n  ", [id])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 创建新题解
 */
function createSolution(data) {
    return __awaiter(this, void 0, void 0, function () {
        var id, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SolutionUtils] \u521B\u5EFA\u65B0\u9898\u89E3\uFF0C\u6807\u9898: ".concat(data.title));
                    // 验证必要字段
                    if (!data.title || !data.difficulty || !data.category || !data.content || !data.userId) {
                        console.error('[SolutionUtils] 缺少必要的题解字段');
                        throw new Error('缺少必要的题解字段');
                    }
                    id = (0, mysql_1.generateUUID)();
                    now = new Date();
                    // 插入题解
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    INSERT INTO solutions (id, title, difficulty, category, content, userId, createdAt, updatedAt)\n    VALUES (?, ?, ?, ?, ?, ?, ?, ?)\n  ", [
                            id,
                            data.title,
                            data.difficulty,
                            data.category,
                            data.content,
                            data.userId,
                            now,
                            now
                        ])];
                case 1:
                    // 插入题解
                    _a.sent();
                    return [4 /*yield*/, getSolutionById(id)];
                case 2: 
                // 获取创建的题解
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 更新题解
 */
function updateSolution(id, data) {
    return __awaiter(this, void 0, void 0, function () {
        var setClauses, params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SolutionUtils] \u66F4\u65B0\u9898\u89E3\uFF0CID: ".concat(id));
                    setClauses = [];
                    params = [];
                    // 动态构建更新字段
                    if (data.title !== undefined) {
                        setClauses.push('title = ?');
                        params.push(data.title);
                    }
                    if (data.difficulty !== undefined) {
                        setClauses.push('difficulty = ?');
                        params.push(data.difficulty);
                    }
                    if (data.category !== undefined) {
                        setClauses.push('category = ?');
                        params.push(data.category);
                    }
                    if (data.content !== undefined) {
                        setClauses.push('content = ?');
                        params.push(data.content);
                    }
                    // 总是更新updatedAt
                    setClauses.push('updatedAt = ?');
                    params.push(new Date());
                    // 添加ID参数
                    params.push(id);
                    if (!(setClauses.length <= 1)) return [3 /*break*/, 2];
                    console.log('[SolutionUtils] 没有要更新的字段');
                    return [4 /*yield*/, getSolutionById(id)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: 
                // 执行更新
                return [4 /*yield*/, (0, mysql_1.execute)("\n    UPDATE solutions\n    SET ".concat(setClauses.join(', '), "\n    WHERE id = ?\n  "), params)];
                case 3:
                    // 执行更新
                    _a.sent();
                    return [4 /*yield*/, getSolutionById(id)];
                case 4: 
                // 获取更新后的题解
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 删除题解
 */
function deleteSolution(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SolutionUtils] \u5220\u9664\u9898\u89E3\uFF0CID: ".concat(id));
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    DELETE FROM solutions\n    WHERE id = ?\n  ", [id])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result > 0];
            }
        });
    });
}
/**
 * 检查题解是否属于用户
 */
function isSolutionOwnedByUser(solutionId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var solution;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SolutionUtils] \u68C0\u67E5\u9898\u89E3\u6240\u6709\u6743, ID: ".concat(solutionId, ", \u7528\u6237ID: ").concat(userId));
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT id\n    FROM solutions\n    WHERE id = ? AND userId = ?\n  ", [solutionId, userId])];
                case 1:
                    solution = _a.sent();
                    return [2 /*return*/, !!solution];
            }
        });
    });
}
/**
 * 获取题解数量
 */
function getSolutionCount() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[SolutionUtils] 获取题解总数');
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT COUNT(*) as count\n    FROM solutions\n  ")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.count) || 0];
            }
        });
    });
}
/**
 * 获取用户题解数量
 */
function getUserSolutionCount(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SolutionUtils] \u83B7\u53D6\u7528\u6237\u9898\u89E3\u603B\u6570\uFF0C\u7528\u6237ID: ".concat(userId));
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT COUNT(*) as count\n    FROM solutions\n    WHERE userId = ?\n  ", [userId])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.count) || 0];
            }
        });
    });
}
exports.default = {
    getAllSolutions: getAllSolutions,
    getSolutionById: getSolutionById,
    getUserSolutions: getUserSolutions,
    createSolution: createSolution,
    updateSolution: updateSolution,
    deleteSolution: deleteSolution,
    isSolutionOwnedByUser: isSolutionOwnedByUser,
    getSolutionCount: getSolutionCount,
    getUserSolutionCount: getUserSolutionCount
};
//# sourceMappingURL=solutionUtils.js.map