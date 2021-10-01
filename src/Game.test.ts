import Game, {
  findClosestWord,
  killWords,
  countScore,
  detectWordCollision,
  GAME_STATE,
} from "./Game";
import Word, { IWord, IWordObject } from "./Word";

test("Game", () => {
  const duration = 60 * 1000; // 1 minute
  const game = Game({ duration, WORDS: ["a"] });
  // window.addEventListener("keydown", game.onKeydown);
  let state = game.getState();
  //   setInterval(() => {
  game.tick();
  state = game.getState();
  // console.log("state", state);
  //   }, 33);
});

interface IGenerateWord extends IWordObject {
  typed?: number;
}
function generateWord({
  timestamp = Date.now(),
  word = "any",
  duration = 100,
  typed = 0,
} = {}): IWordObject {
  return Word({
    timestamp,
    pos: 1,
    word,
    duration,
    isTyped: typed,
  });
}

test("on typing should find closest matched WORD (same duration)", () => {
  const WORDS = [
    generateWord(),
    generateWord({
      timestamp: 0,
      word: "act",
      duration: 100,
    }),
  ];
  const char = "a";
  const word = findClosestWord(WORDS, char);
  expect(word && word.getWord()).toBe("act");
});

test("on typing should find closest matched WORD (same timestamp)", () => {
  const WORDS = [
    generateWord({
      timestamp: 1,
    }),
    generateWord({
      timestamp: 1,
      word: "act",
      duration: 110,
    }),
  ];
  const char = "a";
  const word = findClosestWord(WORDS, char);
  expect(word && word.getWord()).toBe("any");
});

test("findClosestWord should return link to matched WORD", () => {
  const WORDS = [
    generateWord(),
    generateWord({
      timestamp: 0,
      word: "act",
    }),
  ];
  const char = "a";
  const word = findClosestWord(WORDS, char);
  word?.setTyped();
  expect(WORDS[0].getTyped()).toBe(1);
});

test("Game should kill words", () => {
  const words = killWords([
    generateWord(),
    generateWord({ typed: 3, word: "aaa" }),
  ]);
  expect(words.length).toBe(1);
});

test("Game should increase score after word was killed", () => {
  const word = "aaa";
  const { score: isScore, killed } = countScore([
    generateWord(),
    generateWord({ typed: 3, word }),
  ]);
  expect(isScore).toBeTruthy();
  expect(killed?.getWord()).toEqual(word);
});

test("Game should not increase score if word not killed", () => {
  const { score: isScore } = countScore([
    generateWord(),
    generateWord({ typed: 2, word: "aaa" }),
  ]);
  expect(isScore).toBeFalsy();
});

test("Game should end when word hits player", () => {
  jest.useFakeTimers("modern").setSystemTime(1);
  const isCollision = detectWordCollision([
    generateWord({
      timestamp: 0,
    }),
    generateWord({ timestamp: 0, duration: 1 }),
  ]);
  expect(isCollision).toBeTruthy();
});

test("Game should run with out word collision", () => {
  const isCollision = detectWordCollision([
    generateWord(),
    generateWord({ timestamp: 0, duration: 100 }),
  ]);
  expect(isCollision).toBeFalsy();
});

it("Game should spawn words with random timeout", () => {
  jest.useFakeTimers("modern").setSystemTime(1);
  const game = Game({
    WORDS: [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ],
  });
  game.tick();
  const firstTick = game.getState();
  expect(firstTick.words.length).toBe(1);

  // increase time
  jest.useFakeTimers("modern").setSystemTime(4001);
  game.tick();
  const secondTick = game.getState();
  expect(secondTick.words.length).toBe(2);
});

test("Game should end after the specified time", () => {
  jest.useFakeTimers("modern").setSystemTime(1);
  const game = Game({ WORDS: ["a", "b", "c"], duration: 10 });
  jest.useFakeTimers("modern").setSystemTime(100);
  game.tick();
  const state = game.getState();
  expect(state.state).toBe(GAME_STATE.SCORE);
});

test("Game should return statistics", () => {
  const game = Game({ WORDS: ["a"] });
  game.tick(); // spawn word
  game.onKeydown({ code: "KeyA", key: "a" });
  game.tick(); // count score
  const state = game.getState();
  expect(state.score).toBe(123);
});
