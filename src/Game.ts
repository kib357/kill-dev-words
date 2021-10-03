import Word, { IWord, IWordObject } from "./Word";

interface IGame {
  duration?: number;
  WORDS?: string[];
  PLAYER_OFFSET: number;
}
export type IDestination = { x: number; y: number };

export interface IParticle {
  duration: number;
  destination: IDestination;
  key: string;
  timestamp: number;
}

export interface IGameState {
  state: GAME_STATE;
  score: number;
  game_duration: number;
  words: IWordObject[];
  getParticles: () => IParticle[];
  current?: IWordObject;
  start_timestamp: number;
}

export enum GAME_STATE {
  PLAY,
  SCORE,
}

function Game({ duration = 30 * 1000, WORDS = [], PLAYER_OFFSET }: IGame) {
  const start_timestamp = Date.now();
  let game_duration = 0;
  let state: GAME_STATE = GAME_STATE.PLAY;
  const stopGame = (isTimeUp: boolean) => {
    state = GAME_STATE.SCORE;
    game_duration = isTimeUp ? duration : getDuration();
  };

  let score = 0;
  let _score = 0;
  const addScore = (word: IWordObject) => {
    const scoreUp = word.getWord().length;
    _score += scoreUp * 123; // TODO рефакторинг двух видов счета (внутренний=100 и внешний = 123 * длинна слова)
    score += 100;
  };

  let particles: IParticle[] = [];

  let words: IWordObject[] = [];
  let wordSpawnTimeout = 0;
  const getRandomDuration = (word: string) => {
    const duration = Math.floor(
      3800 + word.length * (1200 + Math.random() * 600)
    );
    const levelMultiplier = score >= 200 ? 1 / (score / 500) : 1;

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
      words = [
        ...words,
        Word({
          word,
          pos: getRandomPos(),
          timestamp: Date.now(),
          duration: getRandomDuration(word),
        }),
      ];
    }
  };

  const getTimeIsUp = () => {
    const now = Date.now();
    return start_timestamp + duration <= now;
  };

  const getDuration = () => Date.now() - start_timestamp;

  // PARTICLES
  // TODO TESTS
  const shootParticle = (word: IWordObject) => {
    const PARTICLE_DURATION = 180;
    const particlesContainer = document.getElementById(
      "particles"
    ) as HTMLElement | null;
    const { clientWidth = 0, clientHeight = 0 } = particlesContainer || {};
    const now = Date.now();
    const { pos, duration, timestamp } = word;
    const currentPos = duration - (now - timestamp + PARTICLE_DURATION);
    const progress = 1 - (duration - currentPos) / duration;

    // from x: 10%, y: 100%
    const start = {
      x: pos / 100,
      y: 0,
    };
    // to x: 50%, y: 0% - PLAYER_OFFSET
    const end = {
      x: 0.5,
      y: (clientHeight - PLAYER_OFFSET) / clientHeight,
    };

    // word current position
    const destinationPos = {
      x: start.x + (end.x - start.x) * (1 - progress),
      y: start.y + (end.y - start.y) * (1 - progress),
    };

    const particle = {
      timestamp: Date.now(),
      key: String(Math.random() * 10000),
      destination: destinationPos,
      duration: PARTICLE_DURATION,
    };
    particles = [...particles, particle];
  };
  const getParticles = () => particles;

  //  TODO TESTS
  const cleanParticles = () => {
    let isFiltered = false;
    const now = Date.now(); // TODO refactor to global now value
    const filtered = particles.filter(({ timestamp, duration }) => {
      if (timestamp + duration < now) {
        isFiltered = true;
        return false;
      }

      return true;
    });

    if (isFiltered) {
      particles = filtered;
    }
  };

  return {
    onKeydown: (e: { key: string; code: string }) => {
      const prepareCode = (code: string) =>
        code.toLowerCase().replace("key", "");
      const char = prepareCode(e.code);
      const typedWord = getTypedWord(words);
      if (typedWord) {
        const word = typedWord.getWord();
        const isCorrect = word[typedWord?.getTyped()] === char;
        if (isCorrect) {
          typedWord.setTyped();
          shootParticle(typedWord);
          return typedWord;
        }
      } else {
        const newTyped = findClosestWord(words, char);
        newTyped?.setTyped();
        newTyped && shootParticle(newTyped);
        return newTyped;
      }

      return null;
    },
    getState: (): IGameState => {
      return {
        state,
        score: _score,
        game_duration,
        words,
        getParticles,
        start_timestamp,
        current: getTypedWord(words),
      };
    },
    tick: () => {
      const { score, killed } = countScore(words);
      if (score && killed) addScore(killed);

      const collision = detectWordCollision(words);
      if (collision || getTimeIsUp()) {
        stopGame(getTimeIsUp());
      } else {
        words = killWords(words);
        spawnWord();
      }

      cleanParticles();
    },
  };
}

export function getTypedWord(words: IWordObject[]) {
  return words.find((word) => word.getTyped());
}

export function generateSpawnTimeout() {
  // TODO:GAMEPLAY use level
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

export function countScore(words: IWordObject[]): {
  score: boolean;
  killed: IWordObject | undefined;
} {
  const killed = words.find(isKilled);
  return { score: Boolean(killed), killed };
}

export function detectWordCollision(words: IWordObject[]): boolean {
  const isCollision = ({ duration, timestamp }: IWordObject) => {
    const now = Date.now();
    return timestamp + duration <= now;
  };
  return Boolean(words.find(isCollision));
}

export default Game;
