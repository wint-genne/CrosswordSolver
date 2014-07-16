using System;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CrosswordSolver
{
    public class Pattern
    {
        public Regex RegularExpression { get; private set; }

        public Pattern(string input)
        {
            RegularExpression = new Regex("^" + input.Replace("?", @"\w") + "$", RegexOptions.IgnoreCase);
        }
    }
}
