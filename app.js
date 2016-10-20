function loadData(file, cb) {
  $.get(file, cb);
}

var Markup = {
  events: function (item) {
    return Mustache.render('<div><img src="{{photo}}"><h3>{{title}}</h3><p><small>{{venue}}</small></p><p><span class="glyphicon glyphicon-calendar"></span>{{date}}</p><a href="{{link.information}}">Learn More</a></div>', item);
  },
  inspire: function (item) {
    return Mustache.render('<div class="row"><div class="col-sm-3"><img src="{{photo}}"></div><div class="col-sm-9"><p>{{name}}</p><blockquote>{{story}}</blockquote><p>{{role}}</p></div></div>', item);
  },
  partner: function(item) {
    return Mustache.render('<div class="col-sm-4"><div class="frame"><img src="{{brand}}"></div></div>', item);
  },
  member: function(item) {
    return Mustache.render('<div class="col-sm-4 member-card"><img src="{{photo}}"><div class="overlay"><p>{{name}}</p><em>{{role}}</em></div></div>', item);
  }
};

function appendListMarkup(sel, list) {
  $(sel).append(list.join(''))
}
function makeListMarkup(res, dataType, condition) {
  var items = JSON.parse(res);
  var itemMarkups = [];
  if(condition) items = items.filter(condition);
  $.each(items, function(key, item) {
      itemMarkups.push(Markup[dataType](item));
  });
  return itemMarkups;
}

var finishedEventCondition = function(item) {
  return item.done === true;
}
var notFinishedEventCondition = function(item) {
  return item.done === false;
}

function defaultHandler (dataType) {
  return function(sel) {
    return function(res) {
      appendListMarkup(sel, makeListMarkup(res, dataType));
    };
  };
}

var CallBack = {
  events: function(dataType) {
    return function(pastEventSel, futureEventSel) {
      return function(res) {
        appendListMarkup(pastEventSel, makeListMarkup(res, dataType, finishedEventCondition));
        appendListMarkup(futureEventSel, makeListMarkup(res, dataType, notFinishedEventCondition));
      };
    };
  },
  inspire: defaultHandler,
  partner: defaultHandler,
  member: defaultHandler
}

function include(dataType){
  return CallBack[dataType](dataType);
}

function goto(sel) {
  var position = $(sel).position();
  return function() {
    scrollTo(position.left, position.top-95);
    $('.navbar-brand').click();
  };
}

function delegateGoto() {
    var href = $(this).data('href');
    console.log(href);
    goto(href)();
}

function toggleClass() {
  console.log('dsds');
  $('#menu').toggleClass('hide');
  $('.navbar-brand .glyphicon').toggleClass('glyphicon-menu-hamburger').toggleClass('glyphicon-remove');
}

function bootStrap() {
  loadData('events.json', include('events')('#past-events', '#future-events'));
  loadData('inspire.json', include('inspire')('#inspiration'));
  loadData('partners.json', include('partner')('#partners .row'));
  loadData('members.json', include('member')('#team-members .row'));

  $('#get-spark-btn').on('click', goto('.about .main'));
  $('.navbar-brand').on('click', toggleClass);
  $('#menu li a').on('click', delegateGoto);
}

$(document).ready(bootStrap);
