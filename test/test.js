const assert = require('assert');
const s = require('sqlite3').verbose();
const db = new s.Database('./test/test.db');

db.serialize(() => {
  db.each(`select * from test_db`, (err, data) => console.log(data));
});

db.close();

describe('function name', () => {
  it('should name something', () => {
    const actual = 1;
    const expected = 1;
    assert.deepStrictEqual(actual, expected);
  });
});
