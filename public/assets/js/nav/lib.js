/**
 * studio beentrepreneur development team
 * 2014
 * @author      Vizzca Indra Pratama
 * @email       vizzcaindra@gmail.com
 * @web         vizzcaindra.beentrepreneur.co.id
 * @development studio.beentrepreneur.co.id
 */

if (!(window.history && history.pushState)) {
    alert('Your browser not support to history js. please update your browser');
}

$(document).on('click','li.child a', function(evt) { 
  var title         = this.textContent;
  var curr_url      = $(this).attr("href");

  getData(curr_url);

  history.pushState(null, title, curr_url);
  evt.preventDefault();
});

var getData = function(url) {
    $.ajax({
      headers    : { 'X-Content-Only' : 'true' },
      type       : "GET",
      url        : url + "?token=true",
      cache      : false,
      beforeSend : function() {
                      animationStart();
                   }
    }).done(function(content) {
      animationStop();
      $("#basecontent").empty();
      $("#basecontent").append(content);
    }).error(function(httpObj, textStatus) {
      // alert(httpObj.status);
      alert("Content not found");
    });
};

var animationStop = function() {
  $("#animate").removeClass('animate').addClass('animate');
  $("#animate-load").removeClass('animate-load').addClass('animate-load');

  $("#animate").animate({
    opacity: 0.00
  }, 100);
};

var animationStart = function() {
  $("#animate").animate({
    opacity: 0.80
  }, 100);
};

/*
 * This Function to handle child html
 */

var basecontent = "basecontent";
var seccontent  = "data";
var usesecond   = false;

if (!(window.history && history.pushState)) {
  $(".history-message").fadeIn();
}

/**
 * Navigation function
 */

$(document).on('click','.navigation', function(evt) { 
  var title         = this.textContent;
  var curr_url      = $(this).attr("navigation");
  var target        = $(this).attr('navigation-target');

  var redirect = "";

  if(target == undefined) {
    getDatas(setUrl(curr_url));
    redirect = '';
  }
  else {
    getDatas(setUrl(target));
    redirect = setUrl(curr_url);
  }

  history.pushState(null, title, redirect);
  evt.preventDefault();
});

$(document).on('change','select.navigation', function(evt) { 
  var title         = this.textContent;
  var selectedid    = $(this).attr("id");
  var baseTarget    = $(this).attr('second-target');
  var curr_url      = $('select#' + selectedid +'.navigation > option.xnavigation:selected').attr("navigation");

  if(baseTarget == undefined)
    usesecond = true;
  else
    usesecond = false;
  
  getDatas(setUrl(curr_url));

  history.pushState(null, title, '');
  evt.preventDefault();
});

/**
 * Search Handler Function
 */
$(document).on('keyup','input.navigation-search', function(evt) { 
  var title    = this.textContent;
  var curr_url = $(this).attr("navigation");
  var q        = $(this).val();

  usesecond = true;
  getDatas(setUrl(curr_url+"?search=true&q="+q));
  
  history.pushState(null, title, '');
  evt.preventDefault();
});

/**
 * Delete Handler Function With Message
 */
$(document).on('click','.navigation-message', function(evt) {
  var title    = this.textContent;
  var curr_url = $(this).attr("navigation");
  var target   = $(this).attr('navigation-target');
  var confirms = $(this).attr('confirm');
  var confirmMessage = $(this).attr('confirm-message');

  confirms = confirms == undefined ? "false" : confirms;

  if(confirms == "true") {
    confirmMessage = confirmMessage == undefined ? "Here message in setting atributt confirm-message." : confirmMessage;

    if(confirm(confirmMessage)) {
      sendData('GET', setUrl(target), null, "json", "");

      if(target != undefined)
        setTimeout( getDatas(setUrl(curr_url)), 500 );
    }
  }
  else { 
    sendData('GET', setUrl(target), null, "json", "");

    if(target != undefined)
      setTimeout( getDatas(setUrl(curr_url)), 500 );
  }

  history.pushState(null, title, setUrl(curr_url));
  evt.preventDefault();
});

/**
 * Insert and Update Function
 */
$(document).on('submit','form.form-save', function(evt) {
  var self      = $(this);
  var method    = self.attr("method");
  var url       = self.attr("data-target");
  var xurl      = self.attr("action");
  var datatype  = self.attr("datatype");
  var target    = self.attr("target");
  var data      = $(this).serialize();
  
  if(datatype == undefined)
    datatype = 'json';

  if(target == undefined)
    target = 'basecontent';

  $('body').removeClass('modal-open');
  $('body').removeAttr("style")
  $(".modal-backdrop.fade.in").fadeOut();

  sendData(method, setUrl(xurl), data, datatype, target);
  history.pushState(null, null, '');
  evt.preventDefault();
});

/**
 * Function to management form to edit with ajax method
 */

$(document).on('click','.edit-form', function(evt) {
  var self          = $(this);
  var URL           = self.attr("href");
  var title         = this.textContent;

  get_data_ajax(URL,null);

  history.pushState(null, title, URL);
  evt.preventDefault();
  
  return false;
});

/**
 * Pagination Function
 * @parameter url (string)
 * @parameter title (string)
 */
$(document).on('click','.pagination li.normal a', function(evt) {
  var self  = $(this);
  var url   = self.attr("href");
  var baseTarget    = $(this).attr('second-target');
  var title = this.textContent;
  
  if(baseTarget == undefined)
    usesecond = true;
  else
    usesecond = false;

  getDatas(url);

  history.pushState(null, title, '');
  evt.preventDefault();

  return false;
});

$(document).on('click','.pagination li.active a', function(evt) {
  evt.preventDefault();
});

$(document).on('click','.pagination li.active a.active', function(evt) {
  evt.preventDefault();
});

/**
 * Function ajax to handler the request page and to manage all function 
 * @parameter method (string) ex : post , get
 * @parameter url (string)
 * @parameter data (object or string) ex name:vizzcaindra
 * @parameter datatype (string) ex json, html, xml
 * @parameter target 
 */
var sendData = function(method, url, data, datatype, target) {
  $.ajax({
      type       : method,
      url        : url + "?token=true",
      data       : data,
      dataType   : datatype,
      cache      : false,
      beforeSend : function() {
                    animationStart();
                 }
  }).done(function(content) {
      if(datatype == 'json') {
          $(".message-toast").attr({'class' : 'message-toast ' + content.class});
          $(".message-toast > div.content-message > b.title").empty();
          $(".message-toast > div.content-message > b.title").append(content.title);

          $(".message-toast > div.content-message > message").empty();
          $(".message-toast > div.content-message > message").append(content.message);
          $(".message-toast").fadeIn(100).delay(200).fadeOut(2000);
      }

      if(datatype == "html") {
        animationStop();
        $("#" + target).empty();
        $("#" + target).append(content);
      }

      if(datatype == "xml") {
        alert("xml");
      }

      animationStop();
  }).error(function(httpObj, textStatus) {
    // alert(httpObj.status);
    alert("Content not found");
    animationStop();
  });
}

var getDatas = function(url) {
  var foundRandom = url.indexOf('?');
  var links = foundRandom > 0 ? "&" : "?";
  var pages = usesecond == true ? seccontent : basecontent;
  // alert(usesecond);

  $.ajax({
    headers    : { 'X-Content-Only' : 'true' },
    type       : "GET",
    url        : url + links + "token=true",
    cache      : true,
    beforeSend : function() {
                    animationStart();
                 }
  }).done(function(content) {
    animationStop();
    $("#" + pages).empty();
    $("#" + pages).append(content);
  }).error(function(httpObj, textStatus) {
    //alert(httpObj.status);

    alert("Content not found");
  });
};

var animationStop = function() {
  $("#animate").removeClass('animate').addClass('animate');
  $("#animate-load").removeClass('animate-load').addClass('animate-load');

  $("#animate").animate({
    opacity: 0.00
  }, 100);
};

var animationStart = function() {
  $("#animate").animate({
    opacity: 0.80
  }, 100);
};

/**
 * This function to check all input checkbox in a form 
 */
var checked_role = function(target) {
  var counter = document.formView.length;

  if (document.formView[target].checked === true)
  {
    for (i=1; i<=counter; i++)
    {
      if (document.formView[i].type === "checkbox")
        document.formView[i].checked = true;
    }
  }
  else if (document.formView[target].checked === false)
  {
    for (i=1; i<=counter; i++)
    {
      if (document.formView[i].type === "checkbox")
        document.formView[i].checked = false;
    }
 }
}

/**
 * This function use to handler route of the website
 * @parameter url (string)
 */
var setUrl = function(url) {
  var hostname = window.location.hostname;
  var add      = 'simontik/'
  var val      = 'http://' + hostname + '/' + add + url.replace(/\./g, "/");

  return val;
}