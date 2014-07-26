using System;
using System.Collections.Generic;
using System.Html;
using System.Linq;
using System.Runtime.CompilerServices;
using KnockoutApi;

namespace CrosswordSolver.Script
{
    public class ListViewModel
    {
        private static string[] ReadPreviousPatterns()
        {
            var patternsString = (Window.LocalStorage.GetItem("previousPatterns") ?? "");
            return patternsString != "" ? patternsString.Split(",") : new string[0];
        }

        private void AddToPreviousPattern()
        {
            var patternVal = string.Join(" ", Patterns.Value.Select(p => p.Pattern.Value));
            if (patternVal == "") return;
            var patterns = new List<string>(ReadPreviousPatterns());
            if (patterns.IndexOf(patternVal) != -1) return;
            patterns.Add(patternVal);
            while (patterns.Count > 16)
                patterns.RemoveAt(16);
            PreviousPatterns.Value = patterns.ToArray();
            Window.LocalStorage.SetItem("previousPatterns", string.Join(",", patterns));
        }

        public Observable<string> Error = Knockout.Observable<string>();
        public ObservableArray<MatchViewModel> Matches = Knockout.ObservableArray<MatchViewModel>();

        public void Search()
        {
            AddToPreviousPattern();
            Action addSucceeded = () =>
            {
                Searched.Value = true;
                Searched.Value = false;
            };

            Action addFailed = () => {
                  Error.Value = "Något gick fel...";
            };

            DataContext.Search(this, true)
                       .Done(addSucceeded)
                       .Fail(addFailed);

        }

        public ObservableArray<int> Shortcuts =
            Knockout.ObservableArray(new[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15});
        public ObservableArray<string> PreviousPatterns = Knockout.ObservableArray(ReadPreviousPatterns());
        public ObservableArray<PatternViewModel> Patterns = Knockout.ObservableArray(new[] {new PatternViewModel()});
        public Observable<bool> Searched = Knockout.Observable(false);
        public Observable<bool> HasMore = Knockout.Observable(false);

        public void LoadMore()
        {
            HasMore.Value = false;
            DataContext.Search(this, false)
                       .Fail(() => Error.Value = "Något gick fel...");
        }
    }
}