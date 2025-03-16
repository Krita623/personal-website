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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = testConnection;
exports.query = query;
exports.queryOne = queryOne;
exports.execute = execute;
exports.insert = insert;
exports.generateUUID = generateUUID;
var promise_1 = __importDefault(require("mysql2/promise"));
// 创建数据库连接池
var pool = promise_1.default.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'algorithmweb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// 测试数据库连接
function testConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, rows, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log('[MySQL] 尝试测试数据库连接...');
                    // 打印环境变量（仅指示是否存在，不显示实际值）
                    console.log("[MySQL] \u73AF\u5883\u53D8\u91CF\u72B6\u6001\uFF1A\n      MYSQL_HOST: ".concat(process.env.MYSQL_HOST ? '已设置' : '未设置', "\n      MYSQL_PORT: ").concat(process.env.MYSQL_PORT ? '已设置' : '未设置', "\n      MYSQL_DATABASE: ").concat(process.env.MYSQL_DATABASE ? '已设置' : '未设置', "\n      MYSQL_USER: ").concat(process.env.MYSQL_USER ? '已设置' : '未设置', "\n      MYSQL_PASSWORD: ").concat(process.env.MYSQL_PASSWORD ? '已设置' : '(密码不显示)', "\n    "));
                    return [4 /*yield*/, pool.getConnection()];
                case 1:
                    connection = _a.sent();
                    console.log('[MySQL] 成功获取数据库连接');
                    return [4 /*yield*/, connection.query('SELECT 1 as test')];
                case 2:
                    rows = (_a.sent())[0];
                    connection.release();
                    console.log('[MySQL] 连接测试成功');
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    console.error('[MySQL] 数据库连接测试失败:', error_1);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 执行SQL查询
function query(sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, pool.query(sql, params)];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
                case 2:
                    error_2 = _a.sent();
                    console.error('[MySQL] 查询执行失败:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 执行单个SQL查询并返回第一个结果
function queryOne(sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        var results, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, query(sql, params)];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.length > 0 ? results[0] : null];
                case 2:
                    error_3 = _a.sent();
                    console.error('[MySQL] 查询单个结果失败:', error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 执行数据修改操作并返回影响的行数
function execute(sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, pool.execute(sql, params)];
                case 1:
                    result = (_a.sent())[0];
                    return [2 /*return*/, result.affectedRows];
                case 2:
                    error_4 = _a.sent();
                    console.error('[MySQL] 执行修改失败:', error_4);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 执行数据插入操作并返回插入的ID
function insert(sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, pool.execute(sql, params)];
                case 1:
                    result = (_a.sent())[0];
                    return [2 /*return*/, result.insertId || ''];
                case 2:
                    error_5 = _a.sent();
                    console.error('[MySQL] 执行插入失败:', error_5);
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 生成随机UUID (不依赖数据库函数)
function generateUUID() {
    var hexChars = '0123456789abcdef';
    var uuid = '';
    for (var i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        }
        else if (i === 14) {
            uuid += '4'; // Version 4 UUID
        }
        else if (i === 19) {
            uuid += hexChars[(Math.random() * 4) | 8]; // Variant
        }
        else {
            uuid += hexChars[Math.floor(Math.random() * 16)];
        }
    }
    return uuid;
}
// 导出默认对象
exports.default = {
    testConnection: testConnection,
    query: query,
    queryOne: queryOne,
    execute: execute,
    insert: insert,
    generateUUID: generateUUID
};
//# sourceMappingURL=mysql.js.map