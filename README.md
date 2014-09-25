# Conway

<img src="http://media.giphy.com/media/zVGcXjZTbQdMY/giphy.gif" alt="Urine" align="right" width=280/>

[![Master branch build status][ico-build]][travis]
![Published version][ico-package]
[![MIT Licensed][ico-license]][license]

This library provides a rendering agnostic implementation of Conway's Game of
Life. The implementation is efficient™ without relying on caching of values
or patterns (i.e. Hashlife. Deets below).

I haven't made this library available directly on the NPM registry because that
place is [already littered with GoL implementations][npm-life] and ain't nobody
got time for another one. That said, you can still use this library as a
dependency by referencing this repository directly.

#### `npm install git://github.com/adlawson/conway.js.git#TAG`

## Documentation
The usage example below shows how to use this library to render a GoL with the
Canvas API, playing through the life of a Gosper's Glider.
```js
var life = require('conway');

// Setup the rendering function
function renderToCanvas(x, y, active) {
    if (active) {
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, 5, 5);
    } else {
        ctx.clearRect(x, y, 5, 5);
    }
}

// Create the animation loop
function loopFn(hasChanged, next) {
    // Check if the game has changed before continuing
    if (hasChanged) {
        window.requestAnimationFrame(next);
    }
}

// Setup the initial game state
var initialState = [
  /*[x, y]*/[1, 0],
                    [2, 1],
    [0, 2], [1, 2], [2, 2]
];

// Here we ggggooo ===>
life(renderToCanvas, loopFn, initalState);
```

### What's this efficiency you mentioned?
So a typical (read: lazy) implementation of GoL is to represent the grid of your
whole workspace and play the game from there. The problem with this is that you
typically end up representing *far* too much of the workspace at a time and
spending resources you may need to calculate new frames.

Another way to do it is to represent only the "alive" cells and clear the
rendered grid on each frame. This solution is also problematic as you couple
your implementation to an efficient rendering engine and you still need to be
able to iterate through "dead" cells before the next frame.

The way *this* implementation represents a the game is to add "padding" around
active cells. This takes advantage of the rules of the game by relying on the
fact that the only cells that can become "alive" next frame **must** be
a neighbour of at least 2 active cells. The padding also covers cells that were
just "alive", so we can kill them off when we render.

**Enough waffle!** Here's a demonstration of what I'm on about. The **black**
cells are alive, the **red** cells are cells that have just died (allowing us
to clear the cell), and the **blue** cells are padding. The whitespace is just
whitespace and will stretch to an infinitely large workspace.

![Published version][img-padding]

## Contributing
I accept contributions to the source via Pull Request, but passing unit tests
must be included before it will be considered for merge.
```bash
$ curl -O https://raw.githubusercontent.com/adlawson/vagrantfiles/master/nodejs/Vagrantfile
$ vagrant up
$ vagrant ssh
$ cd /srv

$ npm test
```

### License
The content of this library is released under the **MIT License** by
**Andrew Lawson**.<br/> You can find a copy of this license in
[`LICENSE`][license] or at http://www.opensource.org/licenses/mit.

<!-- Links -->
[travis]: https://travis-ci.org/adlawson/urine.js
[ico-license]: http://img.shields.io/badge/license-MIT-e05d44.svg?style=flat
[ico-package]: http://img.shields.io/github/tag/adlawson/conway.js.svg?style=flat
[ico-build]: http://img.shields.io/travis/adlawson/urine.js/master.svg?style=flat
[license]: LICENSE
[img-padding]: padding.gif
[npm-life]: https://www.npmjs.org/search?q=Conway%27s%20Game%20of%20Life
