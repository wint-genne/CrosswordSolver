using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using CrosswordSolver;

namespace CrowsswordSolver.Mvc.Controllers
{
    public class SolveController : Controller
    {
        // POST api/solve
        public ActionResult Post(PatternRequest pattern, string searchAfterWord = null)
        {
            return Json(LiveSolver.Solver.FindSolutions(pattern, searchAfterWord).Take(10).ToArray());
        }
    }
}
