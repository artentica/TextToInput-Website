$('.subsection-nav.api-nav.on-waypoint').click(function(){
  $('.subsection-nav.api-nav.on-waypoint').toggleClass("expanded");
});

function centerMain() {
    var footer = $('footer');
    var header = $('header');
    var main = $('main');
    //var window = $(window);

    var taken = header.outerHeight(true) + footer.outerHeight(true);
    var availableHeight = $(window).height() - main.outerHeight() - taken;
    main.css('top', availableHeight > 0 ? availableHeight / 2 : 0);
}

$(window).on('resize load', function() {
    centerMain();
});

function notify(text) {

    var notification = $('<li />').text(text).css({
      left: 320
    })
    notifications = $('.notifications');
    notifications.append(notification);
    notification.animate({
      left: 0
    }, 300, function() {

      $(this).delay(3000).animate({
        left: 320
      }, 200, function() {

        $(this).slideUp(100, function() {
          $(this).remove()
        })
      })
    })
  }
