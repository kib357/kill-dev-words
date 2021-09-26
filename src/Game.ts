import Word, { IWord, IWordObject } from "./Word";

interface IGame {
  duration?: number;
  WORDS?: string[];
}

export interface IGameState {
  state: GAME_STATE;
  score: number;
  game_duration: number;
  words: IWordObject[];
  current?: IWordObject;
}

export enum GAME_STATE {
  PLAY,
  SCORE,
}

function Game({ duration = 30 * 1000, WORDS = [] }: IGame) {
  const start_timestamp = Date.now();
  let game_duration = 0;
  let state: GAME_STATE = GAME_STATE.PLAY;
  const stopGame = () => {
    state = GAME_STATE.SCORE;
    game_duration = getDuration();
  };

  let score = 0;
  const addScore = () => (score += 100);

  let words: IWordObject[] = [];
  let wordSpawnTimeout = 0;
  const getRandomDuration = (word: string) => {
    const duration = Math.floor(
      3000 + word.length * (500 + Math.random() * 500)
    );
    const levelMultiplier = score >= 200 ? 1 / (score / 200) : 1;

    return duration * levelMultiplier;
  };

  const getRandomWord = () => {
    const index = Math.floor(Math.random() * WORDS?.length);
    return WORDS[index];
  };
  const getRandomPos = () => Math.floor(Math.random() * 100);
  const spawnWord = () => {
    const now = Date.now();
    if (wordSpawnTimeout <= now) {
      wordSpawnTimeout = generateSpawnTimeout();
      const word = getRandomWord();
      words.push(
        Word({
          word,
          pos: getRandomPos(),
          timestamp: Date.now(),
          duration: getRandomDuration(word),
        })
      );
    }
  };

  const getTimeIsUp = () => {
    const now = Date.now();
    return start_timestamp + duration <= now;
  };

  const getDuration = () => Date.now() - start_timestamp;

  return {
    onKeydown: (e: { key: string; code: string }) => {
      const char = e.key;
      const typedWord = getTypedWord(words);
      if (typedWord) {
        const word = typedWord.getWord();
        const isCorrect = word[typedWord?.getTyped()] === char;
        if (isCorrect) {
          typedWord.setTyped();
          return typedWord;
        }
      } else {
        const newTyped = findClosestWord(words, char);
        newTyped?.setTyped();
        return newTyped;
      }

      return null;
    },
    getState: (): IGameState => {
      return {
        state,
        score,
        game_duration,
        words,
        current: getTypedWord(words),
      };
    },
    tick: () => {
      const score = countScore(words);
      if (score) addScore();

      const collision = detectWordCollision(words);
      if (collision || getTimeIsUp()) {
        stopGame();
      } else {
        words = killWords(words);
        spawnWord();
      }
    },
  };
}

export function getTypedWord(words: IWordObject[]) {
  return words.find((word) => word.getTyped());
}

export function generateSpawnTimeout() {
  // TODO use level
  const now = Date.now();
  const timeout = Math.floor(2000 + Math.random() * 2000);
  return now + timeout;
}

export function sortByClosest(a: IWord, b: IWord) {
  const { timestamp: timestampA, duration: durationA } = a;
  const { timestamp: timestampB, duration: durationB } = b;
  const aTransitionLeft = timestampA + durationA;
  const bTransitionLeft = timestampB + durationB;
  if (aTransitionLeft < bTransitionLeft) {
    return -1;
  } else if (aTransitionLeft === bTransitionLeft) {
    return 0;
  }
  return 1;
}

export function findClosestWord(
  words: IWordObject[],
  char: string
): IWordObject | null {
  return (
    words
      .sort(sortByClosest)
      .find(({ getWord }) => getWord().indexOf(char) === 0) || null
  );
}

function isKilled(word: IWordObject) {
  return word.isKilled();
}

export function killWords(words: IWordObject[]): IWordObject[] {
  return words.filter((word) => !isKilled(word));
}

export function countScore(words: IWordObject[]): boolean {
  return Boolean(words.find(isKilled));
}

export function detectWordCollision(words: IWordObject[]): boolean {
  const isCollision = ({ duration, timestamp }: IWordObject) => {
    const now = Date.now();
    return timestamp + duration <= now;
  };
  return Boolean(words.find(isCollision));
}

export default Game;
