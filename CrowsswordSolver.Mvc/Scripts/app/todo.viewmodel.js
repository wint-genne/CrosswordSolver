window.todoApp.todoListViewModel = (function (ko, datacontext) {
    function readPreviousPatterns() {
        var patternsString = (localStorage.previousPatterns || "");
        return patternsString != "" ? patternsString.split(",") : [];
    }

    function addToPreviousPattern() {
        var patternVal = pattern();
        if (patternVal == "") return;
        var patterns = readPreviousPatterns();
        if (patterns.indexOf(patternVal) != -1) return;
        patterns.push(pattern());
        while (patterns.length > 16)
            patterns = patterns.shift();
        previousPatterns(patterns);
        localStorage.previousPatterns = patterns;
    }
    var error = ko.observable(),
        matches = ko.observableArray(),
        search = function () {
            addToPreviousPattern();
            datacontext.search(matches, pattern, error, hasMore)
                .done(addSucceeded)
                .fail(addFailed);

            function addSucceeded() {
                searched(true);
                searched(false);
            }

            function addFailed() {
                error("Något gick fel...");
            }
        },
        shortcuts = ko.observableArray($.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], function(i) {
            return {
                num: i,
                select: function() {
                    numLetters(i);
                },
            };
        })),
        numLetters = ko.observable(1),
        previousPatterns = ko.observableArray(readPreviousPatterns());
    var pattern = ko.observable("");
    var searched = ko.observable(false);
    var hasMore = ko.observable(false);
    var loadMore = function () {
        hasMore(false);
        var lastWord = matches()[matches().length - 1].word;
        datacontext.search(matches, pattern, error, hasMore, lastWord)
            .fail(addFailed);

        function addFailed() {
            error("Något gick fel...");
        }
    };
    return {
        matches: matches,
        error: error,
        search: search,
        shortcuts: shortcuts,
        pattern: pattern,
        numLetters: numLetters,
        searched: searched,
        previousPatterns: previousPatterns,
        selectPattern: function (val) {
            numLetters(val.length);
            pattern(val);
            search();
        },
        clearPattern: function () { pattern(""); },
        loadMore: loadMore,
        hasMore: hasMore
    };

})(ko, todoApp.datacontext);

// Initiate the Knockout bindings
ko.applyBindings(window.todoApp.todoListViewModel);
