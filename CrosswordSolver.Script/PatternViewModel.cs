using KnockoutApi;

namespace CrosswordSolver.Script
{
    public class PatternViewModel
    {
        public Observable<string> Pattern = Knockout.Observable("");
        public Observable<int> NumLetters = Knockout.Observable(1);
        public Observable<Direction> Direction = Knockout.Observable(Script.Direction.Right);
        public Observable<int> DX = Knockout.Observable(0);
        public Observable<int> DY = Knockout.Observable(0);

        public void ClearPattern()
        {
            Pattern.Value = "";
        }
    }
}