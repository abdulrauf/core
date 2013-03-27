$(document).ready(function() {

  dragTreeManager.init();
  initClickEventsForAssetLinks($("body"));
  initSlugManagement();
  initBetterSlugManagement();
  init_setting_dropdown_ajax();
  initPublishedDateTime();
  initBulkDeleteAsset();

  $("#wrapper p#contextualHelp a").click(Help.click);

  if ($('table').length > 0) {
    $('table').find('tr:last').css('background-image', 'none !important');
  }

  $("form.validation").validate();

  if( $('.page_flash').length > 0){
    if($(".model-error").length > 0){
      $('.page_flash').remove();
    }else{
      $('.page_flash').insertBefore(".page-header");
    }
  }

  $("ul.nav a.active").each(function(){
    $(this).parent("li").addClass('active')
  });

  setUpAudio();

});

function initBetterSlugManagement() {
  var str = $('#page_slug_holder .domain').html();
  var pt = $('#page_title');
  var pb = $('#page_slug .edit');
  var ps = $('#page_slug span');
  var hs = $('#page_hidden_slug');
  var regex = /[\!\*'"″′‟‛„‚”“”˝\(\);:.@&=+$,\/?%#\[\]]/gim;
  var doNotEdit = ps.attr('donotedit');
  var editPage = false;
  var slugLength = 0;
  var slug = "";
  var currentSlug = "";

  if (typeof doNotEdit == 'string') {
    doNotEdit = true;
    editPage = true;
  } else {
    doNotEdit = false;
  }

  $('#page_slug_holder .domain').html($.trim(str));

  pt.keyup(function(){
    if (!doNotEdit) {
      slug = pt.attr('value').toLowerCase().replace(/\s/gim, '_').replace(regex, '')
      ps.html(slug);
      hs.attr('value', slug);
    };
  })

  pb.click(function(){
    hs.show();
    ps.hide();
    pb.hide();
    hs.focus();
    doNotEdit = true;
    slugLength = hs.val().length;
    currentSlug = hs.val();
  })

  hs.focusout(function(){
    var len = hs.val().length;
    if (doNotEdit) {
      if (len == 0) {
        hs.hide();
        ps.show();
        pb.show();
        if (!editPage) {
          doNotEdit = false;
          slug = pt.attr('value').toLowerCase().replace(/\s/gim, '_').replace(regex, '')
          ps.html(slug);
          hs.attr('value', slug);
        } else {
          hs.attr('value', currentSlug);
        }
      } else if(slugLength == len) {
        hs.hide();
        ps.show();
        pb.show();
        if (!editPage) {
          doNotEdit = false;
        }
      } else {
        hs.hide();
        ps.show();
        pb.show();
        ps.html(hs.attr('value').toLowerCase().replace(/\s/gim, '_').replace(regex, ''));
        doNotEdit = true;
      };
    };
  })

}


function enable_jwysiwyg_on(selector) {
  $(document).ready(function() {
    $(selector).tinymce({
      // Location of TinyMCE script
      script_url: '/assets/tiny_mce/tiny_mce.js',

      // General options
      theme: "advanced",
      plugins: "autolink,lists,style,table,advhr,advlink,gb_assets,inlinepopups,insertdatetime,preview,paste,fullscreen,advlist,wordcount",

      // Theme options
      theme_advanced_buttons1: "gb_assets,newdocument,|,bold,italic,underline,|,justifyleft,justifyright,styleselect,formatselect,|,attribs,removeformat,cleanup,code",
      theme_advanced_buttons2: "pastetext,pasteword,|,bullist,numlist,|,blockquote,|,undo,redo,|,link,unlink,anchor,|,insertdate,inserttime|,advhr,",
      theme_advanced_buttons3: "tablecontrols,|,fullscreen,preview",
      theme_advanced_toolbar_location: "top",
      theme_advanced_toolbar_align: "left",
      theme_advanced_statusbar_location: "bottom",
      theme_advanced_resizing: true,
      plugin_insertdate_dateFormat: "%d/%m/%Y",
      plugin_insertdate_timeFormat: "%H:%M:%S",
      theme_advanced_resizing_use_cookie: false,
			width: get_wysiwyg_width(selector),

      // Example content CSS (should be your site CSS)
      content_css: "/stylesheets/user-styles.css"

    });

  });
}

function get_wysiwyg_width(selector){
	if($(selector).attr('width')){
		return $(selector).attr('width')
	} else {
		return null;
	}
}



// This method initialize slug related event on a title text box.
function initSlugManagement() {
  try {
    var pt = $('#page_title');
    var ps = $('#page_slug');

    var regex = /[\!\*'"″′‟‛„‚”“”˝\(\);:.@&=+$,\/?%#\[\]]/gim;

    var pt_function = function() {
      if (ps.attr('donotmodify') != 'true') ps.attr('value', pt.attr('value').toLowerCase().replace(/\s/gim, '_').replace(regex, ''));
    };

    pt.bind("keyup", pt_function);
    pt.bind("blur", pt_function);

    ps.bind("blur", function() {
      ps.attr('value', ps.attr('value').toLowerCase().replace(/\s/gim, '_').replace(regex, ''));
      ps.attr('donotmodify', 'true');
    });
  } catch(e) {
    console.log(e)
  }
}

function enable_slug_management_on(src_class){
  $("."+src_class).attr('id','page_title')
}



// if container element has class "add_to_photoseries" , it returns html of new image
function initClickEventsForAssetLinks(element) {
  element.find(".thumbnails a.choose_button").click(function(e) {
    var p = $(this).parent().parent().parent(".asset_selector_wrapper");

    var link = $(this);
    AssetBrowser.showOverlay()
    $.get(link.attr("href"), null, function(markup) {
      AssetBrowser.load(p, link, markup);
    });
    e.preventDefault();
  });

}

// Common utility functions shared between the different dialogs.
var Dialog = {
  center: function() {
    var offset = $(document).scrollTop();
    for (var i = 0; i < arguments.length; i++) {
      arguments[i].css({
        top: offset + "px"
      });
    };
  },
  PADDING_ATTRS: ["padding-top", "padding-bottom"],
  resizeDisplay: function(object) {
    // Get the display and the offsets if we don't have them
    if (!object.display) object.display = object.frame.find(".display");
    if (!object.offsets) object.offsets = object.frame.find("> *:not(.display)");
    var offsetHeight = 0;
    object.offsets.each(function(i, node) {
      offsetHeight += $(node).outerHeight();
    });
    // Get the padding for the display
    if (!object.displayPadding) {
      object.displayPadding = 0
      for (var i = 0; i < this.PADDING_ATTRS.length; i++) {
        object.displayPadding += parseInt(object.display.css(this.PADDING_ATTRS[i]).match(/\d+/)[0]);
      };
    }
    object.display.height(object.frame.innerHeight() - (offsetHeight + object.displayPadding));
  }
};

var AssetBrowser = {
  overlay: null,
  dialog: null,
  imageDisplay: null,
  Wysiwyg: null,
  logo_setting: false,
  filter: null,
  actualLink: null,
  link_parent: null,
  load: function(p, link, markup, Wysiwyg) {
    AssetBrowser.link_parent = p;
    AssetBrowser.actualLink = link;
    // it is required for asset selector in jWysiwyg
    AssetBrowser.Wysiwyg = null;
    if (Wysiwyg != undefined) {
      AssetBrowser.Wysiwyg = Wysiwyg;
    }
    // its used for category filtering on assets and collections
    AssetBrowser.filter = $("#filter_" + $(link).attr("rel"));

    if ($(link).is(".logo_setting")) {
      AssetBrowser.logo_setting = true;
      AssetBrowser.logo_setting_url = $(link).attr("data_url");
    } else {
      AssetBrowser.logo_setting = false;
      AssetBrowser.logo_setting_url = "";
    }
    // Set everthing up
    AssetBrowser.showOverlay();
    $("body").append(markup);
    AssetBrowser.browser = $("#assetsDialog");
    try {
      AssetBrowser.target = $("#" + $(link).attr("rel"));
      AssetBrowser.imageDisplay = $("#image_" + $(link).attr("rel"));
      AssetBrowser.nameDisplay = $("#show_" + $(link).attr("rel"));
      if (AssetBrowser.nameDisplay !== null) {
        AssetBrowser.nameDisplay = p.find("h5");
      }
    } catch(e) {
      AssetBrowser.target = null;
      AssetBrowser.nameDisplay = p.find("h5");
    }
    if(AssetBrowser.actualLink.hasClass("add_image_to_gallery")){
      AssetBrowser.target = null;
    }

    threeSixtyPlayer.init();

    // Grab the various nodes we need
    AssetBrowser.display = AssetBrowser.browser.find("#assetsDisplay");
    AssetBrowser.offsets = AssetBrowser.browser.find("> *:not(#assetsDisplay)");
    AssetBrowser.backControl = AssetBrowser.browser.find("#back a");
    AssetBrowser.backControl.css({
      display: "none"
    });
    // Calculate the offsets
    AssetBrowser.offsetHeight = 0;
    AssetBrowser.offsets.each(function(i, element) {
      AssetBrowser.offsetHeight += $(element).outerHeight();
    });
    // Initialize
    AssetBrowser.resizeDisplay();
    $(window).resize(AssetBrowser.resizeDisplay);
    // Cancel button
    AssetBrowser.browser.find("#cancel").click(AssetBrowser.close);
    // Capture anchor clicks
    AssetBrowser.display.find("a").click(AssetBrowser.click);
    $("#assetsDialog form#asset_search_form").submit(AssetBrowser.search_submit);
    AssetBrowser.backControl.click(AssetBrowser.back);

    AssetBrowser.browser.find("#ajax_new_asset_form").submit(function(e) {
      if($("#asset_file").val() != null && $("#asset_name").val() != null && $("#asset_file").val() != "" && $("#asset_name").val() != ""){
        ajaxFileUpload(link);
      }
      e.preventDefault();
    });

    // same height for all elements within same row
    $.each(AssetBrowser.browser.find(".tab-pane") , function(index , element){
      AssetBrowser.sameHeightForAllElementsOfSameRow($(element));
    });

    try{
      $().collapse({parent: "#accordion_for_collections"});
    }catch(e){
      console.log(e);
    }




    $("#assetsDialog").css({
      height: ($(window).height()*0.9) + "px",
      width: ($(window).width()*0.7) + "px",
      "margin-top": "-" + (($(window).height()*0.9)/2) + "px",
      "margin-left": "-" + (($(window).width()*0.7)/2) + "px"
    })

    $(".modal-body").css({
      "max-height": (($(window).height()*0.9) - 135) + "px",
      "height": (($(window).height()*0.9) - 135) + "px"
    })

    try {
      $("#assetsDialog form.validation").validate();
    } catch(e) {
      console.log(e)
    }

    $(window).resize(function(e) {
      $("#assetsDialog").css({
        position: "absolute",
        top: (($(window).scrollTop())) + "px"
      })

    })
  },
  sameHeightForAllElementsOfSameRow: function(parent_element){

    var all_spans = parent_element.find(".thumbnails .span3");
    var row_num = 1;
    var ASSET_MAX_COLUMNS = 5;
    var row_max_height = 0;
    $.each(all_spans , function(index , element){
      if($(element).height() > row_max_height){
        row_max_height = $(element).height();
      }
      $(element).attr('data-row' , row_num);
      if( (index+1) % ASSET_MAX_COLUMNS == 0 ){
        if(row_max_height > 0){
          parent_element.find("[data-row="+row_num+"]").height(row_max_height);
        }
        row_num++;
        row_max_height = 0;
      }
    });
  },
  resizeDisplay: function() {
    // var newHeight = AssetBrowser.browser.innerHeight() - AssetBrowser.offsetHeight;
    // AssetBrowser.display.height(newHeight);
  },
  showOverlay: function() {
    AssetBrowser.overlay = $("#assetsDialogOverlay");
    if (!AssetBrowser.overlay || AssetBrowser.overlay.length == 0) {
      var height = $('#wrapper').height() + 50;
      AssetBrowser.overlay = $('<div id="assetsDialogOverlay" class="modal-backdrop"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>');
      $("body").append(AssetBrowser.overlay);
    } else {
      AssetBrowser.overlay.css({
        display: "block"
      });
    }
    set_height = wrapper_height = $("body").height();
    window_height = $(window).height() + $(window).scrollTop()
    if (set_height < window_height) set_height = window_height;
    $("#assetsDialogOverlay").height(set_height)

  },
  close: function() {
    AssetBrowser.overlay.css({
      display: "none"
    });
    AssetBrowser.browser.remove();

    if(threeSixtyPlayer != null){
      try{
        threeSixtyPlayer.stopSound(threeSixtyPlayer.lastSound);
      }catch(e){}
    }

  },
  handleJSON: function(json) {
    if (json.backURL) {
      AssetBrowser.backURL = json.backURL;
      AssetBrowser.backControl.css({
        display: "block"
      });
    }
    AssetBrowser.updateDisplay(json.markup);
  },
  updateDisplay: function(markup) {
    AssetBrowser.display.html(markup);
    AssetBrowser.display.find("a").click(AssetBrowser.click);

    try {
      $("form.validation").validate();
    } catch(ex) {}
    AssetBrowser.browser.find("#ajax_new_asset_form").submit(function(e) {
      if($("#asset_file").val() != null && $("#asset_name").val() != null && $("#asset_file").val() != "" && $("#asset_name").val() != ""){
        ajaxFileUpload(AssetBrowser.actualLink);
      }
      e.preventDefault();
    })
  },
  search_submit: function(e) {
    $("#progress_ajax_upload").ajaxStart(function() {
      $(this).show();
    }).ajaxComplete(function() {
      $(this).hide();
    });
    var url = $("#assetsDialog form#asset_search_form").attr("action");
    url += ".json?" + $("#assetsDialog form#asset_search_form").serialize()
    // $.getJSON(url, null, AssetBrowser.handleJSON);
    $.getJSON(url, null, function(json){
      $("#search_tab_results").html(json.markup);
      $("#search_tab_results").find("a").click(AssetBrowser.click);
    });
    e.preventDefault();
  },
  click: function() {
    var target = $(this);
    if (target.is(".assetLink")) {
      var id = target.attr("href").match(/\d+$/);
      var name = target.attr("data-title");

      // assets only
      if (AssetBrowser.target !== null) {
        AssetBrowser.target.attr("value", id);
        var image_src = target.attr("data-thumb");

        image_url = target.attr("data-jwysiwyg");
        file_type = target.attr("data-category");
        file_title = name;
        insert_image_in_wysiwyg(image_url,file_type,file_title);

        AssetBrowser.nameDisplay.html(name);

        if(file_type == "image"){
          if (AssetBrowser.link_parent.find("img").length > 0) {
            AssetBrowser.link_parent.find("img").attr('src', image_src);
          } else {
            AssetBrowser.link_parent.prepend("<img src='" + image_src + "' />");
          }
        }else if(file_type == "audio"){
          if (AssetBrowser.link_parent.find("div.ui360 a").length > 0) {
            AssetBrowser.link_parent.find("div.ui360 a").attr('href', image_url);
            AssetBrowser.link_parent.find("div.ui360 a").text(name);
          } else {
            AssetBrowser.link_parent.prepend("<div class='ui360'><a href='" + image_url + "' >"+name+"</a><div>");
            threeSixtyPlayer.init();
            AssetBrowser.nameDisplay.html('');
          }
        }


        auto_save_asset(AssetBrowser.logo_setting_url, id); //auto save if it is required
      } else {
        if (AssetBrowser.actualLink.hasClass("add_image_to_gallery")) {

          $.ajax({
            url: AssetBrowser.actualLink.attr("data_url"),
            data: 'asset_id=' + id,
            type: "GET",
            success: function(data) {
              $("#images_container").html(data);
              initEditGalleryList();
              dragTreeManager.init();
              AssetBrowser.close();
            },
            error: function(data) {
              AssetBrowser.close();
            }
          });
          //auto_save_asset_for_gallery(AssetBrowser.actualLink.attr("data_url") , id )
        }
      }

      AssetBrowser.close();
    } else if (target.parent().is(".pagination")) {
      if (target.attr("href") != '') {
        $.getJSON(target.attr("href"), null, AssetBrowser.handleJSON);
      }
    } else if(target.is(".no-ajax")){
      return true;
    }
     else if (!target.is(".tab_link")) {
      $("#progress_ajax_upload").ajaxStart(function() {
        $(this).show();
      }).ajaxComplete(function() {
        $(this).hide();
      });

      var url = target.attr("href") + ".json";
      // its collection url then add category filter for filtering assets
      if (target.hasClass("collection")) {
        url += "?filter=" + AssetBrowser.filter.val();
      }
      $.getJSON(url, null, AssetBrowser.handleJSON);
    }
    return false;
  },
  back: function() {
    if (AssetBrowser.backURL) {
      var category = "";
      var show_content = ""
      // if filter exist then apply it on backurl
      if (AssetBrowser.filter !== null) {
        if (AssetBrowser.filter == undefined || AssetBrowser.filter.length == 0) {
          if (AssetBrowser.Wysiwyg != null) category = "&filter=image";
        } else category = "&filter=" + AssetBrowser.filter.val();
      }
      $.get(AssetBrowser.backURL + category + show_content, null, AssetBrowser.updateDisplay);
      AssetBrowser.backURL = null;
      AssetBrowser.backControl.css({
        display: "none"
      });
    }
    return false;
  }

};


function insert_image_in_wysiwyg(image_url,file_type,title) {
  if (AssetBrowser.Wysiwyg != undefined && AssetBrowser.Wysiwyg !== null) {
    Wysiwyg = AssetBrowser.Wysiwyg;
    if(file_type == undefined)
      file_type = "";
    if(title == undefined)
      title = "";
    if(Wysiwyg.selection.getContent() != "" && Wysiwyg.selection.getContent() != null)
      title = Wysiwyg.selection.getContent();
    description = "";
    style = "";
    if(file_type == "image")
      image = "<img src='" + image_url + "' title='" + title + "' alt='" + description + "'" + style + "/>";
    else
      image = " <a href='"+image_url+"' >"+title+"</a> ";
    Wysiwyg.execCommand('mceInsertContent', false, image);

  }
}


function auto_save_asset(url, new_id) {
  // HACK FOR LOGO SETTINGS
  if (AssetBrowser.logo_setting != undefined && AssetBrowser.logo_setting != null && AssetBrowser.logo_setting == true) {
    //data_id = data_id;
    new_value = new_id;

    $.ajax({
      url: url,
      data: 'gluttonberg_setting[value]=' + new_value,
      type: "PUT",
      success: function(data) {}
    });
  }
}

// Help Browser
// Displays the help in an overlayed box. Intended to be used for contextual
// help initially.
var Help = {
  load: function(url) {
    $.get(url, null, function(markup) {
      Help.show(markup)
    });
  },
  show: function(markup) {
    this.buildFrames();
    this.frame.html(markup)
    this.frame.find("a#closeHelp").click(this.close);
    var centerFunction = function() {
      Dialog.center(Help.frame, Help.overlay);
      Dialog.resizeDisplay(Help);
    };
    $(window).resize(centerFunction);
    $(document).scroll(centerFunction);
    centerFunction();
  },
  close: function() {
    Help.display = null;
    Help.offsets = null;
    Help.displayPadding = null;
    Help.frame.hide();
    Help.overlay.hide();
    return false;
  },
  click: function(e) {
    Help.load(this.href);
    return false;
  },
  buildFrames: function() {
    if (!this.overlay) {
      this.overlay = $('<div id="overlay">&nbsp</div>');
      $("body").append(this.overlay);
      this.frame = $('<div id="helpDialog">&nbsp</div>');
      $("body").append(this.frame);
    } else {
      this.overlay.show();
      this.frame.show();
    }
  }
};




function init_setting_dropdown_ajax() {
  $(".setting_dropdown").change(function() {
    url = $(this).attr("rel");
    id = $(this).attr("data_id");
    new_value = $(this).val()

    $("#progress_" + id).show("fast")

    $.ajax({
      url: url,
      data: 'gluttonberg_setting[value]=' + new_value,
      type: "PUT",
      success: function(data) {
        $("#progress_" + id).hide("fast")
      }
    });

  });
  init_home_page_setting_dropdown_ajax();
}



function init_home_page_setting_dropdown_ajax() {
  $(".home_page_setting_dropdown").change(function() {
    url = $(this).attr("rel");
    id = "home_page"
    new_value = $(this).val()

    $("#progress_" + id).show("fast")

    $.ajax({
      url: url,
      data: 'home=' + new_value,
      type: "POST",
      success: function(data) {
        $("#progress_" + id).hide("fast")
      }
    });

  })

}



function ajaxFileUpload(link) {
  //starting setting some animation when the ajax starts and completes
  $("#loading").ajaxStart(function() {
    $(this).show();
  }).ajaxComplete(function() {
    $(this).hide();
  });
  link = $(link);

  $("#progress_ajax_upload").show();

  asset_name = $('input[name$="asset[name]"]').val();
  var formData = {
    "asset[name]": asset_name,
    "asset[asset_collection_ids]": $("#asset_asset_collection_ids").val(),
    "new_collection[new_collection_name]": $('input[name$="new_collection[new_collection_name]"]').val()
  }

  /*
        prepareing ajax file upload
        url: the url of script file handling the uploaded files
                    fileElementId: the file type of input element id and it will be the index of  $_FILES Array()
        dataType: it support json, xml
        secureuri:use secure protocol
        success: call back function when the ajax complete
        error: callback function when the ajax failed

            */
  $.ajaxFileUpload({
    url: '/admin/add_asset_using_ajax',
    secureuri: false,
    fileElementId: 'asset_file',
    dataType: 'json',
    data: formData,
    success: function(data, status) {
      if (typeof(data.error) != 'undefined') {
        if (data.error != '') {
          //console.log(data.error);
        } else {
          //console.log(data.msg);
        }
      }


      new_id = data["asset_id"]
      file_path = data["url"]
      jwysiwyg_image = data["jwysiwyg_image"];

      try{
        AssetBrowser.target.attr("value", new_id);
        AssetBrowser.nameDisplay.html(asset_name);
        if (AssetBrowser.link_parent.find("img").length > 0) {
          AssetBrowser.link_parent.find("img").attr('src', file_path)

        } else {
          AssetBrowser.link_parent.prepend("<img src='" + file_path + "' />")
        }
      }catch(e){}
      if(data["category"] == "image")
        insert_image_in_wysiwyg(jwysiwyg_image,data["category"],data["title"]);
      else
        insert_image_in_wysiwyg(file_path,data["category"],data["title"]);

      data_id = $(this).attr("data_id");
      url = AssetBrowser.logo_setting_url;
      auto_save_asset(url, new_id); // only if autosave is required

      if (AssetBrowser.actualLink.hasClass("add_image_to_gallery")) {
        $.ajax({
          url: AssetBrowser.actualLink.attr("data_url"),
          data: 'asset_id=' + new_id,
          type: "GET",
          success: function(data) {
            $("#images_container").html(data);
            initEditGalleryList();
            dragTreeManager.init();
          },
          error: function(data) {
          }
        });
      }


      AssetBrowser.close();
    },
    error: function(data, status, e) {
      console.log(data);
      console.log(e);
    }
  })

  return false;

}



function initJcrop(image_type, w, h) {
  var ratio = w/(h*1.0);
  $('#' + image_type + "_image").Jcrop({
    aspectRatio: ratio,
    onSelect: function(c) {
      $('#' + image_type + '_x').val(c.x);
      $('#' + image_type + '_y').val(c.y);
      $('#' + image_type + '_w').val(c.w);
      $('#' + image_type + '_h').val(c.h);
    },
    setSelect: [0, 0, w, h],
    minSize: [w, h]
  });
}



function updateCoords(c) {

};






function initPublishedDateTime() {


  $(".publishing_state").change(function(){
    updatePublishedDateField()
  })

  function updatePublishedDateField(){
    if($(".publishing_state").val()=="published"){
      $(".published_at").show()
    }else{
      $(".published_at").hide()
    }
  }
  updatePublishedDateField()
}



function initEditGalleryList() {
  $(".delete_gallery_item").click(delete_event_handler_for_gallery_list)

}

function delete_event_handler_for_gallery_list() {
  id = $(this).attr("rel")
  $("#progress_" + id).show("fast")
  $.ajax({
    url: $(this).attr("data-url"),
    type: "GET",
    success: function(data) {
      $("#node-" + id).remove();
    }
  });
}

var selected_assets_ids = [];
function initBulkDeleteAsset(){
  $(".delete_selected_assets").hide();
  $(".select_asset_checkbox").click(function(e){
    if($(this).is(':checked')){
      selected_assets_ids.push($(this).attr("rel"));
      $(".delete_selected_assets").show();
    }else{
      selected_assets_ids.remove($(this).attr("rel"))
      if(selected_assets_ids.length <= 0){
        $(".delete_selected_assets").hide();
      }
    }
  });

  $(".select_all_assets").click(function(e){
    var status = $(".select_all_assets").is(':checked');
    $(".select_asset_checkbox").attr('checked', status);
    selected_assets_ids = [];
    if($(".select_all_assets").is(':checked')){
      $(".select_asset_checkbox").each(function(){
           selected_assets_ids.push($(this).attr("rel"));
      });
      $(".delete_selected_assets").show();
    }else{
      selected_assets_ids = [];
      $(".delete_selected_assets").hide();
    }

  });

  $(".delete_selected_assets").click(function(e){
    if(selected_assets_ids == null || selected_assets_ids.length <= 0){
      alert("Please select at least one asset.")
    }else{
      var answer = confirm("Are you sure to delete all selected assets?")
      if(answer){
        $("form#delete_selected_assets_form input").val(selected_assets_ids);
        $("form#delete_selected_assets_form").submit();
      }
    }

  });
}



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

// Audio

function setUpAudio(){
  soundManager.setup({
    useFlashBlock: true, // optional - if used, required flashblock.css
    url: '/swf/', // required: path to directory containing SM2 SWF files
    debugMode: false
  });
  // basicMP3Player = new BasicMP3Player();
  // console.log(basicMP3Player)
}

function setUp360(){

}

function stopAudio(){
  if(!blank(basicMP3Player) && basicMP3Player.lastSound !== null){
    basicMP3Player.stopSound(basicMP3Player.lastSound);
  }
}