using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CrosswordSolver;

namespace CrowsswordSolver.Mvc.Controllers
{
    public class SolveController : ApiController
    {
        // GET api/solve
        public IEnumerable<string> Get(string pattern, string searchAfterWord = null)
        {
            return LiveSolver.Solver.FindSolutions(new Pattern(pattern), searchAfterWord).Take(10);
        }

    }
}
