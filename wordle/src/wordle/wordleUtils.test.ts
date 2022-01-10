import {Row, validateWord, LetterState} from "./wordleUtils";


function rowMock(word: string): Row {
    let out = [];
    for (let i = 0; i < word.length; i++) {
        out.push({value: word[i], letterState: LetterState.none});
    }
    return out;
}

test("validateWord hello hello", () => {
    const hello = validateWord(rowMock("HELLO"),
        "HELLO");
    let expected = [
        LetterState.rightSpot,
        LetterState.rightSpot,
        LetterState.rightSpot,
        LetterState.rightSpot,
        LetterState.rightSpot];
    expect(hello).toEqual(expected)
})

test("validateWord hello great", () => {
    const great = validateWord(rowMock("HELLO"),
        "GREAT");
    let expected = [
        LetterState.wrong,
        LetterState.wrongSpot,
        LetterState.wrong,
        LetterState.wrong,
        LetterState.wrong];
    expect(great).toEqual(expected)
})

test("validateWord hotel hello", () => {
    const hotel = validateWord(rowMock("HOTEL"),
        "HELLO");
    let expected = [
        LetterState.rightSpot,
        LetterState.wrongSpot,
        LetterState.wrong,
        LetterState.wrongSpot,
        LetterState.wrongSpot]
    expect(hotel).toEqual(expected)
})

test("validateWord catch watch", () => {
    const watch = validateWord(rowMock("CATCH"),
        "WATCH");
    let expected = [
        LetterState.wrong,
        LetterState.rightSpot,
        LetterState.rightSpot,
        LetterState.rightSpot,
        LetterState.rightSpot]
    expect(watch).toEqual(expected)
})

test("validateWord spell lofty", () => {
    const watch = validateWord(rowMock("SPELL"),
        "LOFTY");
    let expected = [
        LetterState.wrong,
        LetterState.wrong,
        LetterState.wrong,
        LetterState.wrongSpot,
        LetterState.wrong]
    expect(watch).toEqual(expected)
})

test("validateWord puffy lofty", () => {
    const watch = validateWord(rowMock("PUFFY"),
        "LOFTY");
    let expected = [
        LetterState.wrong,
        LetterState.wrong,
        LetterState.rightSpot,
        LetterState.wrong,
        LetterState.rightSpot]
    expect(watch).toEqual(expected)
})