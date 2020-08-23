# ilr

ilr is like jq but worse! I made it because I'm too dumb dumb to understand jq
properly. But I know JavaScript, so I thought why not make something like jq
that uses JavaScript instead?

## Usage

ilr takes one argument, a string. It's a function which gets called by the input in JSON form.

Here I'm using `https://api.github.com/repos/stedolan/jq/commits?per_page=5` as the example.

**Identity**

```shell
curl https://api.github.com/repos/stedolan/jq/commits?per_page=5 | ilr 'x => x'
```

In addition, the entire [Ramda](https://ramdajs.com/docs/) codebase is exported to the global
namespace, so you could also do

```shell
curl https://api.github.com/repos/stedolan/jq/commits?per_page=5 | ilr 'identity'
```

**Get the first commit**

```shell
curl https://api.github.com/repos/stedolan/jq/commits?per_page=5 | ilr 'head'
```

(For the rest of the examples, I'll leave out the `curl` command.)

**Only get interesting fields from the first commit**

```
ilr 'head' | ilr 'paths([["commit","message"],["commit","committer","name"]])' | ilr 'zipObj(["message", "name"])'
```

Geez that's pretty bad, isn't it? I think ilr is nice for simple transformations that can be
expressed using only a few Ramda functions, but anything more complicated like this tends to
get messy quickly.

**Get parents**

```
ilr 'map(prop("parents"))' | ilr 'map(head)'
```

**Find the first commit from someone who has an email address ending with `.jp`**

```
ilr 'find(x => endsWith("jp", x.commit.author.email))' | ilr 'prop("commit")'
```

You could probably do this with entirely Ramda functions but it's cleaner to just use an
arrow function.

## Todo

Ramda's `path` and `paths` APIs are pretty awkward. I think it might be possible to use Babel to
create nicer syntax for function application and arrays. In particular:

 - space for function application: `map prop "parents"` becomes `map(prop("parents"))`
 - `.` for picking, e.g. `.commit.author.email` becomes `x => x.commit.author.email`