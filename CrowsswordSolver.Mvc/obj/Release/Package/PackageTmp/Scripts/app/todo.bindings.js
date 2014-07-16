var patternAnyChar = "◻";

// Hooks up a form to jQuery Validation
ko.bindingHandlers.validate = {
    init: function (elem, valueAccessor) {
        $(elem).validate();
    }
};

ko.bindingHandlers.scrollTo = {
    update: function(elem, valueAccessor) {
        if (valueAccessor()) {
            $('html, body').animate({
                scrollTop: $(elem).offset().top
            }, 1000);
        }
    }
};

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
      && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

ko.bindingHandlers.whenVisible = {
    init: function(elem, valueAccessor) {
        $(window).scroll(function()
        {
            if (isScrolledIntoView(elem)) {
                valueAccessor()();
            }
        });
    }
};

function padRight(str, num, chr) {
    if (str.length > num) return str.substr(0, num);
    for (var i = str.length; i < num; i++) {
        str += chr;
    }
    return str;
}

(function ($) {
    $.fn.getCursorPosition = function() {
        var input = this.get(0);
        if (!input) return; // No (input) element found
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if (document.selection) {
            // IE
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    };
})(jQuery);

function updateValFixedCursor(input, newVal, triggerChange) {
    var cursorPosition = input.getCursorPosition();
    input.val(newVal);
    if (triggerChange) input.change();
    input[0].setSelectionRange(cursorPosition, cursorPosition);
}

function deleteCharacterAtCurrentPosition(input) {
    var cursorPosition = input.getCursorPosition();
    updateValFixedCursor(input, (input.val().substr(0, cursorPosition) + input.val().substr(cursorPosition + 1)));
}

ko.bindingHandlers.numLetterMask = {
    update: function (elem, valueAccessor) {
        $(elem).unbind("keypress").bind("keypress", function (ev) {
            deleteCharacterAtCurrentPosition($(elem));
        });
        $(elem).unbind("keyup").bind("keyup", function (ev) {
            updateValFixedCursor($(elem), $(elem).val().replace(' ', patternAnyChar).toUpperCase(), true);
        });
        $(elem).attr("maxlength", valueAccessor());
        var pos = $(elem).getCursorPosition();
        $(elem).val(padRight($(elem).val(), valueAccessor(), patternAnyChar));
        $(elem).change().focus();
        elem.setSelectionRange(pos, pos);
    }
};

// Controls whether or not the text in a textbox is selected based on a model property
ko.bindingHandlers.selected = {
    init: function (elem, valueAccessor) {
        $(elem).blur(function () {
            var boundProperty = valueAccessor();
            if (ko.isWriteableObservable(boundProperty)) {
                boundProperty(false);
            }
        });
    },
    update: function (elem, valueAccessor) {
        var shouldBeSelected = ko.utils.unwrapObservable(valueAccessor());
        if (shouldBeSelected) {
            $(elem).select();
        }
    }
};

// Makes a textbox lose focus if you press "enter"
ko.bindingHandlers.blurOnEnter = {
    init: function (elem, valueAccessor) {
        //$(elem).keydown(function (evt) {
        //    window.setTimeout(function () {
        //        var next = null;
        //        if (evt.keyCode == 37 /* left */) {
        //            next = $(elem).parent().prev();
        //        } else if (evt.keyCode != 13) {
        //            next = $(elem).parent().next();
        //        }
        //        if (next != null && next.length > 0) {
        //            next.children().select().focus();
        //        } else {
        //            $(elem).select();
        //        }

        //    }, 1);
        //});
        $(elem).keyup(function (evt) {
                var next = null;
                if (evt.keyCode == 37 /* left */) {
                    next = $(elem).parent().prev();
                } else if (evt.keyCode != 13) {
                    next = $(elem).parent().next();
                }
                if (next != null && next.length > 0) {
                    window.setTimeout(function() {
                        next.children().select().focus();
                    }, 1000);
                } else {
                    $(elem).select();
                }
        });
    }
};

// Simulates HTML5-style placeholders on older browsers
ko.bindingHandlers.placeholder = {
    init: function (elem, valueAccessor) {
        var placeholderText = ko.utils.unwrapObservable(valueAccessor()),
            input = $(elem);

        input.attr('placeholder', placeholderText);

        // For older browsers, manually implement placeholder behaviors
        if (!Modernizr.input.placeholder) {
            input.focus(function () {
                if (input.val() === placeholderText) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function () {
                setTimeout(function () {
                    if (input.val() === '' || input.val() === placeholderText) {
                        input.addClass('placeholder');
                        input.val(placeholderText);
                    }
                }, 0);
            }).blur();

            input.parents('form').submit(function () {
                if (input.val() === placeholderText) {
                    input.val('');
                }
            });
        }
    }
};