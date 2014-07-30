using System.Collections.Generic;
using System.Html;
using System.Runtime.CompilerServices;
using KnockoutApi;
using jQueryApi;

namespace CrosswordSolver.Script
{
    [Imported]
    [IgnoreNamespace]
    public static class BootstrapjQueryExtensions
    {
        [InstanceMethodOnFirstArgument]
        public static jQueryObject Collapse(this jQueryObject obj, object options)
        {
            return null;
        }
    }

    public class CollapseShowBindingHandler : BindingHandler
    {
        public override object Init(System.Html.Element element, System.Func<object> valueAccessor, System.Func<System.Collections.JsDictionary> allBindingsAccessor, object viewModel)
        {
            if ((bool) valueAccessor())
            {
                jQuery.FromElement(element).Collapse(new JsDictionary<string, object>("toggle", false));
                bool isFirstCollapse = false;
                if (isFirstCollapse)
                {
                    jQuery.FromElement(element).AddClass("in");
                }
                else
                {
                    Window.SetTimeout(() => jQuery.FromElement(element).Collapse("show"));
                }
            }
            return null;
        }
    }
}