# \~Modules of Aether\~

## What is it?

"Modules of Aether" is the silly name I gave to this tool I developed.
It's an answer to an issue I was having when trying 
to maintain codebases for Rivals of Aether Characters.

Previously, there was no easy way to import and export chunks of code without
going through and manually copy/pasting it over and over again for each
file. This can get tedious (and messy) *very quickly*. 

However, there's an answer! Because RoA mods are based on 
**[YellowAfterLife](https://github.com/YellowAfterlife)'s** amazing 
[NTT language](https://yal.cc/r/17/ntt/gml/) (it's like GML, but objectively better), 
I'm able to create functions with the `#define` derective and call upon them from within the same file.

This program takes advantage of that feature! It takes the functions from
a module's file and automatically puts them at the bottom of the GML scripts
where they belong, potentially saving hours of mind-numbing work.

The greatest part is it will **passively update the code**, meaning it stays
out of the way without you needing to give it so much as a single thought.
If you update the import statements, upon running the program you'll 
see that the `### IMPORTED ###` section will automatically be updated to match.

## DISCLAIMER:

***DO NOT*** code below the `// ### IMPORTED ###` comment. **Any code below it
is automatically deleted** upon running the program to allow it to update the
imports in the proper locations.
This is what my program uses to determine if imports have already been made.

I am not repsonsible for any lost progress that may occur due to improper use
of this program.

---

Anyway, with that said, onto the How-to and stuff...

## How-to:

#### Modules:

modules (files with functions you wish to export) need to be in their own
file. This is due to the way I've setup the syntax. To export functions you
type the following:

```js
export function [name]([...args]) {
    [code goes here]
    ...
}
```

#### Importing Functions into Files:

If you wish to import some functions into a file, 
at the top of that file create a block comment with the following format:

```js
/*
{ function_name, another_function } from "./path/to/module.gml"
{ foo, bar } from "./other/module.gml"
*/

```

This will tell the program what functions you want to import and in what files
they exist.

when imported, functions will be placed at the bottom of the file with
the following syntax:

```GML
#define [name]([...args])
    [code goes here]
    ...
```

Above this will be a few auto-generated comments:
```js
// ### IMPORTED ###
// SOURCE: [module path]:
```

This will also generate comments alerting you to any files, folders,
or functions that don't exist if you try to import them.

#### Running the program:

1. download the executable (all the source code is in `compiler.js`)
2. place it in the directory you want to use it in
3. run it!

It will go through and scan all the GML files in the directory (and `attacks`
folder if it exists) and add the imported code to the ones that have the proper
import format.

## Why?

I'm lazy and didn't want my people to suffer any longer lol

...

But seriously though, the ability to import and export code has been a feature
in nearly every other language I've used - I figured, "why not this one too"
and made this tool in about 5 hours (I was tired so it took awhile...).

I also learned of an awesome npm package called simply, 
**[pkg](https://www.npmjs.com/package/pkg)**, that allows me to bundle my code
into a small executable with ease, allowing others to use it without going through
the process of installing nodejs themselves!

## Support

I'll often be in the Rivals of Aether discord, or create an issue in this repository
if there are any bugs that come up.

## Obligatory buy me a coffee section :^)

#### If you like what I do, I do have a patreon page **[riiight here](https://www.patreon.com/fudgepop01)**

No worries though! I'll definitely keep-on coding simply because it's what I love doing!
Soon:tm: I'll also be releasing an early version of the hitbox tool I've been developing for
a week or two now. :3

## Thanks for Reading, and Enjoy your Newfound File-Freedom