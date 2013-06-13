//  Utility Methods
function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}

function blank(obj){
  return obj === undefined || obj === null || obj === "null" || obj === "" || (obj.length !== undefined && obj.length <= 0) || obj == "/gray_scale_images/original/missing.png";
}

/* Add remove method to Array class for removing  */
Array.prototype.remove= function(){
  var what, a= arguments, L= a.length, ax;
  while(L && this.length){
    what= a[--L];
    while((ax= this.indexOf(what))!= -1){
        this.splice(ax, 1);
    }
  }
  return this;
}


/* Jquery ajax file upload */
jQuery.extend({
  createUploadIframe: function(id, uri)
	{
		//create frame
    var frameId = 'jUploadFrame' + id;
    var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
		if(window.ActiveXObject)
		{
      if(typeof uri== 'boolean'){
				iframeHtml += ' src="' + 'javascript:false' + '"';
      }else if(typeof uri== 'string'){
				iframeHtml += ' src="' + uri + '"';
      }
		}
		iframeHtml += ' />';
		jQuery(iframeHtml).appendTo(document.body);
    return jQuery('#' + frameId).get(0);
  },
  createUploadForm: function(id, fileElementId, data)
  {
  	//create form
  	var formId = 'jUploadForm' + id;
  	var fileId = 'jUploadFile' + id;
  	var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
  	if(data)
  	{
  		for(var i in data)
  		{
  			jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
  		}
  	}
  	var oldElement = jQuery('#' + fileElementId);
  	var newElement = jQuery(oldElement).clone();
  	jQuery(oldElement).attr('id', fileId);
  	jQuery(oldElement).before(newElement);
  	jQuery(oldElement).appendTo(form);

  	//set attributes
  	jQuery(form).css('position', 'absolute');
  	jQuery(form).css('top', '-1200px');
  	jQuery(form).css('left', '-1200px');
  	jQuery(form).appendTo('body');
  	return form;
  },

  ajaxFileUpload: function(s) {
      // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
      s = jQuery.extend({}, jQuery.ajaxSettings, s);
      var id = new Date().getTime()
    	var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data)=='undefined'?false:s.data));
    	var io = jQuery.createUploadIframe(id, s.secureuri);
    	var frameId = 'jUploadFrame' + id;
    	var formId = 'jUploadForm' + id;
      // Watch for a new set of requests
      if ( s.global && ! jQuery.active++ )
	    {
		    jQuery.event.trigger( "ajaxStart" );
	    }
      var requestDone = false;
      // Create the request object
      var xml = {}
      if ( s.global )
          jQuery.event.trigger("ajaxSend", [xml, s]);
      // Wait for a response to come back
      var uploadCallback = function(isTimeout)
    	{
    		var io = document.getElementById(frameId);
        try
    		{
    			if(io.contentWindow)
    			{
    				xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
            xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
    			}else if(io.contentDocument)
    			{
    			  xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
            xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
    			}
        }catch(e)
    		{
    			jQuery.handleError(s, xml, null, e);
    		}
        if ( xml || isTimeout == "timeout")
    		{
          requestDone = true;
          var status;
          try {
            status = isTimeout != "timeout" ? "success" : "error";
            // Make sure that the request was successful or notmodified
            if ( status != "error" )
				    {
              // process the data (runs the xml through httpData regardless of callback)
              var data = jQuery.uploadHttpData( xml, s.dataType );
              // If a local callback was specified, fire it and pass it the data
              if ( s.success )
                  s.success( data, status );

              // Fire the global callback
              if( s.global )
                  jQuery.event.trigger( "ajaxSuccess", [xml, s] );
            } else
              jQuery.handleError(s, xml, status);
          } catch(e)
			    {
            status = "error";
            jQuery.handleError(s, xml, status, e);
          }

          // The request was completed
          if( s.global )
            jQuery.event.trigger( "ajaxComplete", [xml, s] );

          // Handle the global AJAX counter
          if ( s.global && ! --jQuery.active )
            jQuery.event.trigger( "ajaxStop" );

          // Process result
          if ( s.complete )
            s.complete(xml, status);

          jQuery(io).unbind()

          setTimeout(function(){
            try
						{
							jQuery(io).remove();
							jQuery(form).remove();

						} catch(e)
						{
							jQuery.handleError(s, xml, null, e);
						}

					}, 100)

          xml = null

        }
      }
      // Timeout checker
      if ( s.timeout > 0 )
	    {
        setTimeout(function(){
          // Check to see if the request is still happening
          if( !requestDone ) uploadCallback( "timeout" );
        }, s.timeout);
      }
      try{
    		var form = jQuery('#' + formId);
    		jQuery(form).attr('action', s.url);
    		jQuery(form).attr('method', 'POST');
    		jQuery(form).attr('target', frameId);
        if(form.encoding)
		    {
          jQuery(form).attr('encoding', 'multipart/form-data');
        }
        else
		    {
          jQuery(form).attr('enctype', 'multipart/form-data');
        }
        jQuery(form).submit();

      } catch(e)
	    {
        jQuery.handleError(s, xml, null, e);
      }

    	jQuery('#' + frameId).load(uploadCallback	);
      return {abort: function () {}};
  },

  uploadHttpData: function( r, type ) {
    var data = !type;
    data = type == "xml" || data ? r.responseXML : r.responseText;
    // If the type is "script", eval it in global context
    if ( type == "script" )
      jQuery.globalEval( data );
    // Get the JavaScript object, if JSON is used.
    if ( type == "json" ){
      data = data.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;">' , "");
      data = data.replace("</pre>" , "");
      data = jQuery.parseJSON(data);
    }
    // evaluate scripts within html
    if ( type == "html" )
      jQuery("<div>").html(data).evalScripts();

    return data;
  }
});

/* gb_tags */

$(document).ready(function() {
  initStaticSingleTag("input.tag");
  initStaticTagging("input.tags");
  initRemoteSingleTag("input.remotetag");
  initRemoteTagging("input.remotetags");
});

function initStaticTagging(tag_selector){

  // don't navigate away from the field on tab when selecting an item
  $( tag_selector ).bind( "keydown", function( event ) {
    if ( event.keyCode === $.ui.keyCode.TAB &&
        $( this ).data( "autocomplete" ).menu.active ) {
      event.preventDefault();
    }
  })


  $( tag_selector ).autocomplete({
    source:  function( request, response ) {
      var tags = $($(this).attr('element')).attr('rel').split(",");
      var query = extractLast(request.term).toLowerCase();
      var matchedtags = jQuery.grep(tags, function(val, i){
        return val.toLowerCase().search(query) >= 0 ;
      });
      response(matchedtags);
    },

    focus: function() {
      // prevent value inserted on focus
      return false;
    },
    select: selectEvent
  });
}

function initStaticSingleTag(tag_selector){

  // don't navigate away from the field on tab when selecting an item
  $( tag_selector ).bind( "keydown", function( event ) {
    if ( event.keyCode === $.ui.keyCode.TAB &&
        $( this ).data( "autocomplete" ).menu.active ) {
      event.preventDefault();
    }
  })


  $( tag_selector ).autocomplete({
    source:  function( request, response ) {
      var tags = $($(this).attr('element')).attr('rel').split(",");
      var query = request.term.toLowerCase();
      var matchedtags = jQuery.grep(tags, function(val, i){
        return val.toLowerCase().search(query) >= 0 ;
      });
      response(matchedtags);
    },

    focus: function() {
      // prevent value inserted on focus
      return false;
    },
    select: selectEventForSingle
  });
}

var cache = {}, lastXhr;

// response of ajax should be in this format [{"id":"Management","value":"Management","label":"Management"}]
function initRemoteTagging(tag_selector){
  var progress = $($( tag_selector ).attr('data-progress'));

  $( tag_selector ).autocomplete({
    minLength: 2,
    source: function( request, response ) {
      var term = extractLast(request.term).toLowerCase();
      if ( term in cache ) {
        response( cache[ term ] );
        return;
      }
      var url = $($(this).attr('element')).attr('rel');
      if(progress.length >= 0){
        progress.show();
      }
      lastXhr = $.ajax({
        url: url,
        dataType: 'json',
        data: "term="+term,
        complete: function(jqXHR , msg , ex){
          var data = jQuery.parseJSON(jqXHR.responseText);
          cache[ term ] = data;
          if ( jqXHR === lastXhr ) {
            response(data);
          }
          if(progress.length >= 0){
            progress.hide();
          }
        }
      });
    },
    focus: function() {
      // prevent value inserted on focus
      return false;
    },
    select: selectEvent
  });
}

// response of ajax should be in this format [{"id":"Management","value":"Management","label":"Management"}]
function initRemoteSingleTag(tag_selector){
  var progress = $($( tag_selector ).attr('data-progress'));

  $( tag_selector ).autocomplete({
    minLength: 2,
    source: function( request, response ) {
      var term = request.term.toLowerCase();
      if ( term in cache ) {
        response( cache[ term ] );
        return;
      }
      var url = $($(this).attr('element')).attr('rel');
      if(progress.length >= 0){
        progress.show();
      }
      lastXhr = $.ajax({
        url: url,
        dataType: 'json',
        data: "term="+term,
        complete: function(jqXHR , msg , ex){
          var data = jQuery.parseJSON(jqXHR.responseText);
          cache[ term ] = data;
          if ( jqXHR === lastXhr ) {
            response(data);
          }
          if(progress.length >= 0){
            progress.hide();
          }
        }
      });
    },
    focus: function() {
      // prevent value inserted on focus
      return false;
    }  ,
      select: selectEventForSingle
  });
}


function selectEvent(event, ui){
  var terms = split( this.value );
  // remove the current input
  terms.pop();
  // add the selected item
  terms.push( ui.item.value );
  // add placeholder to get the comma-and-space at the end
  terms.push( "" );
  this.value = terms.join( ", " );
  return false;
}

function selectEventForSingle(event, ui){
  var target = $($( this ).attr('data-value-target'));
  if(target.length > 0){
    target.val(ui.item.id);
  }
  this.value = ui.item.value ;
  return false;
}


/* gb_expander */


// Automatically create expanders
$(document).ready(function(){
  $(".expandable").each(function(){
    var expandable = new Expander( $(this) );
  });
});

var Expander = function( expandable ){

  var DEBUG_MODE = false;
  var SLIDE_TIME = 300;

  var thisExpandable = this;

  var expandButton = $(expandable);
  if( expandButton.length <= 0 ){
    if( DEBUG_MODE ){
      console.log("Expander: No expand button found.");
    }
    return false;
  }
  if( expandButton.length > 1 ){
    if( DEBUG_MODE ){
      console.log("Expander: More than one expand button found.");
    }
    return false;
  }

  var toggledElements = $("" + expandButton.attr("rel"));
  if( toggledElements <= 0 ){
    if( DEBUG_MODE ){
      console.log("Expander: No expandable elements linked to the expand button.");
    }
    return false;
  }

  this.collapse = function( time ){

    if( time < 0 ){
      time = SLIDE_TIME;
    }
    expandButton.removeClass("expanded");
    expandButton.addClass("collapsed");
    toggledElements.hide();//slideUp( time );
  }

  this.expand = function( time ){

    if( time < 0 ){
      time = SLIDE_TIME;
    }
    expandButton.addClass("expanded");
    expandButton.removeClass("collapsed");
    toggledElements.show();//slideDown( time );
  }

  if( expandButton.hasClass("expanded") ){
    expandButton.removeClass("collapsed");
    this.expand(0);
  }

  if( expandButton.hasClass("collapsed") ){
    this.collapse(0);
  }

  if( !expandButton.hasClass("expanded") &&
      !expandButton.hasClass("collapsed") ){
    this.collapse(0);
  }

  expandButton.click( function(){
    if( expandButton.hasClass("expanded") ){
      thisExpandable.collapse();
    }else{
      thisExpandable.expand();
    }
  });
}


/* gb_bootstrap-datepicker */
/* ===========================================================
 * bootstrap-datepicker.js v1.3.0
 * http://twitter.github.com/bootstrap/javascript.html#datepicker
 * ===========================================================
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributed by Scott Torborg - github.com/storborg
 * Loosely based on jquery.date_input.js by Jon Leighton, heavily updated and
 * rewritten to match bootstrap javascript approach and add UI features.
 * =========================================================== */


!function ( $ ) {

  var selector = '[data-datepicker]',
      all = [];

  function clearDatePickers(except) {
    var ii;
    for(ii = 0; ii < all.length; ii++) {
      if(all[ii] != except) {
        all[ii].hide();
      }
    }
  }

  function DatePicker( element, options ) {
    this.$el = $(element);
    this.proxy('show').proxy('ahead').proxy('hide').proxy('keyHandler').proxy('selectDate');

    var options = $.extend({}, $.fn.bsdatepicker.defaults, options );

    if((!!options.parse) || (!!options.format) || !this.detectNative()) {
      $.extend(this, options);
      this.$el.data('bsdatepicker', this);
      all.push(this);
      this.init();
    }
  }

  DatePicker.prototype = {

      detectNative: function(el) {
        // Attempt to activate the native datepicker, if there is a known good
        // one. If successful, return true. Note that input type="date"
        // requires that the string be RFC3339, so if the format/parse methods
        // have been overridden, this won't be used.
        if(navigator.userAgent.match(/(iPad|iPhone); CPU(\ iPhone)? OS 5_\d/i)) {
          // jQuery will only change the input type of a detached element.
          var $marker = $('<span>').insertBefore(this.$el);
          this.$el.detach().attr('type', 'date').insertAfter($marker);
          $marker.remove();
          return true;
        }
        return false;
      }

    , init: function() {
        var $months = this.nav('months', 1);
        var $years = this.nav('years', 12);

        var $nav = $('<div>').addClass('nav').append($months, $years);

        this.$month = $('.name', $months);
        this.$year = $('.name', $years);

        $calendar = $("<div>").addClass('calendar');

        // Populate day of week headers, realigned by startOfWeek.
        for (var i = 0; i < this.shortDayNames.length; i++) {
          $calendar.append('<div class="dow">' + this.shortDayNames[(i + this.startOfWeek) % 7] + '</div>');
        };

        this.$days = $('<div>').addClass('days');
        $calendar.append(this.$days);

        this.$picker = $('<div>')
          .click(function(e) { e.stopPropagation() })
          // Use this to prevent accidental text selection.
          .mousedown(function(e) { e.preventDefault() })
          .addClass('datepicker')
          .append($nav, $calendar)
          .insertAfter(this.$el);

        this.$el
          .focus(this.show)
          .click(this.show)
          .change($.proxy(function() { this.selectDate(); }, this));

        this.selectDate();
        this.hide();
      }

    , nav: function( c, months ) {
        var $subnav = $('<div>' +
                          '<span class="prev button">&larr;</span>' +
                          '<span class="name"></span>' +
                          '<span class="next button">&rarr;</span>' +
                        '</div>').addClass(c)
        $('.prev', $subnav).click($.proxy(function() { this.ahead(-months, 0) }, this));
        $('.next', $subnav).click($.proxy(function() { this.ahead(months, 0) }, this));
        return $subnav;

    }

    , updateName: function($area, s) {
        // Update either the month or year field, with a background flash
        // animation.
        var cur = $area.find('.fg').text(),
            $fg = $('<div>').addClass('fg').append(s);
        $area.empty();
        if(cur != s) {
          var $bg = $('<div>').addClass('bg');
          $area.append($bg, $fg);
          $bg.fadeOut('slow', function() {
            $(this).remove();
          });
        } else {
          $area.append($fg);
        }
    }

    , selectMonth: function(date) {
        var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);

        if (!this.curMonth || !(this.curMonth.getFullYear() == newMonth.getFullYear() &&
                                this.curMonth.getMonth() == newMonth.getMonth())) {

          this.curMonth = newMonth;

          var rangeStart = this.rangeStart(date), rangeEnd = this.rangeEnd(date);
          var num_days = this.daysBetween(rangeStart, rangeEnd);
          this.$days.empty();

          for (var ii = 0; ii <= num_days; ii++) {
            var thisDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + ii, 12, 00);
            var $day = $('<div>').attr('date', this.format(thisDay));
            $day.text(thisDay.getDate());

            if (thisDay.getMonth() != date.getMonth()) {
              $day.addClass('overlap');
            };

            this.$days.append($day);
          };

          this.updateName(this.$month, this.monthNames[date.getMonth()]);
          this.updateName(this.$year, this.curMonth.getFullYear());

          $('div', this.$days).click($.proxy(function(e) {
            var $targ = $(e.target);

            // The date= attribute is used here to provide relatively fast
            // selectors for setting certain date cells.
            this.update($targ.attr("date"));

            // Don't consider this selection final if we're just going to an
            // adjacent month.
            if(!$targ.hasClass('overlap')) {
              this.hide();
            }

          }, this));

          $("[date='" + this.format(new Date()) + "']", this.$days).addClass('today');

        };

        $('.selected', this.$days).removeClass('selected');
        $('[date="' + this.selectedDateStr + '"]', this.$days).addClass('selected');
      }

    , selectDate: function(date) {
        if (typeof(date) == "undefined") {
          date = this.parse(this.$el.val());
        };
        if (!date) date = new Date();

          this.selectedDate = date;
          this.selectedDateStr = this.format(this.selectedDate);
          this.selectMonth(this.selectedDate);
      }

    , update: function(s) {
        this.$el.val(s).change();
      }

    , show: function(e) {
        e && e.stopPropagation();

        // Hide all other datepickers.
        clearDatePickers(this);

        this.$picker.show();

        $('html').on('keydown', this.keyHandler);
      }

    , hide: function() {
        this.$picker.hide();
        $('html').off('keydown', this.keyHandler);
      }

    , keyHandler: function(e) {
        // Keyboard navigation shortcuts.
        switch (e.keyCode)
        {
          case 9:
          case 27:
            // Tab or escape hides the datepicker. In this case, just return
            // instead of breaking, so that the e doesn't get stopped.
            this.hide(); return;
          case 13:
            // Enter selects the currently highlighted date.
            this.update(this.selectedDateStr); this.hide(); break;
          case 38:
            // Arrow up goes to prev week.
            this.ahead(0, -7); break;
          case 40:
            // Arrow down goes to next week.
            this.ahead(0, 7); break;
          case 37:
            // Arrow left goes to prev day.
            this.ahead(0, -1); break;
          case 39:
            // Arrow right goes to next day.
            this.ahead(0, 1); break;
          default:
            return;
        }
        e.preventDefault();
      }

    , parse: function(s) {
        // Parse a partial RFC 3339 string into a Date.
        var m;
        if ((m = s.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/))) {
          return new Date(m[1], m[2] - 1, m[3]);
        } else {
          return null;
        }
      }

    , format: function(date) {
        // Format a Date into a string as specified by RFC 3339.
        var month = (date.getMonth() + 1).toString(),
            dom = date.getDate().toString();
        if (month.length === 1) {
          month = '0' + month;
        }
        if (dom.length === 1) {
          dom = '0' + dom;
        }
        return date.getFullYear() + '-' + month + "-" + dom;
      }

    , ahead: function(months, days) {
        // Move ahead ``months`` months and ``days`` days, both integers, can be
        // negative.
        this.selectDate(new Date(this.selectedDate.getFullYear(),
                                 this.selectedDate.getMonth() + months,
                                 this.selectedDate.getDate() + days));
      }

    , proxy: function(meth) {
        // Bind a method so that it always gets the datepicker instance for
        // ``this``. Return ``this`` so chaining calls works.
        this[meth] = $.proxy(this[meth], this);
        return this;
      }

    , daysBetween: function(start, end) {
        // Return number of days between ``start`` Date object and ``end``.
        var start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
        var end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
        return (end - start) / 86400000;
      }

    , findClosest: function(dow, date, direction) {
        // From a starting date, find the first day ahead of behind it that is
        // a given day of the week.
        var difference = direction * (Math.abs(date.getDay() - dow - (direction * 7)) % 7);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
      }

    , rangeStart: function(date) {
        // Get the first day to show in the current calendar view.
        return this.findClosest(this.startOfWeek,
                                new Date(date.getFullYear(), date.getMonth()),
                                -1);
      }

    , rangeEnd: function(date) {
        // Get the last day to show in the current calendar view.
        return this.findClosest((this.startOfWeek - 1) % 7,
                                new Date(date.getFullYear(), date.getMonth() + 1, 0),
                                1);
      }
  };

  /* DATEPICKER PLUGIN DEFINITION
   * ============================ */

  $.fn.bsdatepicker = function( options ) {
    return this.each(function() { new DatePicker(this, options); });
  };

  $(function() {
    $(selector).bsdatepicker();
    $('html').click(clearDatePickers);
  });

  $.fn.bsdatepicker.DatePicker = DatePicker;

  $.fn.bsdatepicker.defaults = {
    monthNames: ["January", "February", "March", "April", "May", "June",
                 "July", "August", "September", "October", "November", "December"]
  , shortDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  , startOfWeek: 1
  };
}( window.jQuery || window.ender );

/* Update datepicker plugin so that DD/MM/YYYY format is used. */
$.extend($.fn.bsdatepicker.defaults, {
  parse: function (string) {
    return parseStringIntoDate(string);
  },
  format: function (date) {
    var
      month = (date.getMonth() + 1).toString(),
      dom = date.getDate().toString();
    if (month.length === 1) {
      month = "0" + month;
    }
    if (dom.length === 1) {
      dom = "0" + dom;
    }
    return dom + "/" + month + "/" + date.getFullYear();
  }
});

function parseStringIntoDate(string){
  var matches;
  if ((matches = string.match(/^(\d{2,2})\/(\d{2,2})\/(\d{4,4})$/))) {
    return new Date(matches[3], matches[2]- 1, matches[1] );
  } else {
    return null;
  }
}

function dbDateFormat(date){
  var
    month = (date.getMonth() + 1).toString(),
    dom = date.getDate().toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  if (dom.length === 1) {
    dom = "0" + dom;
  }
  return date.getFullYear() + "-"+ month + "-" + dom ;
}

function combine_datetime(target_field_class){
  var src_date_field = $("#"+target_field_class + "_date");
  var src_time_field = $("#"+target_field_class + "_time");
  var date = parseStringIntoDate(src_date_field.val());
  var time = src_time_field.val();

  if(time == "" || time.split(":").length !=2 ){
    time = "00:00"
  }else{
    var hours = parseInt(time.split(":")[0] , 10);
    var secondpart = time.split(":")[1];
    var minutes = 0;
    var am_pm = "AM";

    if(secondpart.search(" ") > 0){
      minutes = parseInt(secondpart.split(" ")[0],10);
      am_pm = secondpart.split(" ")[1];
    }else{
      minutes = parseInt(secondpart.substring(0,2),10);
      am_pm = secondpart.substring(2);
    }

    if((am_pm.toLowerCase() == "am" || am_pm.toLowerCase() == "") && hours == 12){
      hours = 0
    }

    if(am_pm.toLowerCase() == "pm" && hours != 12){
      hours += 12;
    }else{

    }

    if(hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59){
      time = hours + ":"+ minutes;
    }else{
      time = "00:00";
    }
  }



  var new_val = "";
  if(date != null){
    new_val = dbDateFormat(date) + " " + time;

  }
  $("."+target_field_class).val(new_val);
}

function checkDateFormat(datefield,error_label){
  date = $(datefield).val();
  error_label = $(error_label)
  // regular expression to match required date format
      re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

      if(date != '') {
        if(regs = date.match(re)) {
          // day value between 1 and 31
          if(regs[1] < 1 || regs[1] > 31) {
            show_validation_error(error_label ,"Invalid value for day: " + regs[1]);
            datefield.focus();
            return false;
          }
          // month value between 1 and 12
          if(regs[2] < 1 || regs[2] > 12) {
            show_validation_error(error_label ,"Invalid value for month: " + regs[2]);
            datefield.focus();
            return false;
          }
          // year value between 1902 and 2012
          if(regs[3] < 1902 || regs[3] > (new Date()).getFullYear()+2) {
            show_validation_error(error_label ,"Invalid value for year: " + regs[3] + " - must be between 1902 and " + (new Date()).getFullYear()+2);
            datefield.focus();
            return false;
          }
        } else {
          show_validation_error(error_label ,"Invalid date format: " + form.startdate.value);
          datefield.focus();
          return false;
        }
      }
}

function checkTimeFormat(timeField,error_label)
{
    time = $(timeField).val();
    error_label = $(error_label)
    // regular expression to match required time format
    re = /^(\d{1,2}):(\d{2})(\s){0,1}([a|p]m)?$/i;

    if(time.value != '') {
      if(regs = time.match(re)) {
        if(regs[3]) {
          // 12-hour value between 1 and 12
          if(regs[1] < 1 || regs[1] > 12) {
            show_validation_error(error_label ,"Invalid value for hours: " + regs[1]);
            timeField.focus();
            return false;
          }
        } else {
          // 12-hour value between 1 and 12
          if(regs[1] < 1 || regs[1] > 12) {
            show_validation_error(error_label ,"Invalid value for hours: " + regs[1]);
            timeField.focus();
            return false;
          }
        }
        // minute value between 0 and 59
        if(regs[2] > 59) {
          show_validation_error(error_label ,"Invalid value for minutes: " + regs[2]);
          timeField.focus();
          return false;
        }
      } else {
        show_validation_error(error_label ,"Invalid time format: " + timeField.value);
        timeField.focus();
        return false;
      }
    }

    return true;
}

function show_validation_error(error_label , message){
  error_label.html(message);
}
