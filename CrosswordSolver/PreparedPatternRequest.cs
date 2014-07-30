using System.Collections.Generic;
using System.Linq;

namespace CrosswordSolver
{
    internal class PreparedPatternRequest
    {
        public PreparedPatternRequest(PatternRequest pattern)
        {
            OtherPatterns = pattern.OtherPatterns.Select(o => new _OtherPattern(o)).ToArray();
        }

        public IEnumerable<_OtherPattern> OtherPatterns { get; set; }

        internal class _OtherPattern
        {
            public Direction Direction { get; set; }
            public int DX { get; set; }
            public int DY { get; set; }

            public Pattern Pattern { get; set; }

            public _OtherPattern(OtherPattern otherPattern)
            {
                Direction = otherPattern.Direction;
                DX = otherPattern.DX;
                DY = otherPattern.DY;
                Pattern = new Pattern(otherPattern.Pattern);
            }
        }
    }
}