import React from "react";
import * as Utils from "./wordleUtils.ts";
import './keyboard.css';
import {LetterState} from "./wordleUtils.ts";


class Key extends React.Component {
    render() {
        return (
          <button className={`key key-type-${this.props.keyType} key-background-${this.props.keyState}`}
                  onClick={() => this.props.handleClick(this.props.value)}
          >
              {this.props.value}
          </button>
        );
    }
}

export class KeyBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: this.initBoard(),
        }
        this.initBoard();
    }

    /** Helper Functions **/
    initBoard() {
        const rows = Array(3);
        rows[0] = Array(10).fill(null);
        rows[1] = Array(9).fill(null);
        rows[2] = Array(9).fill(null);


        for (let i = 0; i < Utils.KeyRows.length; i++) {
            for (let j = 0; j < Utils.KeyRows[i].length; j++) {
                rows[i][j] = {
                    value: Utils.KeyRows[i][j],
                    keyType: Utils.KeyType.letter,
                    keyState: Utils.LetterState.none,
                };
            }
        }

        rows[2][0] = {
            value: "ENT",
            keyType: Utils.KeyType.large,
            keyState: Utils.LetterState.none,
        };
        rows[2][8] = {
            value: "DEL",
            keyType: Utils.KeyType.large,
            keyState: Utils.LetterState.none,
        };

        return rows;
    }

    keyState(letter) {
        return this.props.keyStates.has(letter)? this.props.keyStates.get(letter) : LetterState.none;
    }

    /** Handler Methods **/
    handleClick(letter) {
        if (letter === "ENT") {
            this.props.handleEnterClick();
        } else if (letter === "DEL") {
            this.props.handleDeleteClick();
        } else {
            this.props.handleLetterClick(letter);
        }
    }

    /** Render Methods **/
    renderKey(i, j) {
        return <Key
            value={this.state.rows[i][j].value}
            keyType={this.state.rows[i][j].keyType}
            keyState={this.keyState(this.state.rows[i][j].value)}
            handleClick={(letter) => this.handleClick(letter)}
        />;
    }

    renderRow(i) {
        let keys = [];
        for (let j = 0; j < this.state.rows[i].length; j++) {
            keys.push(this.renderKey(i, j));
        }
        return (
            <div>{keys}</div>
        );
    }

    render() {
        let rows = []
        for (let i = 0; i < this.state.rows.length; i++) {
            rows.push(this.renderRow(i));
        }

        return (
            <div>{rows}</div>
        );
    }
}
