using System.Collections.Generic;
using System.IO;
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
}