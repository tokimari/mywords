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

//  console.log(data);
 // addRecord(data);
  res.render('add');
};

var addRecord = function(data) {
  console.log('addRecord', data.word);
  db = new sqlite3.Database(fileName);
  var data = [];
  db.serialize(function() {
  
    var id = 0;
    // 登録数の取得
    db.each("SELECT count(id) FROM searchIndex", function(err, row) {
      id = row['count(id)'];
    });
    db.run("INSERT INTO dic VALUES($id, $word, $title, $body, $type, $pronounce)", {
      $id: id + 1,
      $word: "ワード", // FIXME: data.wordだと登録されない。エンコードの問題？？
      $title: data.title,
      $body: data.body,
      $type: "Notation",
      $pronounce: data.pronounce
    });
    db.run("INSERT INTO searchIndex VALUES($id, $name, $type, $path)", {
      $id: id + 1,
      $name: data.word,
      $type: "Notation",
      $path: "http://localhost:3000/page/" + (id+1)
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

/**
 * @method exports.post
 */
exports.post = function(req, res) {
  console.log('POST-->', req.body);
  addRecord(req.body);
};
