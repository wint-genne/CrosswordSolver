using System;
using System.Collections.Generic;
using System.Linq;
using System.Serialization;
using System.Text.RegularExpressions;
using jQueryApi;

namespace CrosswordSolver.Script
{
    internal class DataContext
    {
        public const char PatternAnyChar = '◻';

        private static PatternRequest CreatePattern(PatternViewModel[] patterns)
        {
            var anyCharRegexp = new Regex(PatternAnyChar.ToString(), "g");
            var request = new PatternRequest();
            var otherPatterns = new List<OtherPattern>();
            foreach (var pattern in patterns)
            {
                otherPatterns.Add(new OtherPattern
                {
                    Pattern = pattern.Pattern.Value.Replace(anyCharRegexp, "?"),
                    DX = pattern.DX.Value,
                    DY = pattern.DY.Value,
                    Direction = pattern.Direction.Value
                });
            }
            request.OtherPatterns = otherPatterns.ToArray();
            return request;
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
            return AjaxRequest("POST", SolveUrl(), 
                               new JsDictionary<string, object>("pattern", CreatePattern(viewModel.Patterns.Value),
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
                Data = Json.Stringify(data)
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
            return "/solve/post";
        }
    }
}