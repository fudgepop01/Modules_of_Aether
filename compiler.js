const fs = require('fs');
const EOL = require('os').EOL;

const importsRegex = /\/\* ?@import\r?\n(?:.+\r?\n)+?\r?\n?\*\//gm;
const functionsRegex = new RegExp("{(.*)}", "gm");
const pathRegex = /".+"\r?\n/gm;

const importHeader = "// ### IMPORTED ###" + EOL;
const importFooter = EOL + "// ### YOUR CODE BELOW ###";

const cache = {};
const main = async () => {
    // modulePath = process.argv[2];

    const paths = [];
    paths.push(...fs.readdirSync("./"));
    try {
        paths.push(...fs.readdirSync("./attacks/").map(v => "./attacks/" + v))
    } catch(e) {}

    for (const file of paths) {
        if (file.endsWith(".gml")) {
            const text = fs.readFileSync(file, "utf8");
            let out = text;
            if (!importsRegex.test(text)) continue;

            let addLines = true;
            const importh = text.match(importsRegex)[0];
            if (text.includes(importHeader)) {
                addLines = false;
                out = text.substring(0, text.indexOf(importHeader));
            }

            out = out + importh.replace(importsRegex, (imports) => {
                let replOut = importHeader;
                let srcFilePaths = imports.match(pathRegex).map(v => v.replace(/["\r\n]/g, ''));
                let fnImports = imports.match(functionsRegex).map((v) => v.substring(1, v.length - 1).split(',').map(v2 => v2.trim()));
                
                for (const [i, path] of srcFilePaths.entries()) {
                    let modFile;

                    if (cache[path]) {
                        if (typeof cache[path] === "string") {
                            replOut += `// ${cache[path]}${EOL}`;
                            continue;
                        }
                        else {
                            modFile = cache[path];
                            replOut += `// SOURCE: ${path}:${EOL}`;
                        }
                    } else {
                        try {
                            modFile = fs.readFileSync(path, "utf8");
                            replOut += `// SOURCE: ${path}:${EOL}`;
                        } catch(err) {
                            cache[path] = `${err.name} -- ${err.message}`;
                            replOut += `// ${cache[path]}${EOL}`;
                            continue;
                        }
                    }
                    
                    let availableFunctions;
                    if (cache[path]) availableFunctions = cache[path];
                    else {
                        cache[path] = {};
                        for (const v of modFile.match(/export function ((?:.+)\r?\n)+?}+?/gm)) {
                            const splitted = v.split(/\r?\n/g);
                            let declaration = splitted.shift();
                            declaration = declaration.substring(16, declaration.length).trim();
                            const name = declaration.substring(0, declaration.indexOf('('));
                            cache[path][name] = {
                                args: declaration.substring(declaration.indexOf('(')+1, declaration.length - 3).split(',')
                            }
                            splitted.pop();
                            cache[path][name].content = splitted;
                        };
                        availableFunctions = cache[path];
                    }

                    for (const fnName of fnImports[i]) {
                        if (availableFunctions[fnName]) {
                            replOut += `#define ${fnName}(${availableFunctions[fnName].args.join(',')})${EOL}${availableFunctions[fnName].content.join(EOL)}${EOL}`;
                        } else {
                            replOut += `// ERR: function "${fnName}" does not exist!${EOL}`;
                        }
                    }
                    replOut += EOL;
                }
                return replOut;
            })

            if (addLines) out += EOL + EOL;
           fs.writeFileSync(file, out, 'utf8')
        }
    }
    
};

(async () => {
    await main();
})();