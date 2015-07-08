# fullcalendar + GoogleCalendarAPI + plainModal

jQueryプラグイン：[fullcalendar](http://fullcalendar.io/)で、[GoogleCalendarAPI](https://console.developers.google.com/flows/enableapi?apiid=calendar)をつかって、イベント情報を読み込み、イベントをクリックすると、Modalウインドウが出る設定（jQueryプラグイン：[plainModal](http://anseki.github.io/jquery-plainmodal/)を使用）を作ったときのメモ書き。

## 初期インストール

### 1. カスタマイズしたデータをダウンロード

```
$ git clone git@github.com:kozaru/fcGcalModal.git
```

#### event情報 （json形式）

```eventlist.js
var eventlist = {
	"event001":{
		"title": "イベント１",
		"discription": "イベント１の説明文です"
	},
	"event002":{
		"title": "イベント２",
		"discription": "イベント２の説明文です"
	}
};
```

#### fullcalendar.js で時間表示を消す（`line 2905`）
オプションが見つけられなかったのです。あれば変更したいです。

```fullcalendar.js
// 時間表示を消す（以下をコメントアウト）
// displayEventTime = view.opt('displayEventTime');
// if (displayEventTime == null) {
// 	displayEventTime = this.computeDisplayEventTime(); // might be based off of range
// }
```

#### gcal.jsで表示する内容を変更 (`line 149`)

```gcal.js
events.push({
	id: entry.id,
	// タイトル
	title: eventlist[entry.summary.substr(0,8)].title, //entry.summary,
	start: entry.start.dateTime || entry.start.date,
	end: entry.end.dateTime || entry.end.date,
	// URL
	url: '#' + entry.summary.substr(0,8),//url,
	location: entry.location,
	description: entry.description
});
```

### 2. 必要なパッケージをインストール

```
$ cd fcGcalModal
$ npm install
```

## fullcalendar + GoogleCalendar

### 1. [Google Calendar API](https://console.developers.google.com/flows/enableapi?apiid=calendar)取得

### 2. Google Calendar 登録

- 登録形式 [eventId]-[イベント名]
- 例：event001-イベント名

### 3. [fullcalendar](http://fullcalendar.io/)の設定

```index.html
<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel='stylesheet' href='node_modules/fullcalendar/dist/fullcalendar.css' />
	<link rel='stylesheet' href='node_modules/bootstrap/dist/css/bootstrap.min.css' />
</head>
<body>

	<!-- calendar用 -->
	<div id='calendar'></div>
	<!-- Modal用 -->
	<div id='eventlist'></div>

	<script src='node_modules/jquery/dist/jquery.min.js'></script>
	<!-- Modal用 -->
	<script src='node_modules/jquery-plainmodal/jquery.plainmodal.min.js'></script>
	<script src='node_modules/moment/moment.js'></script>
	<script src='fullcalendar.js'></script>
	<!-- ローカライズ（日本語）用 -->
	<script src='node_modules/fullcalendar/dist/lang/ja.js'></script>
	<script src='eventlist.js'></script>
	<!-- Googleカレンダー用 -->
	<script src='gcal.js'></script>
	<script src='custom.js'></script>
</body>
</html>
```

```custom.js
$(function() {
  // Google Calendar埋め込み
　var gCalApiKey = '[GoogleカレンダーAPIKey]',
　gCalId = '[GoogleカレンダーID]';
		
  // fullcalendarの設定
  $('#calendar').fullCalendar({
    googleCalendarApiKey: gCalApiKey,
    eventSources: [
      {
          googleCalendarId: gCalId
      }
    ],
    header: {
	    left:   '',
	    center: 'title',
	    right:  ''
    },
    // 表示したい曜日を設定 (水・土）
    hiddenDays: [ 0,1,2,4,5 ],
    views: {
      oneMonth: {
        type: 'basic',
        duration: { months: 1 }
      }
    },
    defaultView: 'oneMonth',
    lang: 'ja'
  });
});
```

## [plainModal](http://anseki.github.io/jquery-plainmodal/)を設定

```custom.js
$(function() {
  // 省略
  // Modalウインドウの設定
  var effect = {
    open: function(duration, complete) {
      this.css({
        display:          'block',
        opacity:          0,
        top:              -50 - this.outerHeight(),
        marginTop:        0
      })
      .animate({opacity: 1, top: 100}, duration, complete);
    },
    close: function(duration, complete) {
      this.animate({
        opacity:          0,
        top:              -50 - this.outerHeight()
      }, duration, function() {
        $(this).css({display: 'none'});
        complete();
      });
    }
  };
  
  // Modalウインドウ用のHTML
  var eventHtml01 = '<div id="',
    eventHtml02 = '" class="modal-content"><div class="modal-header"><div class="plainmodal-close pull-right">&#215;</div><h4 class="modal-title">',
    eventHtml03 = '</h4></div><div class="modal-body"><p>',
    eventHtml04 = '</p></div><div class="modal-footer"><button class="plainmodal-close btn">Close</button></div></div>',

    eventHtml;
    
  $('#calendar').fullCalendar({
	//省略
		// eventをクリックしたときの設定
		eventClick: function(calEvent, jsEvent, view) {
			var modalid = $(this).attr('href');
			$(modalid).plainModal('open');
		},
		// GoogleCalendarを読み込んだあとのcallback
		eventAfterAllRender: function() {
			$('a.fc-event').each(function(){
				var modalid = $(this).attr('href');
				var eventId = modalid.replace(/#/g, "");
				// Modal用のHTMLを追加
				eventHtml = eventHtml01 + eventId + eventHtml02 + eventlist[eventId].title +  eventHtml03 + eventlist[eventId].discription + eventHtml04;
				$('div#eventlist').append(eventHtml);
				$('modalid').plainModal({effect: effect, duration: 300});
			});
		},
	//省略
	});
});
```

## 使用したパッケージなど
- [jquery](https://jquery.com/)
- [fullcalendar](https://github.com/arshaw/fullcalendar)
- [plainModal](https://github.com/anseki/jquery-plainmodal)
- [GoogleCalenderAPI](https://developers.google.com/google-apps/calendar/)
- [Bootstrap](http://getbootstrap.com/)
