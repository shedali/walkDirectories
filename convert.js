#! /usr/bin/env node

/** converts an opml file to a series of nested files and folders **/
const convert = require("xml-js");
const fs = require("fs");
const path = require("path");
const xml = fs.readFileSync("./test.opml", "utf-8");
const R = require("ramda");
const mkdirp = require("mkdirp");
const result1 = convert.xml2json(xml, { compact: true, spaces: 4 });
const axios = require("axios");

const fetchFile = async file_id => {
	const result = await axios({
		method: "post",
		url: "https://dynalist.io/api/v1/doc/read",
		data: {
			token:
				"dwKs11cvOWnHHuZDwhlCQ9oZkL4PqFA6PQKucS7bMsYPK36sHsjJy_JT7BJD6kWzFeJjqTtJjaM6qNKT5H7AYdoxC2ClmX7Isv93t5tgtpdNOzEZIkpRBsdn6NgTYe0V",
			file_id
		}
	});
	return result;
};

const getOutline = async (outline, dir = "./") => {
	if (outline && outline["_attributes"]) {
		const attr = outline["_attributes"];
		const subfolder = attr["text"];
		const note = attr["_note"];

		const writeNotes = (result, subfolder = "./") => {
			if (!result) {
				return;
			}
			console.log("writing files", result.data.nodes.length);
			result.data.nodes.map(item => {
				console.log(
					"writing to ",
					dir + "/" + subfolder,
					"file",
					item.note
				);
				fs.writeFileSync(
					dir + "/" + subfolder + "/" + "note.md",
					item.note
				);
				// item.children.map(ref =>
				// 	writeNotes(fetchFile(ref), item.content)
				// );
			});
		};

		if (/dynalist.io/.test(subfolder)) {
			// CLONE
			const result = await fetchFile("Ek6NBpIvDNbmb9EJEKuK4PCn");
			writeNotes(result);
		} else {
			writeNotes(result, subfolder);

			subfolder && console.log("create dir in", dir, "called", subfolder);
			subfolder && mkdirp.sync(dir + "/" + subfolder);
			note && console.log("note in ", subfolder, "called", note);
			// note &&
			// fs.writeFileSync(dir + "/" + subfolder + "/" + "note.md", note);
		}
	}

	const child = outline["outline"];

	if (!outline || !child || !child.length > 0) {
	} else {
		child.map(o =>
			getOutline(o, dir + "/" + outline["_attributes"]["text"])
		);
	}
};

const result = JSON.parse(result1)["opml"]["body"]["outline"];
getOutline(result);
