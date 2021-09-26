export interface IWord {
  timestamp: number;
  pos: number;
  word?: string;
  duration: number;
  isTyped?: number;
}

export interface IWordObject extends IWord {
  getWord: () => string;
  setWord: (word: string) => void;
  getTyped: () => number;
  setTyped: () => void;
  id: number;
  isKilled: () => boolean;
}

function Word(
  { word = "", timestamp, pos, duration, isTyped = 0 }: IWord,
  level = 0
): IWordObject {
  let id = Math.floor(Math.random() * 10000);
  let _word = word;
  // const timestamp = Date.now();
  const getRandomX = () => {
    return 0;
    // max 100
  };
  const getRandomDuration = () => Math.random() * 100;
  // const pos = getRandomX();
  // const duration = getRandomDuration();
  const setWord = (newWord: string) => (_word = newWord);
  const setTyped = () => isTyped++;

  return {
    timestamp,
    pos,
    id,
    getWord: () => _word,
    getTyped: () => isTyped,
    setTyped,
    duration,
    setWord,
    isKilled: () => _word.length === isTyped,
  };
}

export default Word;
