"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
function create(dbCtxt) {
    // colName : collection name 
    function col(colName) {
        var _a;
        return (_a = dbCtxt === null || dbCtxt === void 0 ? void 0 : dbCtxt.db) === null || _a === void 0 ? void 0 : _a.collection(colName);
    }
    function insert(colName, document) {
        return col(colName).insert(document);
    }
    return { insert };
}
exports.create = create;
