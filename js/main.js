$(document).ready(function() {
  $('.showcase').height(window.innerHeight - 100);

  $(document).scroll(function(event) {
    var scrollStep = 300,
        numShowcases = $('project-showcase').size();
  });

//  $( document ).mousemove(function( event ) {
//    var h = $('.showcase').height(),
//        s = $('.innerShow').height();
//    $('.showcase').scrollTop( (event.pageY - 90) * s / (h + 90));
//  });
});
