using System;
using System.Html;
using KnockoutApi;
using jQueryApi;

namespace CrosswordSolver.Script
{
    public class NumLetterMaskBindingHandler : BindingHandler
    {
        private static void UpdateValFixedCursor(InputElement input, string newVal, bool triggerChange)
        {
            var cursorPosition = input.SelectionStart;
            input.Value = newVal;
            if (triggerChange) jQuery.FromElement(input).Change();
            input.SetSelectionRange(cursorPosition, cursorPosition);
        }

        private static void DeleteCharacterAtCurrentPosition(InputElement input)
        {
            var cursorPosition = input.SelectionStart;
            UpdateValFixedCursor(input, (input.Value.Substr(0, cursorPosition) + input.Value.Substr(cursorPosition + 1)), false);
        }

        public override void Update(Element elem, Func<object> valueAccessor,
                                    Func<System.Collections.JsDictionary> allBindingsAccessor, object viewModel)
        {
            var inputElement = (InputElement) elem;
            jQuery.FromElement(elem).Unbind("keypress").Bind("keypress", ev => DeleteCharacterAtCurrentPosition(inputElement));
            jQuery.FromElement(elem).Unbind("keyup").Bind("keyup", ev =>
            {
                var toUpperCase = jQuery.FromElement(elem).GetValue().Replace(' ', DataContext.PatternAnyChar).ToUpperCase();
                UpdateValFixedCursor(inputElement, toUpperCase, true);
            });
            var val = (int)valueAccessor();
            jQuery.FromElement(elem).Attribute("maxlength", val.ToString());
            var pos = inputElement.SelectionStart;
            jQuery.FromElement(elem).Value(jQuery.FromElement(elem).GetValue().PadRight(val, DataContext.PatternAnyChar));
            jQuery.FromElement(elem).Change().Focus();
            inputElement.SetSelectionRange(pos, pos);
        }
    }
}