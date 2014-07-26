namespace CrosswordSolver.Script
{
    public class MatchViewModel
    {
        public MatchViewModel(object match)
        {
            Word = (string)match;
            GoogleUrl = "https://www.google.se/search?q=" + Word;
            WikipediaUrl = "http://sv.wikipedia.org/wiki/" + Word;
        }

        public string Word;
        public string GoogleUrl;
        public string WikipediaUrl;
    }
}