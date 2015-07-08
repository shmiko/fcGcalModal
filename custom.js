$(function() {
  // Google Calendar埋め込み
	var gCalApiKey = '[GoogleカレンダーAPIKey]',
	gCalId = '[GoogleカレンダーID]';

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

  // fullcalendarの設定
	$('#calendar').fullCalendar({
		// Google Calendar埋め込み
		googleCalendarApiKey: gCalApiKey,
		eventSources: [
			{
					googleCalendarId: gCalId
			}
		],
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
    // カレンダーHeaderの設定
    header: {
	    left:   '',
	    center: 'title',
	    right:  ''
    },
    // 表示したい曜日を設定 (水・土）
    hiddenDays: [ 0,1,2,4,5 ],
    // 1ヶ月のみ表示
    views: {
      oneMonth: {
        type: 'basic',
        duration: { months: 1 }
      }
    },
    defaultView: 'oneMonth',
    // 日本語
    lang: 'ja'
  });
});