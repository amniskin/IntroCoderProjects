$(document).ready(function() {
  $('.hint').on('click', function() {
    if($(this).hasClass('blur')) {
      $(this).removeClass('blur');
    } else {
      $(this).addClass('blur');
    }
  });
});

