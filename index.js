#!/usr/bin/env node

import R from "ramda";
import fs from "fs";


// AVERT YOUR EYES EVERYTHING ABOUT THIS CODE IS BAD

// attach everything in Ramda to the global namespace.
for (let key of R.keys(R)) {
    global[key] = R[key];
}

// special shorter names for certain Ramda things.
var _ = __;

// make a function of the text...
const funcText = 'return ' + process.argv[2];
const func = new Function(funcText);

// parse STDIN...
const inString = fs.readFileSync(0, 'utf-8');
const inJSON = JSON.parse(inString);

const result = func()(inJSON);

console.log(JSON.stringify(result, null, 2));