const { exec } = require('child_process');
const Database = require('better-sqlite3');
const db = new Database('data/sqlite.db', { verbose: console.log }); // db will be stored under /data/sqlite.db

const byteToMbit = byte => .000008 * byte;

// initialize database table with fields: timestamp, provider, speed
// provider: "okta"
// metric: "download" "upload" "latency" "jitter"
// TODO add a "unit(s)" column? "seconds" "bytes" "bits" etc.
// TODO add a "metadata" column as BLOB to store entire result from API
//      actually have a "runs" table and store the result there as a blob.
//      CREATE TABLE IF NOT EXISTS run (id INTEGER PRIMARY KEY, result BLOB NOT NULL, timestamp TEXT DEFAULT CURRENT_TIMESTAMP)
//      then link to the `run_id` in "speedtest" table
// TODO how do you handle different timestamps between "runs" table and "speedtest"
//      table?
// TODO should we call "runs" -> "speedtests" and "speedtest" -> "metrics"
//      to sort by timestamp you would have to join tables
const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS speedtest (
  id INTEGER PRIMARY KEY,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  provider TEXT NOT NULL,
  metric TEXT NOT NULL,
  value REAL,
  unit TEXT NOT NULL
);`);
createTable.run();
// create index on timestamp
const createIndex = db.prepare(
  `CREATE INDEX IF NOT EXISTS idx_speedtest_timestamp ON speedtest (timestamp);`
);
createIndex.run();
// run speedtest and place results in database table
const insertMeasurement = db.prepare(
  `INSERT INTO speedtest (provider, metric, value, unit) VALUES ($provider, $metric, $value, $unit);`
);
const pushMeasurements = db.transaction((measures) => {
  measures.forEach(measure => insertMeasurement.run(measure));
});
// create web client displaying results, or at first returning json/text of db contents
const selectAll = db.prepare(`SELECT * FROM speedtest;`);
// console.log({ selectAll: selectAll.all() });
exec('./bin/speedtest -f json --accept-license --accept-gdpr', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
  }
  if (stderr) {
    console.error(stderr);
  }
  try {
    const res = JSON.parse(stdout);
    const latency = res.ping.latency; // ms
    const jitter = res.ping.jitter; // ms
    const download = byteToMbit(res.download.bandwidth); // Mbit
    const upload = byteToMbit(res.upload.bandwidth); // Mbit
    pushMeasurements([
      { provider: 'ookla', metric: 'download', value: download, unit: 'Mbit' },
      { provider: 'ookla', metric: 'upload', value: upload, unit: 'Mbit' },
      { provider: 'ookla', metric: 'latency', value: latency, unit: 'ms' },
      { provider: 'ookla', metric: 'jitter', value: jitter, unit: 'ms' },
    ]);
    console.log({ res });
    console.log({ selectAll: selectAll.all() });
  } catch (error) {
    console.error(error);
  }
});
/*
{
  res: {
    type: 'result',
    timestamp: '2020-07-03T17:02:08Z',
    ping: { jitter: 0.308, latency: 45.412 },
    download: { bandwidth: 1961779, bytes: 20852648, elapsed: 10713 },
    upload: { bandwidth: 134365, bytes: 538800, elapsed: 4015 },
    packetLoss: 0,
    isp: 'CenturyLink',
    interface: {
      internalIp: '172.17.0.2',
      name: 'eth0',
      macAddr: '02:42:AC:11:00:02',
      isVpn: false,
      externalIp: '66.243.197.225'
    },
    server: {
      id: 30495,
      name: 'Town of Mountain Village',
      location: 'Mountain Village, CO',
      country: 'United States',
      host: 'speedtest.townofmountainvillage.com',
      port: 8080,
      ip: '216.237.245.190'
    },
    result: {
      id: 'ee5e9897-3f25-4e93-b000-bf39a0751013',
      url: 'https://www.speedtest.net/result/c/ee5e9897-3f25-4e93-b000-bf39a0751013'
    }
  }
}
*/
// TODO create web visualization with D3
// TODO run speedtest on interval or something
