var sqlite3 = require('sqlite3').verbose(),
    fileName = __dirname + '/../docSet.dsidx',
    id = 0;

/**
 * @method exports.index
 * indexページ
 * @param {Object} req Request Data.
 * @param {Object} res Response Data.
 */
exports.index = function(req, res){
  
  var data = [];
  var db = new sqlite3.Database(fileName);
  db.serialize(function() {

    // 登録単語一覧の取得
    var query = "SELECT id, word, title FROM dic";
    db.each(query, function (err, row) {
      data.push({
        id: row.id,
        word: util.unEscapeStr(row.word),
        title: util.unEscapeStr(row.title)
      });
    });

  });

  db.close();

  // FIXME: async task
  setTimeout(function(){
    console.log(data);
    res.render('index', {
      data: data
    });
  }, 1000);


};

/**
 * @method exports.page
 * 各ページの検索と出力
 * @param {Object} req Request Data.
 * @param {Object} res Response Data.
 */
exports.page = function(req, res){
  
  var wordId = req.param('id'),
      db = new sqlite3.Database(fileName);

  db.serialize(function() {

    // 指定の単語データの出力
    var query = "SELECT word, title, body, pronounce FROM dic WHERE id=" + wordId;
    db.get(query, function (err, row) {
      res.render('page', {
        id: wordId,
        word: util.unEscapeStr(row.word),
        title: util.unEscapeStr(row.title),
        body: util.unEscapeStr(row.body),
        pronounce: util.unEscapeStr(row.pronounce)
      });
    });

  });

  db.close();

};

/**
 * @method exports.add
 * 単語登録フォーム
 * @param {Object} req Request Data.
 * @param {Object} res Response Data.
 */
exports.add = function(req, res){
  // 登録数の取得
  var db = new sqlite3.Database(fileName);
  db.serialize(function() {
    db.each("SELECT count(id) FROM searchIndex", function(err, row) {
      id = row['count(id)'];
    });
  });
  db.close();
  res.render('add');
};

/**
 * @method exports.post
 * postのデータを登録
 * @param {Object} req Request Data.
 * @param {Object} res Response Data.
 */
exports.post = function(req, res) {
  var db = new sqlite3.Database(fileName),
      data = req.body,
      type = "Notation",
      pagePath = "http://localhost:3000/page/";

  id ++;

  db.serialize(function() {

    // 辞書DBに登録
    db.run("INSERT OR IGNORE INTO dic(word, title, body, type, pronounce) VALUES($word, $title, $body, $type, $pronounce)", {
      $word: data.word,
      $title: data.title,
      $body: data.body,
      $type: type,
      $pronounce: data.pronounce

    // indexDBに登録
    }).run("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES($name, $type, $path)", {
      $name: data.word,
      $type: type,
      $path: pagePath + id
    });
  });
  console.log('add data.', id, data);

  db.close();
};
  

var util = {
  /**
   * @method unEscapeStr
   * 表示のためにエスケープした文字列を戻す処理
   * @param str チェックする文字列
   * @return str 処理後の文字列
   */
  unEscapeStr : function(str) {
    str = str.replace(/%26/,"&");
    str = str.replace(/%22/g,'"');
    str = str.replace(/%27/g,"'");
    str = str.replace(/\;/g,";");

    return str;
  }
};
