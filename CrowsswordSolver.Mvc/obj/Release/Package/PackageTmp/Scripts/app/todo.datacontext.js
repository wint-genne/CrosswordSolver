window.todoApp = window.todoApp || {};

window.todoApp.datacontext = (function () {

    var datacontext = {
        search: search,
    };

    return datacontext;
    
    function createPattern(pattern) {
        return pattern.replace(new RegExp(patternAnyChar, "g"), "?");
    }

    function search(matchesObservable, patternObservable, errorObservable, hasMore, searchAfterWord) {
        return ajaxRequest("get", solveUrl(), { pattern: createPattern(patternObservable()), searchAfterWord: searchAfterWord })
            .done(getSucceeded)
            .fail(getFailed);

        function getSucceeded(data) {
            var mappedMatches = $.map(data, function (match) { return new createMatch(match); });
            if (searchAfterWord === undefined) {
                matchesObservable([]);
            }
            $.each(mappedMatches, function(i, m) {
                matchesObservable.push(m);
            });
            hasMore(mappedMatches.length == 10);
            errorObservable(null);
        }

        function getFailed() {
            errorObservable("Error retrieving todo lists.");
        }
    }
    function createMatch(data) {
        return new datacontext.match(data); // todoList is injected by todo.model.js
    }

    // Private
    function clearErrorMessage(entity) { entity.errorMessage(null); }
    function ajaxRequest(type, url, data, dataType) { // Ajax helper
        var options = {
            dataType: dataType || "json",
            contentType: "application/json",
            cache: false,
            type: type,
            data: data ? data : null
        };
        var antiForgeryToken = $("#antiForgeryToken").val();
        if (antiForgeryToken) {
            options.headers = {
                'RequestVerificationToken': antiForgeryToken
            };
        }
        return $.ajax(url, options);
    }
    // routes
    function solveUrl() { return "/api/solve"; }

})();