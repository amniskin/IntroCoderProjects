var projectHeader = $("<nav class='navbar navbar-default navbar-fixed-top' id='nav'> <h1 class='hidden'> Main Nav </h1> <div class='container-fluid' id='nav-container'> <div class='navbar-header'> <button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar-collapse-1' aria-expanded='false'> <span class='sr-only'>Toggle navigation</span> <span class='icon-bar'></span> <span class='icon-bar'></span> <span class='icon-bar'></span> </button> <a class='navbar-brand' href='#home' id='nav-brand'></a> </div> <div class='collapse navbar-collapse' id='navbar-collapse-1'> <ul class='nav navbar-nav' id='nav-list'> <li><a href='#home'>Intro</a></li> <li><a href='#objectives'>Learning Objectives</a></li> <li><a href='#prereqs'>Prerequisites</a></li> <li class='dropdown'> <a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-        expanded='false'>Steps<span class='caret'></span></a> <ul class='dropdown-menu'> </ul> </li> </ul> </div><!-- /.navbar-collapse --> </div><!-- /.container-fluid --> </nav> <div class='container' id='home'> <header class='row'> <div class='col-sm-12 text-center'> <h2 class='tag'></h2> <h4 class='author'></h4> </div> </header> </div>");

var basicTemplate = $("<div class='container'><section class='section'><div class='row'><div class='col-xs-12 col-sm-8 col-sm-offset-2 content'></div></div></section></div>");



function addNavStep(e) {
  $('nav #nav-list .dropdown-menu').append('<li><a href=#' + e[0] + '>' + e[1] + '</a></li>');
}
function addNavDivider() {
  $('nav #nav-list .dropdown-menu').append("<li role='separator' class='divider'></li>");
}
function makeHeader () {
  projectHeader.find('h2').text($('project-header').attr('tag'));
  projectHeader.find('h4').text("Written by: " + $('project-header').attr('author'));
  projectHeader.find('.container').append($('project-header').children());
  $('project-header').html(projectHeader);
  $('nav #nav-brand').html($(document).find('title').text());
  $('title').text("FVI Projects - " + $('nav #nav-brand').text());
}


var headerSize = "h3",
    scrollList = [],
    numSteps   = 0;

function makeBasic(obj) {
  var thing = basicTemplate.find('.content').html(obj.children());

$('project-header').
$(document).ready(function() {
});
