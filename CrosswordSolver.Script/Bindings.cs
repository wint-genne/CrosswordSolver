using System;
using System.Html;
using KnockoutApi;
using jQueryApi;

namespace CrosswordSolver.Script
{
    public static class BindingHandlers
    {
        public static void Setup()
        {
            Knockout.BindingHandlers["scrollTo"] = new ScrollToBindingHandler();
            Knockout.BindingHandlers["whenVisible"] = new WhenVisibleBindingHandler();
            Knockout.BindingHandlers["numLetterMask"] = new NumLetterMaskBindingHandler();
        }
    }

    public class ScrollToBindingHandler : BindingHandler
    {
        public override void Update(Element element, Func<object> valueAccessor,
                                    Func<System.Collections.JsDictionary> allBindingsAccessor, object viewModel)
        {
            if ((bool) valueAccessor())
            {
                jQuery.Select("html, body").Animate(new System.Collections.JsDictionary(
                                                        "scrollTop", jQuery.FromElement(element).GetOffset().Top));
            }
        }
    }
}
