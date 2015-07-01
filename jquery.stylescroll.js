(function ($) {
  
    $.fn.styleScroll = function (options) {
        var mergeCssStuffs, paramsExist, errorLog,
            settings, $elems,
            viewPortHeight, viewPortPos, viewPortBorderTop, viewPortBorderBottom, maxHeight,
            barHeight, height, width,
            realHeightOfCursorLane, marginTop, scrollingAreaHeight,
            lastY, cursorMinTop, cursorMaxTop,
            cursorMove, scrollDown, scrollUp, cursorMouseDown, bodyMouseUp, bodyMouseLeave,
            intervalFunc, stopIntervalFunc;

        // helper functions
        mergeCssStuffs = function (attributes) {
            var cssString = "";

            for (attr in attributes) {
                cssString = cssString + attr + ":" + attributes[attr] + "; ";
            }

          return cssString;
        };
        paramsExist = function (paramsAndMessages) {
            for (param in paramsAndMessages) {
                if (!settings.hasOwnProperty(param)) {
                    errorLog(paramsAndMessages[param]);
                    return false;
                }
            }
            return true;
        };
        errorLog = function (message) {
            console.log("StyleScroll error: " + message)
        };
        cursorMove = function (e) {
            var movement, cursorPosition;

            movement = e.clientY - lastY;
            cursorPosition = $elems.cursor.offset();
            cursorPosition.top += movement;

            if (cursorPosition.top >= cursorMinTop && cursorPosition.top <= cursorMaxTop) {
                $elems.cursor.offset(cursorPosition);
                $elems.viewPort.scrollTop(scrollingAreaHeight * ((cursorPosition.top - cursorMinTop)/realHeightOfCursorLane));
            }

            lastY = e.clientY;
        };
        scrollDown = function () {
            var cursorPosition = $elems.cursor.offset();
            cursorPosition.top += settings.step;

            if (cursorPosition.top > cursorMaxTop) {
                cursorPosition.top = cursorMaxTop;
            }

            $elems.cursor.offset(cursorPosition);
            $elems.viewPort.scrollTop(scrollingAreaHeight * ((cursorPosition.top - cursorMinTop)/realHeightOfCursorLane));
        };
        scrollUp = function () {
            var cursorPosition = $elems.cursor.offset();
            cursorPosition.top -= settings.step;

            if (cursorPosition.top < cursorMinTop) {
                cursorPosition.top = cursorMinTop;
            }

            $elems.cursor.offset(cursorPosition);
            $elems.viewPort.scrollTop(scrollingAreaHeight * ((cursorPosition.top - cursorMinTop)/realHeightOfCursorLane));
        };
        cursorMouseDown = function (e) {
            lastY = e.clientY;
            $elems.body.mousemove(cursorMove);

            $elems.scrollingArea.addClass("noselect").attr("unselectable", "on");
        };
        bodyMouseUp = function () {
            $elems.body.unbind('mousemove');
            $elems.scrollingArea.removeAttr('unselectable').removeClass("noselect");
        };
        bodyMouseLeave = function () {
            $elems.body.unbind('mousemove');
            $elems.scrollingArea.removeAttr('unselectable').removeClass("noselect");
        };
        stopIntervalFunc = function () {
            clearInterval(intervalFunc);
        };

        // merge default settings with options
        settings = $.extend({
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

        // DOM elements
        $elems = {};
        $elems.body = $("body");
        $elems.styleScroll = $("<div>").attr("id", settings.id);
        $elems.viewPort = $(this);
        $elems.scrollingArea = settings.hasOwnProperty('scrollingAreaSelector') ? settings.scrollingAreaSelector : $elems.viewPort.find("div").first();
        $elems.elementsInScrollingArea = $elems.scrollingArea.find("*");
        $elems.barContainer = $("<div>").attr("id", settings.id + "-container");
        $elems.cursor = $("<div>").attr("id", settings.id + "-cursor");


        // set the main container out to the wild
        $elems.body.append($elems.styleScroll);


        // initialize variables depends on viewport
        viewPortHeight = $elems.viewPort.height();
        viewPortPos = $elems.viewPort.position();
        viewPortBorderTop = parseInt($elems.viewPort.css("border-top-width"));
        viewPortBorderBottom = parseInt($elems.viewPort.css("border-bottom-width"));
        maxHeight = viewPortHeight - viewPortBorderTop - viewPortBorderBottom;


        // initialize variables according to the settings AND viewport
        barHeight = settings.hasOwnProperty('barHeight') ? settings.barHeight : maxHeight;
        height = barHeight;
        width = settings.barWidth;


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

            $elems.upButton = $("<div>").attr({
                id: settings.id + "-up-button",
                style: mergeCssStuffs({
                    "background-image": settings.upButtonImage,
                    "margin-bottom": settings.upButtonMarginBottom + "px",
                    "width": settings.upButtonWidth + "px",
                    "height": settings.upButtonHeight + "px"
                })
            });
            $elems.styleScroll.append($elems.upButton);

        }

        // continue initialization
        realHeightOfCursorLane = barHeight - settings.cursorHeight;
        marginTop = (viewPortHeight - height)/2;
        scrollingAreaHeight = $elems.scrollingArea.height()
                                  - viewPortHeight
                                  + parseInt($elems.viewPort.css("padding-top"))
                                  + parseInt($elems.viewPort.css("padding-bottom"))
                                  + parseInt($elems.elementsInScrollingArea.first().css("margin-top"))
                                  + parseInt($elems.elementsInScrollingArea.last().css("margin-bottom"));


        // set styles on the scroll div
        $elems.styleScroll.attr("style", mergeCssStuffs({
            "height": height + "px",
            "position": "absolute",
            "top": (viewPortPos.top + marginTop) + "px",
            "left": (viewPortPos.left + $elems.viewPort.width() + parseInt($elems.viewPort.css("padding-left")) - settings.marginRight - width) + "px",
            "text-align": "center"
        }));

        // set styles on bar and cursor and add them to the scroll div
        $elems.cursor.attr("style", mergeCssStuffs({
            "width": settings.cursorWidth + "px",
            "height": settings.cursorHeight + "px",
            "background-color": settings.cursorColor,
            "background-image": settings.cursorImage,
            "border-radius": settings.cursorBorderRadius + "px"
        }));
        $elems.barContainer.append($elems.cursor);

        $elems.barContainer.attr("style", mergeCssStuffs({
            "background-color": settings.barColor,
            "background-image": settings.barImage,
            "width": settings.barWidth + "px",
            "height": barHeight + "px",
            "border-radius": settings.barBorderRadius + "px"
        }));
        $elems.styleScroll.append($elems.barContainer);

        // main part: handle the cursor
        cursorMinTop = $elems.cursor.offset().top;
        cursorMaxTop = cursorMinTop + realHeightOfCursorLane;


        // add the downButton to the bar if necessary
        if (settings.buttonsEnable) {
            $elems.downButton = $("<div>").attr({
                id: settings.id + "-down-button",
                style: mergeCssStuffs({
                    "background-image": settings.downButtonImage,
                    "margin-top": settings.downButtonMarginTop + "px",
                    "width": settings.downButtonWidth + "px",
                    "height": settings.downButtonHeight + "px"
                })
            });
            $elems.styleScroll.append($elems.downButton);
        }


        // mouse events
        $elems.cursor.mousedown(cursorMouseDown);
        $elems.body.mouseup(bodyMouseUp);
        $elems.body.mouseleave(bodyMouseLeave);


        // events with buttons
        if (settings.buttonsEnable) {
            if (settings.scrollOnButtonOver) {
                $elems.upButton.mouseenter(function () {
                    if (settings.hasOwnProperty('upButtonActiveImage'))
                        $(this).css("background-image", settings.upButtonActiveImage);
                    intervalFunc = setInterval(scrollUp, settings.msBetweenTwoSteps);
                });

                $elems.downButton.mouseenter(function () {
                    if (settings.hasOwnProperty('downButtonActiveImage'))
                        $(this).css("background-image", settings.downButtonActiveImage);
                    intervalFunc = setInterval(scrollDown, settings.msBetweenTwoSteps)
                });
            }
            else {
                $elems.upButton.mousedown(function () {
                    if (settings.hasOwnProperty('upButtonActiveImage'))
                        $(this).css("background-image", settings.upButtonActiveImage);
                    intervalFunc = setInterval(scrollUp, settings.msBetweenTwoSteps);
                });

                $elems.downButton.mousedown(function () {
                    if (settings.hasOwnProperty('downButtonActiveImage'))
                        $(this).css("background-image", settings.downButtonActiveImage);
                    intervalFunc = setInterval(scrollDown, settings.msBetweenTwoSteps);
                });

                $elems.upButton.mouseup(function () {
                    if (settings.hasOwnProperty('upButtonActiveImage'))
                        $(this).css("background-image", settings.upButtonImage);
                    stopIntervalFunc();
                });

                $elems.downButton.mouseup(function () {
                    if (settings.hasOwnProperty('downButtonActiveImage'))
                        $(this).css("background-image", settings.downButtonImage);
                    stopIntervalFunc();
                });
            }

            $elems.upButton.mouseout(function () {
                if (settings.hasOwnProperty('upButtonActiveImage'))
                    $(this).css("background-image", settings.upButtonImage);
                stopIntervalFunc();
            });

            $elems.downButton.mouseout(function () {
                if (settings.hasOwnProperty('downButtonActiveImage'))
                    $(this).css("background-image", settings.downButtonImage);
                stopIntervalFunc();
            });
        }


        // mouse wheel events
        // Firefox
        $elems.viewPort.on('DOMMouseScroll', function(e){
            if(e.originalEvent.detail > 0) {
                scrollDown();
            } else {
                scrollUp();
            }

            //prevent page fom scrolling
            return false;
        });

        $elems.styleScroll.on('DOMMouseScroll', function(e){
            if(e.originalEvent.detail > 0) {
                scrollDown();
            } else {
                scrollUp();
            }

            //prevent page fom scrolling
            return false;
        });

         //IE, Opera, Safari
        $elems.viewPort.on('mousewheel', function(e){
            if(e.originalEvent.wheelDelta < 0) {
                scrollDown();
            } else {
                scrollUp();
            }

            //prevent page fom scrolling
            return false;
        });

        $elems.styleScroll.on('mousewheel', function(e){
            if(e.originalEvent.wheelDelta < 0) {
                scrollDown();
            } else {
                scrollUp();
            }

            //prevent page fom scrolling
            return false;
        });

    };
}(jQuery));