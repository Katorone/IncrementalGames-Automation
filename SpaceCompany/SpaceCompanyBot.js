// Placeholder
var Bot = {};
Bot.version = "1.0 alpha-release";

// Everything but IE
window.addEventListener("load", function() {
    console.log("Space Company Bot -version "+Bot.version+"- Loaded.");
}, false); 

// IE
window.attachEvent("onload", function() {
    // loaded
});
