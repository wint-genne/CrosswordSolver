using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace CrosswordSolver
{
    public static class LiveSolver
    {
        public static Solver Solver { get; private set; }

        static LiveSolver()
        {
            Solver = new Solver(ParseAllWords(), WordInfoProvider);
        }

        private static IEnumerable<string> ParseAllWords()
        {
            return
                new StreamReader(
                    Assembly.GetExecutingAssembly().GetManifestResourceStream("CrosswordSolver.swedish-word-list"))
                    .ReadToEnd().Split('\n');
            return File.ReadAllLines("swedish-word-list");
        }

        private static string WordInfoProvider(string arg)
        {
            return null;
        }
    }
    public class Solver
    {
        private readonly IEnumerable<string> _allWords;
        private readonly Func<string, string> _wordInfoProvider;

        public Solver(IEnumerable<string> allWords, Func<string, string> wordInfoProvider = null)
        {
            _allWords = allWords;
            _wordInfoProvider = wordInfoProvider;
        }

        public IEnumerable<string> FindSolutions(Pattern pattern, string searchAfterWord)
        {
            var allWords = _allWords;
            if (searchAfterWord != null)
            {
                allWords = allWords.SkipWhile(w => w != searchAfterWord).Skip(1);
            }
            return allWords.Where(word => IsMatch(word, pattern));
        }

        private static bool IsMatch(string word, Pattern pattern)
        {
            return pattern.RegularExpression.IsMatch(word);
        }

        public float GetKeywordMatch(string word, string keywords)
        {
            var keywordsArray = keywords.Split(' ');
            var wordInfo = GetWordInfo(word);
            if (wordInfo == null) return 0;

            return keywordsArray.Sum(keyword => GetKeywordPoints(wordInfo, keyword));
        }

        private static float GetKeywordPoints(string wordInfo, string keyword)
        {
            return wordInfo.ToLower().Split(' ').Count(w => w == keyword);
        }

        private string GetWordInfo(string word)
        {
            return _wordInfoProvider != null ? _wordInfoProvider(word) : null;
        }
    }
}