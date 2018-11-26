#! /usr/bin/env node
const toc = require('markdown-toc');
const Remarkable = require('remarkable');
const md = new Remarkable();
const getStdin = require('get-stdin');

getStdin().then(str => {
    console.log(render(str) + "\r\n \r\n" +str);
});

function render(str, options) {
  return toc(str).content
}