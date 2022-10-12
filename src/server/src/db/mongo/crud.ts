export function create(dbCtxt: any) {
  // colName : collection name 
  function col(colName: string) {
    return dbCtxt?.db?.collection(colName)
  }

  function insert(colName: string, document: object) {
    return col(colName).insert(document)
  }

  return { insert };
}