#! /usr/bin/env node
const klawSync = require("klaw-sync");
const path = require("path");

const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const directoryToExplore = ".";


let paths;

const ignore = ["node_modules", ".DS_Store", ".git"]
// const pandoc = require('node-pandoc');


try {
	paths = klawSync(directoryToExplore, {
		nofile: true,
		filter: s =>ignore.indexOf(path.basename(s.path))===-1 || s.path.indexOf('tex2pdf')>-1
	});

} catch (err) {
	console.error(err);
}

const unrelative=(str, currDir, filePath)=>{
	// https://regex101.com/r/kfi8qI/1
	const regex = /!\[(.*?)\]\((?!http)(.*?)\)/gi
	return str.replace(regex, "![$1]("+path.relative(process.cwd(), filePath)+'/'+"$2)")
}

const contents = "# "+path.basename(process.cwd()) + paths.sort().map(p => {
	const ref = path.relative(process.cwd(), p.path);
	const depth = (ref.match(/\//g) || []).length + 2;
	const hashes = "#".repeat(depth);
	const fileContents = fs
		.readdirSync(p.path)
		.filter(item => item.match("md"))
		.map(item => fs.readFileSync(path.join(p.path, item), "utf8"));


		//convert image references to non relative
		//path.relative(process.cwd(), someFilePath)
		const unrelatived = unrelative(fileContents.toString(), process.cwd(), p.path)



	return "\r\n" +hashes +" "+ path.basename(p.path) + "\r\n" + unrelatived + "\r\n" ;
}).join('')


console.log(contents);
