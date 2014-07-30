using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace CrosswordSolver.Script
{
    public class PatternRequest
    {
        [ScriptName("Test")]
        public int Test;
        [ScriptName("OtherPatterns")]
        public OtherPattern[] OtherPatterns;

        public PatternRequest()
        {
            Test = 1;
        }
    }

    public class OtherPattern
    {
        [ScriptName("Direction")] public Direction Direction;

        [ScriptName("DX")] public int DX;

        [ScriptName("DY")] public int DY;

        [ScriptName("Pattern")] public string Pattern;
    }

    public enum Direction
    {
        Right,
        Down
    }

}