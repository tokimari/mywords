(function(){

  /**
   * @method DOMContentLoaded
   */
  $(function(){
    // postボタンが押されたとき
    $('.x-add-btn').click(function(e){
      onAddBtn(e);
    });
  });

  /**
   * @method onAddBtn
   * @param e
   */
  var onAddBtn = function(e){
    var data = getParams();

    if( util.isValue(data.word) && util.isValue(data.title) && util.isValue(data.pronounce) && util.isValue(data.body) ){
        var data = JSON.stringify({
          word: data.word,
          title: data.title,
          pronounce: data.pronounce,
          body: data.body
        });
        requestPost(data, 'post');
        clearForm();
      } else {
      alert('空欄があります。');
    }

  };

  /**
   * @method getParams
   */
  var getParams = function() {
    return {
      word: util.escapeStr($('.x-input-word').val()),
      title: util.escapeStr($('.x-input-title').val()),
      body: util.escapeStr($('.x-input-body').val()),
      pronounce: util.escapeStr($('.x-input-pronounce').val())
    };
  };

  /**
   * @method clearForm
   */
  var clearForm = function() {
    $('input, textarea').val('');
  };

  /**
   * @class util
   * ツール
   */
  var util = {

    /**
     * @method isValue
     * 値が空文字かどうか判定
     * @return true | false
     */
    isValue: function(value){
      if(value !== null && value !== undefined && value !== false && value !== 0 && value !== ''){
        return true;
      } else {
        return false;
      }
    },

    /**
     * @method escapeStr
     * エスケープ処理（APIに通信前に）
     * @param str チェックする文字列
     * @return str エスケープ後の文字列
     */
    escapeStr : function(str) {
      str = str.replace(/&/g,"%26");
      str = str.replace(/"/g,"%22");
      str = str.replace(/'/g,"%27");
      str = str.replace(/;/g,"\;");

      return str;
    }
  };


  /**
   * @method requestPost
   * サーバにPostリクエストを送る
   * @param json 送信データ(JSON)
   * @param url 送信先path
   */
  var requestPost = function(json, url){
    console.log('requestPost', json);

    $.ajax({
      type: 'post',
      url: url,
      data: json,
      contentType: 'application/json',

      success: function(data, dataType){
        document.location.reload(true);
      }
    });

  }; 

})();
