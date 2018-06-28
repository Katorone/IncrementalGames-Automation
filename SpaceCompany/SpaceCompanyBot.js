// Placeholder
var Bot = {};
Bot.version = "1.0 alpha-release";
Bot.init = function() {
     console.log("Space Company Bot -version "+Bot.version+"- Loaded.");
}

if (window.addEventListener) {
    window.addEventListener("load", Bot.init, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", Bot.init);
} else {
    window.onload = handlerName;
}
