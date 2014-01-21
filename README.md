Style ScrollBar
=================

Scrollbar plugin for jQuery designed to be completely styleable.

What does that mean, completely styleable?
------------------

There were many times when I found myself trying make a scrollbar from a very beatufil - so very complex design with other scrollbar libraries that are already out in the wild. It was extremely hard - to achieve the exact width and height for
the buttons, for the bar and so on. So I decided to make a really styleable jQuery scrollbar plugin for myself and after that release it out to the web.

The usage is very simple: call the styleScroll() function with any jQuery object. So for example:
$("#div-i-want-to-scroll").styleScroll();

The functions accept an options object with you can set the parameters, for example:
$("#div-i-want-to-scroll").styleScroll({
  cursorColor: "#3F3F3F,
  cursorBorderRadius: 10,
  barColor: "lightgray",
  barBorderRadius: 10
});

Parameters
----------
*Viewport*: means the div which is selected with the jQuery and which is containing the scrollbar.

### marginRight
Distance between the viewport right margin and scrollbar.
**Default: 0**
### buttonsEnable
Are the buttons enabled? If yes you have to set: *upButtonWidth*, *upButtonHeight*, *downButtonWidth*, *downButtonHeight*, *upButtonImage*, *downButtonImage* parameters as well.
**Default: false**
### upButtonMarginBottom
Up buttons's bottom margin (between the button and the scrollbar).
**Default: 0**
### upButtonImage
Up buttons's image (valid css url). It is needed if buttonsEnable is true.
### upButtonActiveImage
If set, this will be the up button's image when active (hover or pressed, depends on *scrollOnButtonOver*) (valid css url).
### upButtonWidth
Up buttons's width. It is needed if buttonsEnable is true.
### upButtonHeight
Up buttons's height. It is needed if buttonsEnable is true.
### downButtonMarginTop
Down buttons's top margin (between the button and the scrollbar).
**Default: 0**
### downButtonImage
Down buttons's image (valid css url). It is needed if buttonsEnable is true.
### downButtonActiveImage
If set, this will be the down button's image when active (hover or pressed, depends on *scrollOnButtonOver*) (valid css url).
### downButtonWidth
Down buttons's width. It is needed if buttonsEnable is true.
### downButtonHeight
Down buttons's height. It is needed if buttonsEnable is true.
### scrollOnButtonOver
If true, you can scroll with moving the mouse over the button.
**Default: false**
### step
Distance in pixel the cursor is moving with one step.
**Default: 20**
### msBetweenTwoSteps
Miliseconds between two step.
**Default: 100**
### barWidth
Width of the bar.
**Default: 20**
### barHeight
Height of the bar.
### barColor
Color of the bar (valid css).
**Default: transparent**
### barImage
Image of the bar (valid css url).
### barBorderRadius
Bar border radius.
**Default: 0**
### cursorWidth
Width of the cursor.
**Default: 20**
### cursorHeight
Height of the cursor.
**Default: 50**
### cursorColor
Color of the cursor.
**Default: #3F3F3F**
### cursorImage
Image of the cursor (valid css url).
### cursorBorderRadius
Cursor border radius.
**Default: 10**
### id
Id attribute of the scrollbar container (so you can style or select it).
**Default: style-scroll-bar**
### scrollingAreaSelector
Selector of the area that will be scrolled (valid css selector).
**Default: the first div in the viewport**

License: you can do whatever you want with that, but i dont have any responsibility about anything :)

Help or question:
If you have any question about the plugin, or something is unclear feel free to drop me an email at qiwelmen@gmail.com.
