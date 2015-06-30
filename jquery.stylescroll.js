(function ($) {
  
  $.fn.styleScroll = function (options) {

    // helper functions
    function mergeCssStuffs(attributes) {
      var cssString = "";

      for (attr in attributes) {
        cssString = cssString + attr + ":" + attributes[attr] + "; ";
      }

      return cssString;
    }
    function paramsExist(paramsAndMessages) {

      for (param in paramsAndMessages) {
        if (!settings.hasOwnProperty(param)) {
          errorLog(paramsAndMessages[param]);
          return false;
        }
      }

      return true;
    }
    function errorLog(message) {
      console.log("StyleScroll error: " + message)
    }

    var settings = $.extend({
      downButtonMarginTop: 0,
      upButtonMarginBottom: 0,
      scrollOnButtonOver: false,
      marginRight: 0,
      buttonsEnable: false,
      barWidth: 20,
      barColor: "transparent",
      barImage: "none",
      barBorderRadius: 0,
      cursorWidth: 20,
      cursorHeight: 50,
      cursorColor: "#3F3F3F",
      cursorImage: "none",
      cursorBorderRadius: 10,
      step: 5,
      msBetweenTwoSteps: 100,
      id: "style-scroll-bar"
    }, options);

    // set the main container out to the wild
    $("body").append("<div id=" + settings.id  + "></div>");
    var styleScroll = $("#" + settings.id);

    // initialize variables depends on viewport
    var viewPort = $(this);
    var viewPortHeight = viewPort.height();
    var viewPortPos = viewPort.position();
    var viewPortBorderTop = parseInt(viewPort.css("border-top-width"));
    var viewPortBorderBottom = parseInt(viewPort.css("border-bottom-width"));
    var maxHeight = viewPortHeight - viewPortBorderTop - viewPortBorderBottom;

    // initialize variables according to the settings AND viewport
    var barContainerId = settings.id + "-container";
    var cursorId = settings.id + "-cursor";
    var barHeight = settings.hasOwnProperty('barHeight') ? settings.barHeight : maxHeight;
    var height = barHeight;
    var width = settings.barWidth;
    // making changes if buttons are enabled
    if (settings.buttonsEnable) {

      if (!paramsExist({
        "upButtonWidth": "You need to set the upButtonWidth parameter if set buttonsEnable true.",
        "upButtonHeight": "You need to set the upButtonHeight parameter if set buttonsEnable true.",
        "downButtonWidth": "You need to set the downButtonWidth parameter if set buttonsEnable true.",
        "downButtonHeight": "You need to set the downButtonHeight parameter if set buttonsEnable true.",
        "upButtonImage": "You need to set the downButtonBackgroundImage parameter if set buttonsEnable true.",
        "downButtonImage": "You need to set the downButtonBackgroundImage parameter if set buttonsEnable true."
        })) {
        return this;
      }
      if (settings.hasOwnProperty('barHeight')) {
        height = settings.upButtonHeight + settings.upButtonMarginBottom + settings.downButtonHeight + settings.downButtonMarginTop + barHeight;  
      } else {
        height = maxHeight;
        barHeight = height - settings.upButtonHeight - settings.upButtonMarginBottom - settings.downButtonHeight - settings.downButtonMarginTop;
        if (barHeight <= 0) {
          errorLog("There is not enough room for the scrollbar with thhese settings.");
          return;
        }
      }
      
      width = settings.upButtonWidth > settings.downButtonWidth  ? settings.upButtonWidth : settings.downButtonWidth;
      width = width > settings.barWidth ? width : settings.barWidth;
      var upButtonId = settings.id + "-up-button";
      var downButtonId = settings.id + "-down-button";

      styleScroll.append('<div id="' + upButtonId + '" style="' + mergeCssStuffs({
        "background-image": settings.upButtonImage,
        "margin-bottom": settings.upButtonMarginBottom + "px",
        "width": settings.upButtonWidth + "px",
        "height": settings.upButtonHeight + "px"
      }) + '"></div>');

      var upButton = $("#" + upButtonId);      
    }
    // continue initialization
    var realHeightOfCursorLane = barHeight - settings.cursorHeight;
    var marginTop = (viewPortHeight - height)/2;
    var scrollingArea = settings.hasOwnProperty('scrollingAreaSelector') ? settings.scrollingAreaSelector : viewPort.find("div").first();
    var elementsInScrollingArea = scrollingArea.find("*");
    var scrollingAreaHeight = scrollingArea.height() 
                              - viewPortHeight 
                              + parseInt(viewPort.css("padding-top")) 
                              + parseInt(viewPort.css("padding-bottom")) 
                              + parseInt(elementsInScrollingArea.first().css("margin-top"))
                              + parseInt(elementsInScrollingArea.last().css("margin-bottom"));

    // variables corrsesponding the cursor
    var isCursorMoving = false;
    var lastY;


    styleScroll.attr("style", mergeCssStuffs({
        "height": height + "px",
        "position": "absolute",
        "top": (viewPortPos.top + marginTop) + "px",
        "left": (viewPortPos.left + viewPort.width() + parseInt(viewPort.css("padding-left")) - settings.marginRight - width) + "px",
        "text-align": "center"
      }));

    styleScroll.append('<div id="' + barContainerId + '" style="' + mergeCssStuffs({
      "background-color": settings.barColor,
      "background-image": settings.barImage,
      "width": settings.barWidth + "px",
      "height": barHeight + "px",
      "border-radius": settings.barBorderRadius + "px"
    }) + '"><div id="' + cursorId + '" style="' + mergeCssStuffs({
      "width": settings.cursorWidth + "px",
      "height": settings.cursorHeight + "px",
      "background-color": settings.cursorColor,
      "background-image": settings.cursorImage,
      "border-radius": settings.cursorBorderRadius + "px"
    }) + '"></div></div>');
    var barContainer = $("#" + barContainerId);
    var cursor = $("#" + cursorId);

    // main part: handle the cursor
    var cursorMinTop = cursor.offset().top;
    var cursorMaxTop = cursorMinTop + realHeightOfCursorLane;


    if (settings.buttonsEnable) {
      styleScroll.append('<div id="' + downButtonId + '" style="' + mergeCssStuffs({
          "background-image": settings.downButtonImage,
          "margin-top": settings.downButtonMarginTop + "px",
          "width": settings.downButtonWidth + "px",
          "height": settings.downButtonHeight + "px"
        }) + '"></div>');

      var downButton = $("#" + downButtonId);
    }

    // mouse events
    var cursorMove = function (e) {

      var movement = e.clientY - lastY;
      var scaleOfMovemenet = movement/realHeightOfCursorLane;
      var cursorPosition = cursor.offset();
      cursorPosition.top += movement;

      if (cursorPosition.top >= cursorMinTop && cursorPosition.top <= cursorMaxTop) {
        cursor.offset(cursorPosition);
        viewPort.scrollTop(scrollingAreaHeight * ((cursorPosition.top - cursorMinTop)/realHeightOfCursorLane));
      }

      lastY = e.clientY;
    };

    cursor.mousedown(function (e) {
      var inlineStyle;

      lastY = e.clientY;
      $("body").mousemove(cursorMove);

      scrollingArea.addClass("noselect").attr("unselectable", "on");
    });

    $("body").mouseup(function (e) {
      $("body").unbind('mousemove');
      scrollingArea.removeAttr('unselectable').removeClass("noselect");
    });

    $("body").mouseleave(function () {
      $("body").unbind('mousemove');
      scrollingArea.removeAttr('unselectable').removeClass("noselect");
    })

    var scrollDown = function scrollDown() {
      var cursorPosition = cursor.offset();
      cursorPosition.top += settings.step;

      if (cursorPosition.top > cursorMaxTop) {
        cursorPosition.top = cursorMaxTop;
      }

      cursor.offset(cursorPosition);
      viewPort.scrollTop(scrollingAreaHeight * ((cursorPosition.top - cursorMinTop)/realHeightOfCursorLane));
    }

    var scrollUp = function scrollDown() {
      var cursorPosition = cursor.offset();
      cursorPosition.top -= settings.step;

      if (cursorPosition.top < cursorMinTop) {
        cursorPosition.top = cursorMinTop;
      }

      cursor.offset(cursorPosition);
      viewPort.scrollTop(scrollingAreaHeight * ((cursorPosition.top - cursorMinTop)/realHeightOfCursorLane));
    }

    var intervalFunc;
    var stopIntervalFunc = function () {
      clearInterval(intervalFunc);
    }

    if (settings.buttonsEnable) {
      if (settings.scrollOnButtonOver) {
        upButton.mouseenter(function () {
          if (settings.hasOwnProperty('upButtonActiveImage'))
            $(this).css("background-image", settings.upButtonActiveImage);
          intervalFunc = setInterval(scrollUp, settings.msBetweenTwoSteps);
        });
        downButton.mouseenter(function () {
          if (settings.hasOwnProperty('downButtonActiveImage'))
            $(this).css("background-image", settings.downButtonActiveImage);
          intervalFunc = setInterval(scrollDown, settings.msBetweenTwoSteps)
        });
      }
      else {
        upButton.mousedown(function () {
          if (settings.hasOwnProperty('upButtonActiveImage'))
            $(this).css("background-image", settings.upButtonActiveImage);
          intervalFunc = setInterval(scrollUp, settings.msBetweenTwoSteps);
        });
        downButton.mousedown(function () {
          if (settings.hasOwnProperty('downButtonActiveImage'))
            $(this).css("background-image", settings.downButtonActiveImage);
          intervalFunc = setInterval(scrollDown, settings.msBetweenTwoSteps);
        });
        upButton.mouseup(function () {
          if (settings.hasOwnProperty('upButtonActiveImage'))
            $(this).css("background-image", settings.upButtonImage);
          stopIntervalFunc();
        });
        downButton.mouseup(function () {
          if (settings.hasOwnProperty('downButtonActiveImage'))
            $(this).css("background-image", settings.downButtonImage);
          stopIntervalFunc();
        });
      }

      upButton.mouseout(function () {
          if (settings.hasOwnProperty('upButtonActiveImage'))
            $(this).css("background-image", settings.upButtonImage);
          stopIntervalFunc();
      });
      downButton.mouseout(function () {
          if (settings.hasOwnProperty('downButtonActiveImage'))
            $(this).css("background-image", settings.downButtonImage);
          stopIntervalFunc();
      });
    }


    // mouse wheel events
    // Firefox
    viewPort.on('DOMMouseScroll', function(e){
      if(e.originalEvent.detail > 0) {
        scrollDown();
      }else {
        scrollUp();
      }

     //prevent page fom scrolling
     return false;
    });

    styleScroll.on('DOMMouseScroll', function(e){
      if(e.originalEvent.detail > 0) {
        scrollDown();
      }else {
        scrollUp();
      }

     //prevent page fom scrolling
     return false;
    });

     //IE, Opera, Safari
    viewPort.on('mousewheel', function(e){
      if(e.originalEvent.wheelDelta < 0) {
        scrollDown();
      }else {
        scrollUp();
      }


      //prevent page fom scrolling
      return false;
    });

    styleScroll.on('mousewheel', function(e){
      if(e.originalEvent.wheelDelta < 0) {
        scrollDown();
      }else {
        scrollUp();
      }


      //prevent page fom scrolling
      return false;
    });

  };

  
}(jQuery));