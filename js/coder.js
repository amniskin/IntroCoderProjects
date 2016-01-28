$(document).ready(function() {
  $('.hint').on('click', function(event) {
    if($(this).hasClass('blur')) {
      event.preventDefault();
      $(this).removeClass('blur');
    } else {
      $(this).addClass('blur');
    }
  });
});

