"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
function create(dbCtxt) {
    // colName : collection name 
    function col(colName) {
        var _a;
        return (_a = dbCtxt === null || dbCtxt === void 0 ? void 0 : dbCtxt.db) === null || _a === void 0 ? void 0 : _a.collection(colName);
    }
    async function insert(colName, document) {
        return col(colName).insert(document);
    }
    async function insertOne(colName, document) {
        return col(colName).insertOne(document);
    }
    async function find(colName, query) {
        const data = await col(colName).find(query);
        return await data.toArray();
    }
    async function findOne(colName, query) {
        const data = await col(colName).findOne(query) || {};
        return data;
    }
    async function updateOne(colName, findQuery, updateQuery) {
        const data = await col(colName).updateOne(findQuery, updateQuery) || {};
        return data;
    }
    return { insert, find, findOne, insertOne, updateOne };
}
exports.create = create;
