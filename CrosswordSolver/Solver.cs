using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace CrosswordSolver
{
    public class Solver
    {
        private readonly IEnumerable<string> _allWords;
        private readonly Func<string, string> _wordInfoProvider;

        public Solver(IEnumerable<string> allWords, Func<string, string> wordInfoProvider = null)
        {
            _allWords = allWords;
            _wordInfoProvider = wordInfoProvider;
        }

        public IEnumerable<string> FindSolutions(PatternRequest pattern, string searchAfterWord = null)
        {
            var allWords = _allWords;
            if (searchAfterWord != null)
            {
                allWords = allWords.SkipWhile(w => w != searchAfterWord).Skip(1);
            }
            var preparedPatternRequest = new PreparedPatternRequest(pattern);
            return allWords.Where(word => IsMatch(word, preparedPatternRequest));
        }

        private bool IsMatch(string word, PreparedPatternRequest pattern)
        {
            var firstPattern = pattern.OtherPatterns.First();
            if (!firstPattern.Pattern.RegularExpression.IsMatch(word)) return false;

            var solution = new Solution();
            solution.Add(0, 0, firstPattern.Direction, word);
            var solutions = pattern.OtherPatterns.Skip(1).Aggregate((IEnumerable<Solution>)new List<Solution> { solution }, (currentSolutions, otherPattern) => IsOtherPatternMatch(otherPattern, currentSolutions));
            return solutions.Any();
        }

        private IEnumerable<Solution> IsOtherPatternMatch(PreparedPatternRequest._OtherPattern otherPattern, IEnumerable<Solution> solutions)
        {
            foreach (var solution in solutions)
            {
                var newSolutions = FindOtherPatternSolutions(otherPattern, solution);
                foreach (var newSolution in newSolutions)
                {
                    yield return newSolution;
                }
            }
        }

        private IEnumerable<Solution> FindOtherPatternSolutions(PreparedPatternRequest._OtherPattern otherPattern, Solution solution)
        {
            foreach (var word in _allWords.Where(w => otherPattern.Pattern.RegularExpression.IsMatch(w)))
            {
                var otherSolution = new Solution(solution);
                if (otherSolution.Add(otherPattern.DX, otherPattern.DY, otherPattern.Direction, word))
                {
                    yield return otherSolution;
                }
            }
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