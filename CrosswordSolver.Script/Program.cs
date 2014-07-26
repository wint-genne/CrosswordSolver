using KnockoutApi;

namespace CrosswordSolver.Script
{
    class Program
    {
        static void Main()
        {
            BindingHandlers.Setup();
            Knockout.ApplyBindings(new ListViewModel());
        }
    }
}
