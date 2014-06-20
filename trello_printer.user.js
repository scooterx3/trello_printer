// ==UserScript==
// @name trello_printer
// @include https://trello.com/b/*
// @version 0.1
// ==/UserScript==

(
function () {
  temp = document.createElement('script');
  temp.setAttribute('src', 'https://raw.githubusercontent.com/scooterx3/trello_printer/master/trello_printer.js');
  document.body.appendChild(temp);
} ()
);

