Modules register singleton generators

```javascript
var WebSite = require("web-site")
var site = new WebSite()
withNearbyModules.aModuleAppeared(
  "web-site",
  function() { return site }
)

var releaseChecklist = require("release-checklist")
var list = releaseChecklist.get("test")
withNearbyModules.aModuleAppeared(
  "release-checklist",
  function() { return list }
)
```

and then other modules can register callbacks to be called when certain singletons are available.

```javascript
withNearbyModules(
  ["release-checklist", "web-site"],
  function(list, site) {
    site.addRoute("get", "/housing-bond", function(request, response) {
      renderBond(list, response)
    })
  }
)
```
