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
exports.createMessage = createMessage;
exports.getMessageById = getMessageById;
exports.getAllMessages = getAllMessages;
exports.markMessageAsRead = markMessageAsRead;
exports.markAllMessagesAsRead = markAllMessagesAsRead;
exports.deleteMessage = deleteMessage;
exports.getUnreadMessageCount = getUnreadMessageCount;
var mysql_1 = require("./mysql");
/**
 * 创建新留言
 */
function createMessage(data) {
    return __awaiter(this, void 0, void 0, function () {
        var id, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[MessageUtils] \u521B\u5EFA\u65B0\u7559\u8A00\uFF0C\u6765\u81EA: ".concat(data.name, " (").concat(data.email, ")"));
                    // 验证必要字段
                    if (!data.name || !data.email || !data.content) {
                        console.error('[MessageUtils] 缺少必要的留言字段');
                        throw new Error('缺少必要的留言字段');
                    }
                    id = (0, mysql_1.generateUUID)();
                    now = new Date();
                    // 插入留言
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    INSERT INTO messages (id, name, email, content, isRead, createdAt, updatedAt)\n    VALUES (?, ?, ?, ?, FALSE, ?, ?)\n  ", [
                            id,
                            data.name,
                            data.email,
                            data.content,
                            now,
                            now
                        ])];
                case 1:
                    // 插入留言
                    _a.sent();
                    return [4 /*yield*/, getMessageById(id)];
                case 2: 
                // 获取创建的留言
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 通过ID获取留言
 */
function getMessageById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[MessageUtils] \u83B7\u53D6\u7559\u8A00\uFF0CID: ".concat(id));
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT id, name, email, content, isRead, createdAt, updatedAt\n    FROM messages\n    WHERE id = ?\n  ", [id])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 获取所有留言
 */
function getAllMessages() {
    return __awaiter(this, arguments, void 0, function (onlyUnread) {
        var sql;
        if (onlyUnread === void 0) { onlyUnread = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[MessageUtils] \u83B7\u53D6".concat(onlyUnread ? '未读' : '所有', "\u7559\u8A00"));
                    sql = "\n    SELECT id, name, email, content, isRead, createdAt, updatedAt\n    FROM messages\n  ";
                    if (onlyUnread) {
                        sql += " WHERE isRead = FALSE";
                    }
                    sql += " ORDER BY createdAt DESC";
                    return [4 /*yield*/, (0, mysql_1.query)(sql)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * 标记留言为已读
 */
function markMessageAsRead(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[MessageUtils] \u6807\u8BB0\u7559\u8A00\u4E3A\u5DF2\u8BFB\uFF0CID: ".concat(id));
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    UPDATE messages\n    SET isRead = TRUE, updatedAt = NOW()\n    WHERE id = ?\n  ", [id])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result > 0];
            }
        });
    });
}
/**
 * 标记所有留言为已读
 */
function markAllMessagesAsRead() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[MessageUtils] \u6807\u8BB0\u6240\u6709\u7559\u8A00\u4E3A\u5DF2\u8BFB");
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    UPDATE messages\n    SET isRead = TRUE, updatedAt = NOW()\n    WHERE isRead = FALSE\n  ")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result > 0];
            }
        });
    });
}
/**
 * 删除留言
 */
function deleteMessage(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[MessageUtils] \u5220\u9664\u7559\u8A00\uFF0CID: ".concat(id));
                    return [4 /*yield*/, (0, mysql_1.execute)("\n    DELETE FROM messages\n    WHERE id = ?\n  ", [id])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result > 0];
            }
        });
    });
}
/**
 * 获取未读留言数量
 */
function getUnreadMessageCount() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[MessageUtils] 获取未读留言数量');
                    return [4 /*yield*/, (0, mysql_1.queryOne)("\n    SELECT COUNT(*) as count\n    FROM messages\n    WHERE isRead = FALSE\n  ")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.count) || 0];
            }
        });
    });
}
exports.default = {
    createMessage: createMessage,
    getMessageById: getMessageById,
    getAllMessages: getAllMessages,
    markMessageAsRead: markMessageAsRead,
    markAllMessagesAsRead: markAllMessagesAsRead,
    deleteMessage: deleteMessage,
    getUnreadMessageCount: getUnreadMessageCount
};
//# sourceMappingURL=messageUtils.js.map