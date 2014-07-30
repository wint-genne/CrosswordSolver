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
            if (input.Value == newVal) return;

            var selectionStart = input.SelectionStart;
            var selectionEnd = input.SelectionEnd;
            input.Value = newVal;
            if (triggerChange) jQuery.FromElement(input).Change();
            input.SetSelectionRange(selectionStart, selectionEnd);
        }

        private static void DeleteCharacterAtCurrentPosition(InputElement input, string replacementString = "")
        {
            var cursorPosition = input.SelectionStart;
            if (cursorPosition >= input.MaxLength)
            {
                cursorPosition = input.MaxLength - 1;
            }
            UpdateValFixedCursor(input, (input.Value.Substr(0, cursorPosition) + replacementString + input.Value.Substr(cursorPosition + 1)), false);
        }

        public override object Init(Element elem, Func<object> valueAccessor, Func<System.Collections.JsDictionary> allBindingsAccessor, object viewModel)
        {
            var inputElement = (InputElement)elem;
            jQuery.FromElement(elem).Keypress(ev => KeyPress(ev, inputElement));
            jQuery.FromElement(elem).Keyup(ev => KeyUp(inputElement));
            jQuery.FromElement(elem).Keydown(ev => KeyDown(ev, inputElement));
            return null;
        }

        private static void KeyDown(jQueryEvent ev, InputElement inputElement)
        {
            if (ev.Which == 8)
            {
                ev.PreventDefault();
                inputElement.SelectionStart--;
                inputElement.SelectionEnd = inputElement.SelectionStart;
                DeleteCharacterAtCurrentPosition(inputElement, DataContext.PatternAnyChar.ToString());
            }
        }

        public override void Update(Element elem, Func<object> valueAccessor,
                                    Func<System.Collections.JsDictionary> allBindingsAccessor, object viewModel)
        {
            var inputElement = (InputElement)elem;
            var numLetters = (int)valueAccessor();
            jQuery.FromElement(elem).Attribute("maxlength", numLetters.ToString());
            var pos = inputElement.SelectionStart;
            jQuery.FromElement(elem).Value(jQuery.FromElement(elem).GetValue().PadRight(numLetters, DataContext.PatternAnyChar).Substr(0, numLetters));
            jQuery.FromElement(elem).Change().Focus();
            inputElement.SelectionStart = pos;
            inputElement.SelectionEnd = pos;
            //inputElement.SetSelectionRange(pos, pos);
        }

        private static void KeyPress(jQueryEvent ev, InputElement inputElement)
        {
            var c = ((char) ev.Which).ToString().ToUpper()[0];
            if (c >= 'A' && c <= 'Z' || c == 'Å' || c == 'Ä' || c == 'Ö')
            {
                DeleteCharacterAtCurrentPosition(inputElement);
            }
            else
            {
                ev.PreventDefault();
            }
        }

        private static void KeyUp(InputElement inputElement)
        {
            var toUpperCase = jQuery.FromElement(inputElement).GetValue().Replace(' ', DataContext.PatternAnyChar).ToUpperCase();
            UpdateValFixedCursor(inputElement, toUpperCase, true);
        }
    }
}