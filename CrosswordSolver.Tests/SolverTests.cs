using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CrosswordSolver.Tests
{
    [TestClass]
    public class SolverTests
    {
        [TestMethod]
        public void TestSolver()
        {
            var word1 = "hej";
            var word2 = "nej";
            var solver = new Solver(new[] {word1, word2});
            TestSolver(solver, "h  ", word1);
            TestSolver(solver, "");
            TestSolver(solver, " ej", word1, word2);
        }

        [TestMethod]
        public void TestSolverManyWords()
        {
            var solver = new Solver(GenerateWords(1000000));
            var time = new Stopwatch();
            time.Start();
            var num = solver.FindSolutions(new PatternRequest{ OtherPatterns = new[]{ new OtherPattern{ Pattern = "     " }}}, null).Count();
            Debug.WriteLine(time.ElapsedMilliseconds);
        }

        private IEnumerable<string> GenerateWords(int i)
        {
            for (int j = 0; j < i; j++)
            {
                yield return "word" + j;
            }
        }

        private static void TestSolver(Solver solver, string pattern, params string[] matchingWords)
        {
            var solutions = solver.FindSolutions(new PatternRequest{ OtherPatterns = new[]{ new OtherPattern{ Pattern = pattern.Replace(" ", "?") }}}, null).ToArray();
            Assert.AreEqual(matchingWords.Length, solutions.Length);
            for (var i = 0; i < matchingWords.Length; i++)
            {
                Assert.AreEqual(matchingWords[i], solutions[i]);
            }
        }

        [TestMethod]
        public void TestRegexp()
        {
            Assert.IsFalse(new Regex("^$").IsMatch("hej"));
            Assert.IsTrue(new Regex(@"^\w\w\w$").IsMatch("hej"));
        }

        [TestMethod]
        public void TestMultiplePatterns()
        {
            PatternRequest pattern = new PatternRequest
            {
                OtherPatterns = new[]
                {
                    new OtherPattern
                    {
                        Pattern = "?e?",
                        Direction = Direction.Right
                    },
                    new OtherPattern
                    {
                        Pattern = "???",
                        Direction = Direction.Down,
                        DY = -2,
                        DX = 0
                    }
                }
            };
            var solutions = new Solver(new[] {"hej", "nej", "nah"}).FindSolutions(pattern).ToArray();
            Assert.AreEqual(1, solutions.Count());
            Assert.AreEqual("hej", solutions.Single());
        }
    }
}
