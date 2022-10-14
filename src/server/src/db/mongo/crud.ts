export function create(dbCtxt: any) {
  // colName : collection name 
  function col(colName: string) {
    return dbCtxt?.db?.collection(colName);
  }

  async function insert(colName: string, document: object) {
    return col(colName).insert(document);
  }

  async function insertOne(colName: string, document: object) {
    return col(colName).insertOne(document);
  }

  async function find(colName: string, query: object) {
    const data = await col(colName).find(query);
    return await data.toArray();
  }

  async function findOne(colName: string, query: object) {
    const data = await col(colName).findOne(query) || {};
    return data;
  }

  async function updateOne(colName: string, findQuery: object, updateQuery: object) {
    const data = await col(colName).updateOne(findQuery, updateQuery) || {};
    return data;
  }

  return { insert, find, findOne, insertOne, updateOne };
}