'use strict';

module.exports = life;

// life :: Function, Function, Array -> Undefined
function life(render, loop, initialGame) {
    var loopFn = loop || defaultLoopCallback;
    var renderFn = render || defaultRenderCallback;

    // Begin game
    playGame(padGame(fromArray(initialGame)));

    // cellId :: Cell -> String
    function cellId(cell) {
        return coordId(getX(cell), getY(cell));
    }

    // coordId :: Integer, Integer -> String
    function coordId(x, y) {
        return x + ',' + y;
    }

    // countActiveNeighbours :: Game, Cell -> Integer
    function countActiveNeighbours(game, cell) {
        var total = 0;
        iterateArray(neighbouringCells(cell), function countActiveNeighboursIterator(cell) {
            var id = cellId(cell);
            if (game.hasOwnProperty(id) && isActive(game[id])) {
                total += 1;
            }
        });
        return total;
    }

    // createCell :: Integer, Integer, Boolean -> Cell
    function createCell(x, y, active) {
        return [x, y, active || false];
    }

    // defaultLoopCallback :: Boolean, Function -> Undefined
    function defaultLoopCallback(changed, next) {
        if (changed) {
            next();
        }
    }

    // defaultRenderCallback :: Cell -> Undefined
    function defaultRenderCallback(cell) {
        // Nowhere to render
    }

    // enumerateObj :: Object, Function -> Undefined
    function enumerateObj(obj, fn) {
        for (var key in obj) {
            fn(obj[key], key);
        }
    }

    // fromArray :: Array -> Game
    function fromArray(arr) {
        var game = {};
        iterateArray(arr, function fromArrayIterator(cell) {
            var newCell = createCell(getX(cell), getY(cell), true);
            game[cellId(newCell)] = newCell;
        });
        return game;
    }

    // getX :: Cell -> Integer
    function getX(cell) {
        return cell[0];
    }

    // getY :: Cell -> Integer
    function getY(cell) {
        return cell[1];
    }

    // isActive :: Cell -> Boolean
    function isActive(cell) {
        return cell[2];
    }

    // isObjDifferent :: Object, Object -> Boolean
    function isObjDifferent(objA, objB) {
        return JSON.stringify(objA) !== JSON.stringify(objB);
    }

    // iterateArray :: Array, Function -> Undefined
    function iterateArray(arr, fn) {
        for (var i=0; i < arr.length; i++) {
            fn(arr[i]);
        }
    }

    // nextGame :: Game -> Game
    function nextGame(game) {
        var newGame = {};
        enumerateObj(game, function nextGameEnumerator(cell, id) {
            var count = countActiveNeighbours(game, cell);
            var wasActive = isActive(cell);
            if (!(0 === count && !wasActive)) {
                var active = (wasActive === true && count === 2) || count === 3;
                if (active || wasActive) {
                    newGame[id] = createCell(getX(cell), getY(cell), active);
                }
            }
        });
        return padGame(newGame);
    }

    // neighbouringCells :: Cell -> Cell[]
    function neighbouringCells(cell) {
        var x = getX(cell);
        var y = getY(cell);

        return [
            createCell((x - 1), (y - 1)),
            createCell((x    ), (y - 1)),
            createCell((x + 1), (y - 1)),
            createCell((x - 1), (y    )),
            createCell((x + 1), (y    )),
            createCell((x - 1), (y + 1)),
            createCell((x    ), (y + 1)),
            createCell((x + 1), (y + 1))
        ];
    }

    /**
     * Padding is used to surround active cells with cells that may become
     * active in the next game. The only cells that may become active *must* be
     * surrounded by *at least 2* active cells. A padded Gosper's Glider, for
     * example, would look like:
     *
     *    [x][ ]
     * [ ][ ][x][ ]
     * [x][x][x][ ]
     * [ ][ ][ ]
     *
     * Note that every dead cell is surrounded by at least 2 active cells. This
     * means we don't need to represent every single inactive cell in the entire
     * game; just the ones that matter.
     *
     * padGame :: Game -> Game
     */
    function padGame(game) {
        var newGame = {};
        var hasOtherNeighbour = {};
        enumerateObj(game, function padGameEnumerator(cell, id) {
            newGame[id] = cell;
            if (isActive(cell)) {
                iterateArray(neighbouringCells(cell), function padGameNeighbourIterator(cell) {
                    var id = cellId(cell);
                    if (false === newGame.hasOwnProperty(id)) {
                        if (false === hasOtherNeighbour.hasOwnProperty(id)) {
                            hasOtherNeighbour[id] = true
                        } else {
                            newGame[id] = cell;
                        }
                    }
                });
            }
        });
        return newGame;
    }

    // playGame :: Game -> Undefined
    function playGame(game) {
        var renderedGame = renderGame(game);
        var newGame = nextGame(renderedGame);
        loopFn(isObjDifferent(renderedGame, newGame), function playGameClosure() {
            playGame(newGame);
        });
    }

    // renderGame :: Game -> Undefined
    function renderGame(game) {
        var renderedGame = {};
        enumerateObj(game, function renderGameEnumerator(cell, id) {
            if(false !== renderFn(getX(cell), getY(cell), isActive(cell))) {
                renderedGame[id] = cell;
            }
        });
        return renderedGame;
    }
}
