/*!
 * indexdbStorage cjs 0.1.0
 * (c) 2020 - 2020 jackness
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
}

(function (LogType) {
    LogType["Success"] = "success";
    LogType["Warn"] = "warn";
    LogType["Error"] = "error";
    LogType["Info"] = "info";
})(exports.LogType || (exports.LogType = {}));
/** IndexDBStorage - 主体 */
var IndexDBStorage = /** @class */ (function () {
    function IndexDBStorage(option) {
        this.name = 'default_db';
        this.storeName = 'default_db_store';
        this.version = 1;
        this.isSupported = !!(window === null || window === void 0 ? void 0 : window.indexedDB);
        this.logger = function () { };
        if (option === null || option === void 0 ? void 0 : option.name) {
            this.name = option.name;
            this.storeName = this.name + "Store";
        }
        if (option === null || option === void 0 ? void 0 : option.version) {
            this.version = option.version;
        }
        if (option === null || option === void 0 ? void 0 : option.logger) {
            this.logger = option.logger;
        }
    }
    IndexDBStorage.prototype.log = function (type, args) {
        this.logger(type, ['[DBS]'].concat(args));
    };
    /** 清除 db */
    IndexDBStorage.prototype.clear = function () {
        var _a = this, isSupported = _a.isSupported, name = _a.name;
        if (isSupported) {
            window.indexedDB.deleteDatabase(name);
        }
    };
    /** 打开db */
    IndexDBStorage.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = window.indexedDB.open(this.name, this.version);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                res.onsuccess = function () {
                                    resolve(res.result);
                                };
                                res.onerror = function (er) {
                                    _this.log(exports.LogType.Warn, ['indexDB 初始化失败', er]);
                                    resolve(undefined);
                                };
                                res.onupgradeneeded = function () {
                                    var db = res.result;
                                    if (!db.objectStoreNames.contains(_this.storeName)) {
                                        var store = db.createObjectStore(_this.storeName, { keyPath: 'name' });
                                        store.createIndex('name', 'name', { unique: true });
                                    }
                                };
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /** 设置 */
    IndexDBStorage.prototype.setItem = function (name, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, storeName, isSupported, db;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, storeName = _a.storeName, isSupported = _a.isSupported;
                        if (!isSupported) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.open()];
                    case 1:
                        db = _b.sent();
                        if (!db) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var transaction = db.transaction(storeName, 'readwrite');
                                var store = transaction.objectStore(storeName);
                                var res = store.get(name);
                                var storeRes;
                                res.onsuccess = function () {
                                    if (res.result === undefined) {
                                        storeRes = store.add({
                                            name: name,
                                            value: value
                                        });
                                    }
                                    else {
                                        storeRes = store.put({
                                            name: name,
                                            value: value
                                        });
                                    }
                                    storeRes.onsuccess = function () {
                                        _this.log(exports.LogType.Success, ["\u5B58\u5165\u6210\u529F name: " + name + " value: ", value]);
                                        resolve(undefined);
                                    };
                                    storeRes.onerror = function (er) {
                                        _this.log(exports.LogType.Warn, ["\u5B58\u5165\u5931\u8D25 name: " + name + " value: ", value, 'error:', er]);
                                        resolve('存入失败');
                                    };
                                };
                                res.onerror = function (er) {
                                    _this.log(exports.LogType.Warn, ["\u5B58\u5165\u5931\u8D25 name: " + name + " value: ", value, 'error:', er]);
                                    resolve('存入失败');
                                };
                            })];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** 获取 */
    IndexDBStorage.prototype.getItem = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, storeName, isSupported, db, transaction, store, res_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, storeName = _a.storeName, isSupported = _a.isSupported;
                        if (!isSupported) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.open()];
                    case 1:
                        db = _b.sent();
                        if (db) {
                            transaction = db.transaction(storeName, 'readwrite');
                            store = transaction.objectStore(storeName);
                            res_1 = store.get(name);
                            return [2 /*return*/, new Promise(function (resolve) {
                                    res_1.onsuccess = function () {
                                        _this.log(exports.LogType.Success, ["\u8BFB\u53D6\u6210\u529F name: " + name + " value: ", res_1.result]);
                                        resolve(res_1.result);
                                    };
                                    res_1.onerror = function (er) {
                                        _this.log(exports.LogType.Warn, ["\u8BFB\u53D6\u5931\u8D25 name: " + name + " error:", er]);
                                        resolve(undefined);
                                    };
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return IndexDBStorage;
}());

exports.IndexDBStorage = IndexDBStorage;
