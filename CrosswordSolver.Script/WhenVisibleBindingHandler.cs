using System;
using System.Html;
using KnockoutApi;
using jQueryApi;

namespace CrosswordSolver.Script
{
    public class WhenVisibleBindingHandler : BindingHandler
    {
        public override object Init(System.Html.Element element, Func<object> valueAccessor,
                                    Func<System.Collections.JsDictionary> allBindingsAccessor, object viewModel)
        {
            jQuery.Window.Scroll(@event =>
            {
                if (jQuery.FromElement(element).Is(":visible") && IsScrolledIntoView(element))
                {
                    ((Action) valueAccessor())();
                }
            });
            return null;
        }

        private static bool IsScrolledIntoView(Element elem)
        {
            var docViewTop = jQuery.Window.GetScrollTop();
            var docViewBottom = docViewTop + jQuery.Window.GetHeight();

            var elemTop = jQuery.Select(elem).GetOffset().Top;
            var elemBottom = elemTop + jQuery.Select(elem).GetHeight();

            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
                    && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }

    }
}