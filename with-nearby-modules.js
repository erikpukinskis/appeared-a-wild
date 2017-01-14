
module.exports = generator()

function generator() {
  var callbacksWaitingOn = {}
  var singletons = {}
  var callbacks = []
  var dependencies = []

  function withNearbyModules(moduleNames, callback) {
    console.log(":: TADA a callback is waiting on "+moduleNames.join(", "))
    var i = callbacks.length
    callbacks.push(callback)
    dependencies.push(moduleNames)

    moduleNames.forEach(function(name) {
      if (!callbacksWaitingOn[name]) {
        callbacksWaitingOn[name] = new Set()
      }

      callbacksWaitingOn[name].add(i)
    })
  }

  function stringify(x) {
    if (x && x.toString) {
      return x.toString()
    } else {
      return JSON.stringify(x)
    }
  }

  function aModuleAppeared(name, singletonGenerator) {

    if (typeof singletonGenerator != "function") {
      throw new Error("withNearbyModules.aModuleAppeared needs a name and a function that returns singletons. For the module "+stringify(name)+" you provided "+stringify(singletonGenerator)+" for the function")
    }

    console.log(":: A WILD MODULE APPEARED! "+name+"! Generator is "+stringify(singletonGenerator))

    singletons[name] = singletonGenerator

    console.log("keys on singletons include "+Object.keys(singletons))

    var waiting = callbacksWaitingOn[name]

    if (!waiting) { return }

    waiting.forEach(tryToCall)

    function tryToCall(index) {
      var func = callbacks[index]
      var deps = dependencies[index]
      var args = []
      console.log("call the callback waiting for "+deps.join(", ")+"?")
      for(var i=0; i<deps.length; i++) {
        var dep = deps[i]

        var singletonGenerator = singletons[dep]
        if (!singletonGenerator) {
          console.log("checking for "+dep+" -> NOPE aborting.")
          console.log("keys on singletons include "+Object.keys(singletons))
          return
        }
        console.log("checking for "+dep+" X")

        var singleton = singletonGenerator.call()
        args.push(singleton)
      }

      func.apply(null, args)
    }

  }

  withNearbyModules.aModuleAppeared = aModuleAppeared

  return withNearbyModules
}
