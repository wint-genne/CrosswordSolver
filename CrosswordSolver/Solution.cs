using System.Collections;
using System.Collections.Generic;
using System.Linq;
using MS.Internal.Xml.XPath;

namespace CrosswordSolver
{
    internal class Solution
    {
        private List<PositionedWord> _words = new List<PositionedWord>();

        private class PositionedWord
        {
            private readonly int _x;
            private readonly int _y;
            private readonly Direction _direction;
            private readonly string _word;

            public PositionedWord(int x, int y, Direction direction, string word)
            {
                _x = x;
                _y = y;
                _direction = direction;
                _word = word;
            }

            public bool ConflictsWith(PositionedWord positionedWord)
            {
                if (_direction == positionedWord._direction) return false;
                int cx;
                int cy;
                GetCrossingPosition(positionedWord, out cx, out cy);
                return GetChar(cx, cy) != positionedWord.GetChar(cx, cy);
            }

            private char GetChar(int x, int y)
            {
                return _direction == Direction.Down ? _word[y - _y] : _word[x - _x];
            }

            private void GetCrossingPosition(PositionedWord positionedWord, out int cx, out int cy)
            {
                if (_direction == Direction.Down)
                {
                    cx = _x;
                    cy = positionedWord._y;
                }
                else
                {
                    cx = positionedWord._x;
                    cy = _y;
                }
            }
        }

        public Solution()
        {
            
        }

        public Solution(Solution otherSolution)
        {
            _words = otherSolution._words.ToList();
        }

        public bool Add(int x, int y, Direction direction, string word)
        {
            var positionedWord = new PositionedWord(x, y, direction, word);
            foreach (var addedWord in _words)
            {
                if (addedWord.ConflictsWith(positionedWord))
                {
                    return false;
                }
            }
            _words.Add(positionedWord);
            return true;
        }
    }
}