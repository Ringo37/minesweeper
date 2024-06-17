import { useState, useRef } from 'react';
import styles from './index.module.css';

const Home = () => {
  const directions = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];
  const filldirections = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2 | 3)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  // 0 -> 未クリック
  // 1 -> 左クリック
  // 2 -> はてな
  // 3 -> 旗
  const bombConst = 10;

  const [bombMap, setBombMap] = useState([
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ]);
  // -1 -> ボム無し
  // 10 -> ボム有り

  const defaultBomb = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

  const defaultInput: 0[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 10);
    }, 10);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);

  const checkXY = (X: number, Y: number) => {
    return [X < 0, X >= 9, Y < 0, Y >= 9].some((element) => element);
  };

  const counter = (board: number[][]) => {
    [...Array(9)].map((_, x) => {
      [...Array(9)].map((_, y) => {
        directions.map(([a, b]) => {
          const X = a + x;
          const Y = b + y;
          if (!checkXY(X, Y)) {
            if (board[y][x] === 10) {
              if (board[Y][X] !== 10) {
                board[Y][X] += 1;
              }
            }
          }
        });
      });
    });
    setBombMap(board);
  };

  const initializeBombs = (x: number, y: number, board: number[][]) => {
    while (board.flat().filter((number) => number === 10).length < bombConst) {
      const Y = Math.floor(Math.random() * 9);
      const X = Math.floor(Math.random() * 9);
      if ([Y === y, X === x].every((element) => element)) {
        board[Y][X] = -1;
        console.log('Oops');
      } else {
        board[Y][X] = 10;
      }
    }
    setBombMap(board);
  };

  const count = bombConst - userInputs.flat().filter((number) => number === 3).length;

  const isGameEnd =
    userInputs.flat().filter((number) => number === 0).length +
      userInputs.flat().filter((number) => number === 3).length ===
    bombConst;

  const clickL = (x: number, y: number) => {
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    const newbombMap = structuredClone(bombMap);

    const fill = (x: number, y: number) => {
      if (newuserInputs[y][x] === 0) {
        newuserInputs[y][x] = 1;
      }
      if (newbombMap[y][x] === -1) {
        newbombMap[y][x] = -2;
        filldirections.map(([a, b]) => {
          const X = a + x;
          const Y = b + y;
          if (!checkXY(X, Y)) {
            fill(X, Y);
          }
        });
      }
    };

    const endGame = () => {
      bombMap.map((row, y) => {
        row.map((number, x) => {
          if (number === 10) {
            console.log(x, y);
            newuserInputs[y][x] = 1;
            setUserInputs(newuserInputs);
          }
        });
      });
    };

    // ここからメイン
    //console.log(bombMap);
    if (bombMap.flat().filter((a) => a === 10).length === 0) {
      initializeBombs(x, y, newbombMap);
      counter(newbombMap);
      handleStart();
    }

    if (newbombMap[y][x] === 10) {
      endGame();
    }

    fill(x, y);
    setUserInputs(newuserInputs);
    setBombMap(newbombMap);
  };
  if (isGameEnd) {
    console.log('Grate');
  }

  const clickR = (x: number, y: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newuserInputs = structuredClone(userInputs);
    const num = newuserInputs[y][x];
    if (num === 0) {
      newuserInputs[y][x] = 3;
    } else if (num === 3) {
      newuserInputs[y][x] = 2;
    } else if (num === 2) {
      newuserInputs[y][x] = 0;
    }
    setUserInputs(newuserInputs);
  };

  const reloadPage = () => {
    setBombMap(defaultBomb);
    setUserInputs(defaultInput);
    handleReset();
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <div className={styles.topStyle}>
          <div className={styles.countStyle}>{String(count).padStart(3, '0')}</div>
          <div
            className={styles.faceStyle}
            style={{
              backgroundPosition: `${-440}px 0px`,
            }}
            onClick={() => reloadPage()}
          />
          <div className={styles.timerStyle}>{String(seconds).padStart(3, '0')}</div>
        </div>
        <div className={styles.gameStyle}>
          <div className={styles.boardStyle}>
            {userInputs.map((row, y) =>
              row.map((number, x) => (
                <div
                  className={styles.numStyle}
                  style={{
                    backgroundPosition: `${-29.8 * bombMap[y][x]}px 1.7px`,
                    backgroundColor: `${{ 0: '#c6c6c6', 11: 'red' }[bombMap[y][x] + 1]}`,
                  }}
                  key={`${x}-${y}`}
                >
                  <div
                    className={styles.tileStyle}
                    style={{
                      border: [undefined, '0px'][number],
                      background: ['#c6c6c6', 'transparent'][number],
                    }}
                    key={`${x}-${y}`}
                    onClick={() => clickL(x, y)}
                    onContextMenu={(event) => clickR(x, y, event)}
                  >
                    <div
                      className={styles.flagStyle}
                      style={{
                        backgroundPosition: `${{ 0: 30, 1: 30, 2: -184, 3: -207 }[userInputs[y][x]]}px 1.5px`,
                      }}
                    />
                  </div>
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
