using System.Collections.Generic;

namespace CrosswordSolver
{
    public class PatternRequest
    {
        public int Test { get; set; }
        public OtherPattern[] OtherPatterns { get; set; }
    }

    public class OtherPattern
    {
        public Direction Direction { get; set; }
        public int DX { get; set; }
        public int DY { get; set; }

        public string Pattern { get; set; }
    }

    public enum Direction
    {
        Right,
        Down
    }
}