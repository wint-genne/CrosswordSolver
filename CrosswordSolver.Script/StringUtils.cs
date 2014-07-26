using System.Html;
using jQueryApi;

namespace CrosswordSolver.Script
{
    public static class StringUtils
    {
        public static string PadRight(this string str, int num, char chr)
        {
            if (str.Length > num) return str.Substr(0, num);
            for (var i = str.Length; i < num; i++)
            {
                str += chr.ToString();
            }
            return str;
        }
    }
}
