using KnockoutApi;

namespace CrosswordSolver.Script
{
    public static class BindingHandlers
    {
        public static void Setup()
        {
            Knockout.BindingHandlers["scrollTo"] = new ScrollToBindingHandler();
            Knockout.BindingHandlers["whenVisible"] = new WhenVisibleBindingHandler();
            Knockout.BindingHandlers["numLetterMask"] = new NumLetterMaskBindingHandler();
            Knockout.BindingHandlers["collapseShow"] = new CollapseShowBindingHandler();
        }
    }
}
