$(document).ready(function() {
  $('.hint').on('click', function(event) {
    if($(this).hasClass('blur')) {
      event.preventDefault();
      $(this).removeClass('blur');
    } else {
      $(this).addClass('blur');
    }
  });
  $(document).keydown(function() {
    if (event.keyCode == 74 || event.keyCode == 83 || event.keyCode == 40) { // J or S or DownArrow
      $('body').scrollTop($('body').scrollTop() + 40);
    } else if (event.keyCode == 75 || event.keyCode == 87) {
      $('body').scrollTop($('body').scrollTop() - 40);
    }
  });
});

