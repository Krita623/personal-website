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
exports.authOptions = void 0;
var credentials_1 = __importDefault(require("next-auth/providers/credentials"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var mysql_1 = require("./mysql");
exports.authOptions = {
    providers: [
        (0, credentials_1.default)({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: function (credentials) {
                return __awaiter(this, void 0, void 0, function () {
                    var user, isPasswordValid, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password)) {
                                    console.log('[Auth] 缺少凭证');
                                    throw new Error('请输入邮箱和密码');
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                console.log("[Auth] \u5C1D\u8BD5\u767B\u5F55\u7528\u6237: ".concat(credentials.email));
                                return [4 /*yield*/, (0, mysql_1.queryOne)("\n            SELECT id, name, email, password, role \n            FROM users \n            WHERE email = ?\n          ", [credentials.email])];
                            case 2:
                                user = _a.sent();
                                if (!user) {
                                    console.log('[Auth] 用户不存在');
                                    throw new Error('邮箱或密码不正确');
                                }
                                return [4 /*yield*/, bcrypt_1.default.compare(credentials.password, user.password)];
                            case 3:
                                isPasswordValid = _a.sent();
                                if (!isPasswordValid) {
                                    console.log('[Auth] 密码无效');
                                    throw new Error('邮箱或密码不正确');
                                }
                                console.log("[Auth] \u7528\u6237\u767B\u5F55\u6210\u529F: ".concat(user.email, ", \u89D2\u8272: ").concat(user.role));
                                // 返回不包含密码的用户对象
                                return [2 /*return*/, {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        role: user.role
                                    }];
                            case 4:
                                error_1 = _a.sent();
                                console.error('[Auth] 授权失败:', error_1);
                                // 抛出具体错误信息，而不是返回null
                                if (error_1 instanceof Error) {
                                    throw error_1;
                                }
                                else {
                                    throw new Error('登录失败，请稍后再试');
                                }
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
        })
    ],
    callbacks: {
        jwt: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var token = _b.token, user = _b.user;
                return __generator(this, function (_c) {
                    if (user) {
                        token.id = user.id;
                        token.name = user.name;
                        token.email = user.email;
                        token.role = user.role;
                    }
                    return [2 /*return*/, token];
                });
            });
        },
        session: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var session = _b.session, token = _b.token;
                return __generator(this, function (_c) {
                    if (token && session.user) {
                        session.user.id = token.id;
                        session.user.name = token.name;
                        session.user.email = token.email;
                        session.user.role = token.role;
                    }
                    return [2 /*return*/, session];
                });
            });
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30天
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development"
};
//# sourceMappingURL=auth.js.map