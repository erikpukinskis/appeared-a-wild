Modules register singleton generators

```javascript
var WebSite = require("web-site")
var site = new WebSite()
appearedAWild.module(
  "web-site",
  function() { return site }
)

var releaseChecklist = require("release-checklist")
var list = releaseChecklist.get("test")
appearedAWild.module(
  "release-checklist",
  function() { return list }
)
```

and then other modules can register callbacks to be called when certain singletons are available.

```javascript
appearedAWild(
  ["release-checklist", "web-site"],
  function(list, site) {
    site.addRoute("get", "/housing-bond", function(request, response) {
      renderBond(list, response)
    })
  }
)
```

### Why

Typical node programs are designed to be started from the command line. You have "root" access to some machine, you require express, you hit some external ports, you grab stuff from the filesystem, etc.

Appeared-a-wild allows you to define hooks to those resources, without necessarily having instances of those resources yet. So that regardless of where that resource might come from... either a site that got started on a local UNIX port, or a site that is getting broadcasted into the browser, our code can just register that it's ready to work with that resource, wherever it might come from.

You can think of it as a commonjs-like namespace for *instances* rather than singletons. Which runs on top of commonjs's interface for defining singletons.
