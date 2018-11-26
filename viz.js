#! /usr/bin/env node
// var vfile = require('to-vfile');
var remark = require('remark');
var graphviz = require('remark-graphviz');
 
// var example = vfile.readSync('output.md');
// example.data = {
//   destinationFilePath: './poutput.md'
// };

const getStdin = require('get-stdin');

getStdin().then(str => {
    remark()
  // .use(graphviz)
  .process({data: str}, function (err, file) {
    if (err) throw err;
    console.log(file);
  });
});
 
