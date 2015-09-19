// あらかじめアプリ登録して取得
var CONSUMER = {
    "key" : "9780338bcffe68b5cb661fc0bf69ba03",
    "secret" : "09ddff6be28cddb1"
};

// ユーザの自前アカウントで取ってきてもらってもいいし、アプリ固有のを埋め込んでもいい
var ACCESS = {
    "screen_name" : "",
    "key" : "",
    "secret" : ""
};

// url : APIのURL。GETクエリを含むもの
// callBackFunc : コールバック関数　第一引数にAPIアクセスの結果が連想配列のObjectで渡る
// onerror : Functionをセットすると、scriptタグ埋め込みに失敗した時の挙動を定義可
function getFlickrAPI(url, callBackFunc, onerror){
    var parameters = {
        oauth_signature_method: "HMAC-SHA1",
        oauth_consumer_key: CONSUMER['key'],
        oauth_callback: callBackFunc,
        oauth_version: "1.0"
    };
    var api_url = url;
    var message = {
        method: "GET",
        action: api_url,
        parameters: parameters
    };
    var secretKeys = {
        "consumerSecret" : CONSUMER['secret'],
        "tokenSecret" : ""
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, secretKeys);

    var signed_url = OAuth.addToURL(api_url, parameters);

    console.log( signed_url )

    var ele = document.createElement("script");

    if(is('Function', onerror)){
        ele.onerror = onerror;
    }

    var head = document.getElementsByTagName('head').item(0);
    ele.type = "text/javascript";
    ele.src = signed_url;
    head.appendChild(ele);
}

function getRequestToken( callBackFunc ){

    var parameters = {
        oauth_signature_method: "HMAC-SHA1",
        oauth_consumer_key: CONSUMER['key'],
        oauth_callback: callBackFunc,
        oauth_version: "1.0"
    };
    var api_url = "https://www.flickr.com/services/oauth/request_token";

    var message = {
        method: "GET",
        action: api_url,
        parameters: parameters
    };
    var secretKeys = {
        "consumerSecret" : CONSUMER['secret'],
        "tokenSecret" : ""
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, secretKeys);

    var signed_url = OAuth.addToURL(api_url, parameters);
/*
    var ele = document.createElement("script");

    if(is('Function', onerror)){
        ele.onerror = onerror;
    }

    var head = document.getElementsByTagName('head').item(0);
    ele.type = "text/javascript";
    ele.src = signed_url;
    head.appendChild(ele);
*/

   var options = {
      type: message.method,
      url: signed_url,
      success: function(d, dt) {
                                 console.log(d);
                                 d.match(/oauth_token=([^&]+)&oauth_token_secret=([^&]+)/);
                                 getAccessToken( RegExp.$1 );
        },
    };
    $.ajax(options); // 送信
}


function getAccessToken( request_token ){
    var parameters = {
        oauth_token: request_token
    };
    var api_url = "https://www.flickr.com/services/oauth/authorize";

    var message = {
        method: "GET",
        action: api_url,
        parameters: parameters
    };

    var signed_url = OAuth.addToURL(api_url, parameters);

    console.log(signed_url);
/*
   var options = {
      type: message.method,
      url: signed_url,
      success: function(d, dt) {
            var iframe = document.createElement("iframe");
            document.body.appendChild(iframe);
            var iframe_document = iframe.contentWindow.document;
            iframe_document.open();
            iframe_document.write(d);
            iframe_document.close();
      },
    };
    $.ajax(options); // 送信
*/
/*
    var ele = document.createElement("script");

    if(is('Function', onerror)){
        ele.onerror = onerror;
    }

    var head = document.getElementsByTagName('head').item(0);
    ele.type = "text/javascript";
    ele.src = signed_url;
    head.appendChild(ele);
*/
//    location.href = signed_url;

    cb = window.open(signed_url, "_blank", 'location=no,toolbar=no,clearcache=yes,clearsessioncache=yes');
    cb.addEventListener('load', function(e) {
        var loc = e.url;    // 読み込みを開始したURL
        console.log("e.url");
        console.log(e.url);
        // リダイレクトURLへ飛んだことを確認する
        if (loc.indexOf("callback_request_token") != -1) {
            // パラメータ取得
            var params = getQueryParams(loc);
            // stateの整合性を確認
            if (params['state'] != state) {
                alert("not match state parameter.");
                return;
            }
            cb.close();
        }
    });

}



function authorizeFlickr(url, callBackFunc, onerror){
    var api_url = url;
    var parameters = {
        oauth_token: "72157658546265246-bc0418f0012f2251",
        perms:       "read"
    };

    var signed_url = OAuth.addToURL(api_url, parameters);

    console.log( signed_url )

    var ele = document.createElement("script");

    if(is('Function', onerror)){
        ele.onerror = onerror;
    }

    var head = document.getElementsByTagName('head').item(0);
    ele.type = "text/javascript";
    ele.src = signed_url;
    head.appendChild(ele);
}


function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}
