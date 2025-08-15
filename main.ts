import duckdb from '@duckdb/duckdb-wasm';

async function setupDB() {
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

  // Instantiate the asynchronus version of DuckDB-Wasm
  const worker = new Worker(bundle.mainWorker!, { type: "module" });
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  const con = await db.connect()
  return con
}

const con = await setupDB();

const res = await con.query(`
    SELECT * FROM generate_series(1, 100) t(v)
`);

console.log(res)