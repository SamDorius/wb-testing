import { jest } from '@jest/globals'

const mockIsWord = jest.fn(() => true)

jest.unstable_mockModule('../src/words.js', () =>
{
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: mockIsWord
    }
})


const { buildLetter, Wordle } = await import("../src/wordle.js")



describe('building a letter object', () => 
{
    test('returns a letter object', () => 
    {
      expect(buildLetter('argument1', 'argument2')).toEqual({letter: 'argument1', status: 'argument2'})
    })
})

describe('consturcting a new Wordle game', () => 
{
    test('sets maxGuesses to 6', () =>
    {
        const wordle = new Wordle()
        expect(wordle.maxGuesses).toBe(6)
    })

    test('sets maxGuesses to argument passed', () =>
    {
        const wordle = new Wordle(10)
        expect(wordle.maxGuesses).toBe(10)
    })

    test('sets guesses to an array of length maxGuesses', () =>
    {
        const wordle = new Wordle()
        expect(wordle.guesses.length).toBe(6)
    })

    test('sets currGuess to 0', () =>
    {
        const wordle = new Wordle()
        expect(wordle.currGuess).toBe(0)
    })

    test('sets word to a word from getWord', () =>
    {
        const wordle = new Wordle()
        expect(wordle.word).toBe('APPLE')
    })
})

describe('buildGuessFromWord', () =>
{
    test('sets status to correct when letter is in correct plave', () =>
    {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('A____')
        expect(guess[0].status).toBe('CORRECT')
    })

    test('sets status to present when letter is present in word', () =>
    {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('E____')
        expect(guess[0].status).toBe('PRESENT')
    })

    test('sets status to absent when letter is not present in word', () =>
    {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('z____')
        expect(guess[0].status).toBe('ABSENT')
    })
})

describe('appendGuess', () =>
{
    test('throws error if no more guests are allowed', () =>
    {
        const wordle = new Wordle(1)
        wordle.appendGuess("GUESS")
        expect(() => wordle.appendGuess("GUESS")).toThrow()
    })

    test('throws error if guess is not of length 5', () =>
    {
        const wordle = new Wordle()
        expect(() => wordle.appendGuess("GLOBES")).toThrow()
    })

    test('throws error if guess is not a word', () =>
    {
        const wordle = new Wordle()
        mockIsWord.mockReturnValueOnce(false)
        expect(() => wordle.appendGuess('GUESS')).toThrow()
    })

    test('increments current guess', () => 
    {
        const wordle = new Wordle()
        wordle.appendGuess('GUESS')
        expect(wordle.currGuess).toBe(1)
    })
})

describe('isSolved', () =>
{
    test('returns true if the latest guess is correct', () =>
    {
        const wordle = new Wordle()
        wordle.appendGuess('APPLE')
        expect(wordle.isSolved()).toBe(true)
    })

    test('returns false if the latest guess is not correct', () =>
    {
        const wordle = new Wordle()
        wordle.appendGuess('GUESS')
        expect(wordle.isSolved()).toBe(false)
    })
})

describe('shouldEndGame', () => 
{
    test('returns true if the latest guess is correct', () =>
    {
        const wordle = new Wordle()
        wordle.appendGuess('APPLE')
        expect(wordle.shouldEndGame()).toBe(true)
    })

    test('returns true if there are no more guesses left', () =>
    {
        const wordle = new Wordle(1)
        wordle.appendGuess('GUESS')
        expect(wordle.shouldEndGame()).toBe(true)
    })

    test('returns true if there are no more guesses left', () =>
    {
        const wordle = new Wordle()
        expect(wordle.shouldEndGame()).toBe(false)
    })

    test('returns false if there are guesses left and the word has not been guessed', () =>
    {
        const wordle = new Wordle()
        wordle.appendGuess('GUESS')
        expect(wordle.isSolved()).toBe(false)
    })
})