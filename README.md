@danwrong will hate me for this, but here it is.

Loadrunner Signals
------------------

This plugin extends [Loadrunner](https://github.com/danwrong/loadrunner) to depend on arbitrarily triggered
events which need only be fired once.

To depend on an arbitrary signal, foo:

    using('>foo', function() { ... });

This will not trigger the loading of any files.
Events do not pass any parameters to the function block.

To trigger an event foo, and so execute the function block above:

    signal('foo');

If a new 'using' block depends on an event that has already been fired,
it will fired immediately.  This behaviour is similar to common domReady
libraries.

EVENTS ARE CONSIDERED AN ANTI-PATTERN FOR SCRIPT LOADING.
ONLY USE IF THE SCRIPT AND MODULE TYPES CANNOT BE USED.

There is a risk that this will become a plague upon your codebase.  So be it.