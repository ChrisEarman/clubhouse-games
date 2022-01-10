
/** Util Constants **/
export const Attempts = 6;
export const WordLength = 5;
export const KeyRows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "!ZXCVBNM?"
];


/** Util Enums, Types, & Interfaces **/
interface Square {
    value: string;
    letterState: LetterState;
}
export type Row = Square[];
export type Rows = Row[];

export enum LetterState {
    none,
    wrongSpot,
    rightSpot,
    wrong
}

export enum KeyType {
    letter,
    large
}

/** Util Functions **/
export function validateWord(word: Row, correctWord: String): LetterState[] {
    let rowWord = word.map(e => e.value).join("");
    let letterStates = new Array(WordLength).fill(null);
    let validChars = correctWord.split("")

    // check for perfect matches first
    for (let i = 0; i < WordLength; i++) {
        if (rowWord[i] === correctWord[i]) {
            letterStates[i] = (LetterState.rightSpot);
            validChars[i] = "?"; // wipe the used letters from the remaining chars for the wrong space check
        }
    }

    for (let i = 0; i < WordLength; i++) {
        if (rowWord[i] === correctWord[i]) {
            // letterStates.push(LetterState.rightSpot);
        } else if (validChars.includes(rowWord[i])) {
            letterStates[i] = LetterState.wrongSpot;
            let wipeIndex = validChars.indexOf(rowWord[i]);
            validChars[wipeIndex] = "?";
        } else {
            letterStates[i] = LetterState.wrong;
        }
    }
    return letterStates;
}

export function keyStates(attempts: Rows): Map<string, LetterState> {
    let lMap = new Map<string, LetterState>()
    for (let i = 0; i < attempts.length; i++) {
        let attempt = attempts[i];
        for (let j = 0; j < attempt.length; j++) {
            let letter = attempt[j].value;
            let state = attempt[j].letterState;

            // Valid Transitions:
            //  none -> wrong || wrongSpot || rightSpot
            //  wrongSpot -> rightSpot
            if (lMap.has(letter)) {
                //  wrongSpot -> rightSpot
                if (lMap.get(letter) === LetterState.wrongSpot && state === LetterState.rightSpot) {
                    lMap.set(letter, state);
                }
            } else {
                // none -> wrong || wrongSpot || rightSpot
                lMap.set(letter, state);
            }
        }
    }
    return lMap;
}