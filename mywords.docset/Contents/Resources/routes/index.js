var sqlite3 = require('sqlite3').verbose(),
    fileName = __dirname + '/../docSet.dsidx';

/**
 * @method exports.index
 * indexページ
 * @param req request data.
 * @param res response data.
 */
exports.index = function(req, res){
  
  console.log('----> index');
  
  db = new sqlite3.Database(fileName);
  var data = [];
  db.serialize(function() {

    var query = "SELECT id, word, title FROM dic";
    db.each(query, function (err, row) {
      data.push({
        id: row.id,
        word: row.word,
        title: row.title
      });
      // データ出力
      res.render('index', {
        data: data
      });
    });

  });

  db.close();

};


/**
 * @method exports.add
 * 単語の登録
 * @param req request data.
 * @param res response data.
 */
exports.add = function(req, res){
  
  console.log('----> add');
  var data = {
    id: 1,
    word: "dispatcher",
    title: "発送係; 急送[信]者.",
    body: "<p> CPU(中央処理装置)がタスクを実行するときの実行順序をスケジュールするルーチンを指す.  OS(オペレーティングシステム)の機能単位の一つ.  コード中には、getDispatcherというメソッドとして、ページの名前と遷移先のパスを引数に、ページの切り替えを行っていました。実際に遷移を実行するメソッドと、振り分けを行うメソッドを分けることで、保守しやすくしているようです。</p>",
    type: "Notation",
    pronounce: "ディスパッチャー"
  };

  console.log(data);
//  addRecord(data);
  res.render('add');
};

var addRecord = function(data) {
  db = new sqlite3.Database(fileName);
  var data = [];
  db.serialize(function() {

    db.run("INSERT INTO dic VALUES($id, $word, $title, $body, $type, $pronounce)", {
      $id: data.id,
      $word: data.word,
      $title: data.title,
      $body: data.body,
      $type: data.type,
      $pronounce: data.pronounce
    });
    db.run("INSERT INTO searchIndex VALUES($id, $word, $type, $path)", {
      $id: data.id,
      $word: data.word,
      $type: data.type,
      $path: "http://localhost:3000/page/" + data.id
    });
    console.log('insert end');

  });

  db.close();
};

/**
 * @method exports.page
 * 各ページの検索と出力
 * @param req request data.
 * @param res response data.
 */
exports.page = function(req, res){
  
  var id = req.param('id');

  db = new sqlite3.Database(fileName);
  db.serialize(function() {

    var query = "SELECT word, title, body, pronounce FROM dic WHERE id=" + id;
    db.get(query, function (err, row) {
      // データ出力
      res.render('page', {
        id: id,
        word: row.word,
        title: row.title,
        body: row.body,
        pronounce: row.pronounce
      });
    });

  });

  db.close();

};
