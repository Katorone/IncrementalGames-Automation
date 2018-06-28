// ==UserScript==
// @name         Space Company automation
// @namespace    SpaceCompany
// @version      1.0-alpha-release
// @description  Taking over the universe, one machine at a time.
// @author       u/Katorone
// @match        https://rawgit.com/sparticle999/SpaceCompany/v1test/
// @match        https://www.kongregate.com/games/sparticle999/space-company
// @include      *rawgit.com/sparticle999/SpaceCompany/v1test/*
// @include      *kongregate.com/games/sparticle999/space-company*
// @grant        none
// ==/UserScript==

// Inspired by: https://gist.github.com/Dimelsondroid/f5c2ba0233192a8a92c134dc78f367a6

"use strict";
var script = document.createElement('script');
script.type = 'application/javascript';
script.src = 'https://katorone.github.io/IncrementalGames-Automation/SpaceCompany/SpaceCompanyBot.js';
document.body.appendChild(script);

