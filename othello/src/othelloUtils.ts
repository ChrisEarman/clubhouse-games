interface Square {
    tile: Tile | null;
    hoverVal: number;
    playable: boolean;
}

type Board = Square[][];

class Coordinate {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    x: number;
    y: number;
}

enum Direction {
    N,
    NE,
    E,
    SE,
    S,
    SW,
    W,
    NW
}

interface Vector {
    x: number,
    y: number
}

type Tile = "⚫️" | "⚪️";

export class TileState implements Square {
    constructor(tile: Tile | null, hoverVal = 0, playable = false) {
        this.tile = tile;
        this.hoverVal = hoverVal;
        this.playable = playable;
    }

    tile: Tile | null;
    hoverVal: number;
    playable: boolean;
}

export class BlackTileState extends TileState {
    constructor(hoverVal = 0, playable = false) {
        super("⚫️", hoverVal, playable);
    }
}

export class WhiteTileState extends TileState {
    constructor(hoverVal = 0, playable = false) {
        super("⚪️", hoverVal, playable);
    }
}

export function shouldSkipPlayer(squares: Board): boolean  {
    return squares
        .flatMap(row => row)
        .filter(square => square.playable).length === 0;
}

export function playableLocations(squares: Board, tile: Tile): Coordinate[] {
    let coordinates = Array(0);
    for (const i of [0,1,2,3,4,5,6,7]) {
        for (const j of [0,1,2,3,4,5,6,7]) {
            if (isSpacePlayable(squares, tile, i, j)) {
                coordinates.push(new Coordinate(i, j));
            }
        }
    }
    return coordinates;
}

function isSpacePlayable(squares: Board, curTile: Tile, i: number, j: number): boolean {
    /**
     * Determines if a space is playable, this means:
     * 1. there is no tile currently on the space
     * 2. there exists an adjacent tile
     */

    // 1. there is no tile currently on the space
    if (squares[i][j].tile != null) {
        return false;
    }

    // 2. there exists an adjacent tile
    let directionalCheck = generalDirectionState(squares, curTile, i, j);
    // console.log(directionalCheck);
    if (directionalCheck.length === 0) {
        return false;
    }

    return true;
}

export function generalDirectionState(squares: Board, curTile: Tile, i: number, j: number) {
    /**
     * Given a placement, return the set of effected tile lines (if any)
     *
     * squares: Board    game board
     * i, j : numbers    start location in grid (not inclusive)
     *
     * ret: List of List of tile objects {tile: BlackTile, x: 2, y: 2}
     */
    return [0,1,2,3,4,5,6,7]
        .map(val => getDirectionState(squares, i, j, val))
        // there exist a tile
        .filter(lst => lst.length>0)
        // it is not touching the tile we are currently placing
        .filter(lst => lst[0].tile !== curTile)
        // the tile we are looking for is in the path
        .filter(lst => lst.map(val => val.tile).includes(curTile))
}

function dirAsVector(dir: Direction): Vector {
    /**
     * Takes in a direction and translates it into a vector pair
     *
     * dir : Direction following N, NE, E, SE, S, SW, W, NS
     *
     * ret : {x : _, y: _} directional vector
     */
    switch (dir) {
        case Direction.N:
            return {x: 0, y: 1};
        case Direction.NE:
            return {x: 1, y: 1};
        case Direction.E:
            return {x: 1, y: 0};
        case Direction.SE:
            return {x: 1, y: -1};
        case Direction.S:
            return {x: 0, y: -1};
        case Direction.SW:
            return {x: -1, y: -1};
        case Direction.W:
            return {x: -1, y: 0};
        case Direction.NW:
            return {x: -1, y: 1};
        default:
            console.log("invalid direction detected " + dir)
            return {x: 0, y: 1};
    }
}

function getDirectionState(squares: Board, i: number, j: number, dir: Direction) {
    /**
     * Walk the grid and return the list of values until you hit an empty tile or an edge
     *
     * i, j : integer start location in grid (not inclusive)
     * dir : integer [0, 8) direction following N, NE, E, SE, S, SW, W, NS
     *
     * ret : [BlackTile, BlackTile, WhiteTile, BlackTile]
     */
    let cur_x = i;
    let cur_y = j;
    const vector = dirAsVector(dir);
    let retList = [];

    cur_x += vector.x
    cur_y += vector.y
    while (cur_x >= 0 && cur_x < 8 && cur_y >= 0 && cur_y < 8) {
        let tile = squares[cur_x][cur_y].tile
        if (tile === null) {
            // break the loop if you hit an empty tile
            break;
        }
        retList.push({
            tile: tile,
            x: cur_x,
            y: cur_y,
        })
        cur_x += vector.x
        cur_y += vector.y
    }
    // console.log(retList)
    return retList;
}

export function score(squares: Board, tile: Tile): number {
    return squares
        .flatMap(row => row)
        .filter(square => square.tile === tile).length;
}