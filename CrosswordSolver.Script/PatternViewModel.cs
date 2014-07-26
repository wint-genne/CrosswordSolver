using KnockoutApi;

namespace CrosswordSolver.Script
{
    public class PatternViewModel
    {
        public Observable<string> Pattern = Knockout.Observable("");
        public Observable<int> NumLetters = Knockout.Observable(1);

        public void ClearPattern()
        {
            Pattern.Value = "";
        }
    }
}