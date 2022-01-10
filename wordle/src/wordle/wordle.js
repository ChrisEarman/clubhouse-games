import React from "react";
import * as Utils from "./wordleUtils.ts";
import {KeyBoard} from "./keyboard";
import {Dictionary} from "./dictionary.ts";
import './wordle.css';

const queryParams = new URLSearchParams(window.location.search);
const SEED = queryParams.get('seed');
const DICTIONARY = new Dictionary();
const WORD = SEED === null ? DICTIONARY.get_word_random() : DICTIONARY.get_word_seeded(SEED);
console.log(WORD);

class Square extends React.Component {
    render() {
        return (
            <button className={`square square-background-${this.props.letterState}`}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Render Methods **/
    renderSquare(i, j) {
        return <Square
            value={this.props.rows[i][j].value}
            letterState={this.props.rows[i][j].letterState}
        />;
    }

    renderRow(i) {
        let squares = [];
        for (let j = 0; j < Utils.WordLength; j++) {
            squares.push(this.renderSquare(i, j));
        }
        return (
            <div>{squares}</div>
        );
    }

    render() {
        let rows = [];
        for (let i = 0; i < Utils.Attempts; i++) {
            rows.push(this.renderRow(i));
        }

        return (
            <div>{rows}</div>
        );
    }
}

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardRows: this.initBoard(),
            keyStates: new Map(),
            attemptNum: 0,
            charNum: 0,
        }
        this.initBoard();
    }

    /** Helper Functions **/
    initBoard() {
        return Array(Utils.Attempts)
            .fill(null)
            .map(() => new Array(Utils.WordLength)
                .fill(null)
                .map(() => {
                    return {value: " ", letterState: Utils.LetterState.none}
                }));
    }

    setCurSquare(letter) {
        const squares = this.state.boardRows.slice();
        const i = this.state.attemptNum;
        const j = this.state.charNum;
        console.log(i, j, letter)
        squares[i][j].value = letter;
        this.setState({
            boardRows: squares,
        })
    }

    typeLetter(letter) {
        if (this.state.charNum < Utils.WordLength) {
            // type current letter
            this.setCurSquare(letter)

            // move active square forward
            this.setState({
                charNum: this.state.charNum + 1,
            })
        }
    }

    deleteLetter() {
        // clear current letter
        if (this.state.charNum > 0) {
            // move active square back
            this.setState({
                charNum: this.state.charNum - 1,
            }, () => this.setCurSquare(" "));

        }
    }

    submitWord() {
        console.log("charNum: ", this.state.charNum)
        if (this.state.charNum === Utils.WordLength) {
            const squares = this.state.boardRows.slice();
            const word = squares[this.state.attemptNum];

            if (DICTIONARY.contains(word.map(e => e.value).join(""))) {
                // Update newly submitted row
                let wordState = Utils.validateWord(word, WORD);
                for (let i = 0; i < wordState.length; i++) {
                    squares[this.state.attemptNum][i].letterState = wordState[i];
                }

                // Update keyboard
                let keyStates = Utils.keyStates(squares);

                this.setState({
                    attemptNum: this.state.attemptNum + 1,
                    charNum: 0,
                    boardRows: squares,
                    keyStates: keyStates,
                })
            } else {
                console.log("Not a Valid Word", word)
            }
        }
    }

    /** Render Methods **/
    render() {
        return (
            <div className="Game">
                <div className="game-board mx-auto">
                    <Board
                        rows={this.state.boardRows}
                        attemptNum={this.attemptNum}
                        charNum={this.charNum}
                    />
                </div>
                <div className="game-board">
                    <KeyBoard
                        keyStates={this.state.keyStates}
                        handleLetterClick={(letter) => this.typeLetter(letter)}
                        handleEnterClick={() => this.submitWord()}
                        handleDeleteClick={() => this.deleteLetter()}
                    />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}
