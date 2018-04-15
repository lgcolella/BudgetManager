/*Per mantenere la funzione require nel bundle Webpack*/
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
/**/
var sqlite3 = requireFunc('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
 
db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");
 
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 13; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();
 
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});
 
db.close();