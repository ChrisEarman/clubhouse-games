import * as React from "react";
import * as ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import * as Utils from "./othelloUtils.ts";
import "./index.css";
import {score, shouldSkipPlayer} from "./othelloUtils";

const BLACK = "⚫️";
const WHITE = "⚪️";

class Square extends React.Component {
    playableDot(props) {
        if (props.playable) {
            return <span className="dot"></span>;
        }
        return null;
    }

    render() {
        return (
            <button className={`square square-background-${this.props.hoverVal}`}
                    onClick={() => this.props.onClick()}
                    onMouseEnter={() => this.props.onEnter()}
                    onMouseLeave={() => this.props.onLeave()}
            >
                <this.playableDot playable={this.props.playable}/>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blackNext: true,
            firstMove: true,
            gameOver: false,
            squares: this.initBoard(),
        };
        this.initBoard();
    }

    /******************
     * Helper Methods *
     ******************/

    initBoard() {
        const squares = Array(8)
            .fill(null)
            .map(row => new Array(8)
                .fill(null)
                .map(() => { return {tile: null, hoverVal: 0, playable: false}}));
        squares[3][3] = new Utils.BlackTileState();
        squares[4][4] = new Utils.BlackTileState();
        squares[3][4] = new Utils.WhiteTileState();
        squares[4][3] = new Utils.WhiteTileState();

        squares[4][2].playable = true;
        squares[2][4].playable = true;
        squares[3][5].playable = true;
        squares[5][3].playable = true;
        return squares;
    }

    piece() {
        return this.state.blackNext ?
            new Utils.BlackTileState() :
            new Utils.WhiteTileState() ;
    }

    flipTiles(i, j)  {
        const squares = this.state.squares.slice();
        let directionalState = Utils.generalDirectionState(squares, this.piece().tile, i, j);

        for (let states of directionalState) {
            for (let tile of states) {
                if (tile.tile === this.piece().tile) {
                    break;
                }
                squares[tile.x][tile.y] = this.piece();
            }
        }
        this.setState({
            squares: squares,
        });
    }

    markPlayable() {
        const squares = this.state.squares.slice();

        const playableSquares = Utils.playableLocations(squares, this.piece().tile);
        squares.map(
            row => row.map(
                square => square.playable = false));

        for (let coordinate of playableSquares) {
            squares[coordinate.x][coordinate.y].playable = true;
        }
        this.setState({
            squares: squares,
        })
    }

    endOfTurnActions(nestedCall=false) {
        // Mark the new playable spots
        this.markPlayable();

        // check if we need to skip
        if (shouldSkipPlayer(this.state.squares)) {
            if (nestedCall) {
                this.setState({ gameOver: true });
            }
            else {
                this.setState({ blackNext: !this.state.blackNext},
                    () => this.endOfTurnActions(true));
            }
        }
    }

    /******************
     * Handler Methods *
     ******************/

    handleClick(i, j) {
        const squares = this.state.squares.slice();

        if (squares[i][j].playable) {
            const blackNext = !this.state.blackNext;
            squares[i][j] = this.piece();
            this.flipTiles(i, j);

            this.setState({
                blackNext: blackNext,
                squares: squares,
                firstMove: false,
            }, () => {
                this.endOfTurnActions();
            });
        }
    }

    handleHover(i, j) {
        const squares = this.state.squares.slice();
        squares[i][j].hoverVal = 1;
        this.setState({
            squares:  squares,
        })
    }

    handleLeave(i, j) {
        const squares = this.state.squares.slice();
        squares[i][j].hoverVal = 0;
        this.setState({
            squares:  squares,
        })
    }

    /******************
     * Render Methods *
     ******************/

    renderSquare(i, j) {
        return <Square
            value={this.state.squares[i][j].tile}
            hoverVal={this.state.squares[i][j].hoverVal}
            playable={this.state.squares[i][j].playable}
            onClick={() => this.handleClick(i, j)}
            onEnter={() => this.handleHover(i, j)}
            onLeave={() => this.handleLeave(i, j)}
        />;
    }

    renderRow(i) {
        return (
            <div>
                {this.renderSquare(i, 0)}
                {this.renderSquare(i, 1)}
                {this.renderSquare(i, 2)}
                {this.renderSquare(i, 3)}
                {this.renderSquare(i, 4)}
                {this.renderSquare(i, 5)}
                {this.renderSquare(i, 6)}
                {this.renderSquare(i, 7)}
            </div>
        )
    }

    render() {
        let status = 'Next player: ' + this.piece().tile ;
        if (this.state.gameOver) {

            status = "Game Over"

        }

        return (
            <div>
                <div className="status">{status}</div>
                {this.renderRow(0)}
                {this.renderRow(1)}
                {this.renderRow(2)}
                {this.renderRow(3)}
                {this.renderRow(4)}
                {this.renderRow(5)}
                {this.renderRow(6)}
                {this.renderRow(7)}

                <div className="status">
                    {"Black Score: " + score(this.state.squares, BLACK)}
                </div>
                <div className="status">

                    {"White Score: " + score(this.state.squares, WHITE)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                
            }]
        }
    }

    render() {
        return (
            <div className="game">
            <div className="game-board mx-auto">
            <Board />
            </div>
            <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
            </div>
            </div>
    );
    }
}

class Page extends React.Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">Othello</a>
                </nav>
                <div className="container">
                    <Game />
                </div>
            </div>
    );
    }
}

// ========================================

ReactDOM.render(
<Page />,
    document.getElementById('root')
);