/*
  Loadrunner Signals

  This plugin extends loadrunner to depend on arbitrarily triggered
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

*/
(function(context) {
  loadrunner(function(using, provide, loadrunner) {

    // This is the trigger method. Call signal('>thing');
    function signal(id) {
      var dep;
      if (id.charAt(0)=='>') id=id.substring(1);

      dep = new Signal(id);
      dep.complete();
    }

    var Signal = function(id) {
      this.id = id;
    }
    Signal.prototype = new loadrunner.Dependency;
    Signal.prototype.key = function() {
      return 'signal_' + this.id;
    }
    Signal.prototype.shouldFetch = function() {
      return false;
    }

    // To wait for a signal, do using('>thing', function() {...})
    using.matchers.add(/^>/, function(id) {
      return new Signal(id.substring(1));
    });

    context.signal = signal;

  });
}(this));