(function (ko, datacontext) {
    datacontext.match = match;

    function match(data) {
        var self = this;
        data = data || {};

        // Persisted properties
        self.word = data;
        self.googleUrl = "https://www.google.se/search?q=" + data;
        self.wikipediaUrl = "http://sv.wikipedia.org/wiki/" + data;

        self.toJson = function () { return ko.toJSON(self) };
    };

})(ko, todoApp.datacontext);