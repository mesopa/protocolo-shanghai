
var player = new Plyr('#player');

player.on('play', function(event){
  $(this).addClass('plyr--init-play');
});

$(document).ready ( function(){
  var videoPopUpTrigger = $('.js-video-popup');

  if ( videoPopUpTrigger ) {
    videoPopUpTrigger.magnificPopup({
      type: 'inline',
      preloader: false,
      modal: true,
    });

    var modalPlayer = new Plyr('#modal-player');

    modalPlayer.on('play', function(event){
      $(this).addClass('plyr--init-play');
    });

    $(document).on('click', '.js-popup-modal-dismiss', function(event){
      event.preventDefault();
      $.magnificPopup.close();
    });
  }
});