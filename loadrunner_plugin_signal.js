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
loadrunner(function(using, provide, loadrunner, define) {
  function indexOf(arr, thing) {
    for (var i=0, item; item = arr[i]; i++) {
      if (thing == item) {
        return i;
      }
    }
    return -1;
  }

  // signal because such events match '>foo'
  function signal(id) {
    var dep;
    if (id.charAt(0)=='>') id=id.substring(1);
    if (dep = Signal.inProgress[id]) {
      dep.complete();
      delete Signal.inProgress[id];
    }
    Signal.done.push(id);
  }

  var Signal = function(param) {
    this.param = param;
  }
  Signal.inProgress = [];
  Signal.done = [];
  Signal.prototype = new loadrunner.Dependency;
  Signal.prototype.start = function() {
    var dep, me = this;
    if (indexOf(Signal.done, this.param) != -1) {
      this.complete();
    } else if (dep = Signal.inProgress[this.param]) {
      dep.then(function() {
        me.complete();
      });
    } else {
      Signal.inProgress[this.param] = this;
    }
  }
  using.matchers.add(/^>/, function(id) {
    return new Signal(id.substring(1));
  });

  window.signal = signal;

});