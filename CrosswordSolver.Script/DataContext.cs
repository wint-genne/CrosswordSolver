using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using jQueryApi;

namespace CrosswordSolver.Script
{
    internal class DataContext
    {
        public const char PatternAnyChar = '◻';

        private static string CreatePattern(string pattern)
        {
            var oldText = new Regex(PatternAnyChar.ToString());
            return pattern.Replace(oldText, "?");
        }

        public static jQueryXmlHttpRequest Search(ListViewModel viewModel, bool reset)
        {
            Callback getSucceeded = data =>
            {
                var mappedMatches = (data as object[]).Select(match => new MatchViewModel(match)).ToArray();
                if (reset)
                {
                    viewModel.Matches.RemoveAll();
                }
                foreach (var m in mappedMatches)
                {
                    viewModel.Matches.Push(m);
                }
                viewModel.HasMore.Value = mappedMatches.Length == 10;
                viewModel.Error.Value = null;
            };

            Action getFailed = () =>
            {
                viewModel.Error.Value = "Error retrieving todo lists.";
            };

            string searchAfterWord = null;
            if (!reset)
            {
                searchAfterWord = viewModel.Matches.Value.Last().Word;
            }
            return AjaxRequest("get", SolveUrl(),
                               new JsDictionary<string, object>("pattern", CreatePattern(viewModel.Patterns.Value[0].Pattern.Value),
                                                                "searchAfterWord", searchAfterWord))
                .Done(getSucceeded)
                .Fail(getFailed);
        }

        // Private
        private static jQueryXmlHttpRequest AjaxRequest(string type, string url, JsDictionary<string, object> data,
                                                 string dataType = null)
        {
            var options = new jQueryAjaxOptions
            {
                DataType = dataType ?? "json",
                ContentType = "application/json",
                Cache = false,
                Type = type,
                Data = data
            };
            var antiForgeryToken = jQuery.Select("#antiForgeryToken").GetValue();
            if (antiForgeryToken != null)
            {
                //options.Headers = {
                //    'RequestVerificationToken': antiForgeryToken
                //};
            }
            return jQuery.Ajax(url, options);
        }

        // routes
        private static string SolveUrl()
        {
            return "/api/solve";
        }
    }
}