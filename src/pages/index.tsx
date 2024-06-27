import { useState, useEffect } from 'react';
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
  const [level, setLevel] = useState([10, 9, 9]);
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2 | 3)[][]>(
    [...Array(level[2])].map(() => [...Array(level[1])].map(() => 0)),
  );
  // 0 -> 未クリック
  // 1 -> 左クリック
  // 2 -> はてな
  // 3 -> 旗

  const [bombMap, setBombMap] = useState(
    [...Array(level[2])].map(() => [...Array(level[1])].map(() => -1)),
  );
  // -1 -> ボム無し
  // 10 -> ボム有り
  // 11 -> ボム旗あり

  const defaultBomb = [...Array(level[2])].map(() => [...Array(level[1])].map(() => -1));
  const defaultInput: 0[][] = [...Array(level[2])].map(() => [...Array(level[1])].map(() => 0));

  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    if (paused) {
      return;
    }
    const timerId = setInterval(() => {
      setTime((c) => c + 1);
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [paused]);

  const checkXY = (X: number, Y: number) => {
    return [X < 0, X >= level[1], Y < 0, Y >= level[2]].some((element) => element);
  };

  const counter = (board: number[][]) => {
    [...Array(level[1])].map((_, x) => {
      [...Array(level[2])].map((_, y) => {
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
    while (board.flat().filter((number) => number === 10).length < level[0]) {
      const Y = Math.floor(Math.random() * level[2]);
      const X = Math.floor(Math.random() * level[1]);
      if ([Y === y, X === x].every((element) => element)) {
        board[Y][X] = -1;
        console.log('Oops');
      } else {
        board[Y][X] = 10;
      }
    }
    setBombMap(board);
  };

  const count = level[0] - userInputs.flat().filter((number) => number === 3).length;

  const isGameClear =
    userInputs.flat().filter((number) => number === 0).length +
      userInputs.flat().filter((number) => number === 3).length ===
    level[0];

  const clickL = (x: number, y: number) => {
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    const newbombMap = structuredClone(bombMap);
    console.log(newbombMap);

    const fill_cell = (x: number, y: number) => {
      if (newuserInputs[y][x] === 0) {
        newuserInputs[y][x] = 1;
      }
      if (newbombMap[y][x] === -1) {
        newbombMap[y][x] = -2;
        directions.map(([a, b]) => {
          const X = a + x;
          const Y = b + y;
          if (!checkXY(X, Y)) {
            console.log(x, y);
            fill_cell(X, Y);
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
      setPaused(false);
    }

    if (
      newbombMap[y][x] === 10 &&
      !isGameClear &&
      newuserInputs[y][x] !== 3 &&
      newuserInputs[y][x] !== 2
    ) {
      endGame();
      setPaused(true);
      setFail(true);
      newbombMap[y][x] += 1;
      setBombMap(newbombMap);
    }
    if (!isGameClear && !failGame && newuserInputs[y][x] !== 3 && newuserInputs[y][x] !== 2) {
      fill_cell(x, y);
    }
    setUserInputs(newuserInputs);
    setBombMap(newbombMap);
  };

  const clickR = (x: number, y: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newuserInputs = structuredClone(userInputs);
    const num = newuserInputs[y][x];
    if (num === 0 && !isGameClear && !failGame) {
      newuserInputs[y][x] = 3;
    } else if (num === 3) {
      newuserInputs[y][x] = 0;
    }
    setUserInputs(newuserInputs);
  };
  useEffect(() => {
    setPaused(true);
  }, [isGameClear]);

  const reloadPage = () => {
    setBombMap(defaultBomb);
    setUserInputs(defaultInput);
    setPaused(true);
    setTime(0);
    setFail(false);
  };
  const [failGame, setFail] = useState(false);

  const [customX, setCustomX] = useState(9);
  const [customY, setCustomY] = useState(9);
  const [customBombs, setCustomBombs] = useState(10);

  const beg = () => {
    setLevel([10, 9, 9]);
    setPaused(true);
    setTime(0);
    reloadPage();
  };
  const itm = () => {
    setLevel([40, 16, 16]);
    setPaused(true);
    setTime(0);
    reloadPage();
  };
  const exp = () => {
    setLevel([99, 30, 16]);
    setPaused(true);
    setTime(0);
    reloadPage();
  };
  const custom = () => {
    if (customY * customX > customBombs) {
      setLevel([customBombs, customY, customX]);
      setPaused(true);
      setTime(0);
      reloadPage();
    }
  };
  useEffect(() => {
    setBombMap([...Array(level[2])].map(() => [...Array(level[1])].map(() => -1)));
    setUserInputs([...Array(level[2])].map(() => [...Array(level[1])].map(() => 0)));
  }, [level]);

  if (isGameClear && !failGame) {
    const newuserInputs = structuredClone(userInputs);
    newuserInputs.map((row, y) => {
      row.map((number, x) => {
        if (number === 0) {
          //console.log(x, y);
          newuserInputs[y][x] = 3;
          setUserInputs(newuserInputs);
        }
      });
    });
  }
  return (
    <div className={styles.container}>
      <div className={styles.levelMom}>
        <div className={styles.level}>
          <button onClick={beg}>初級</button>
        </div>
        <div className={styles.level}>
          <button onClick={itm}>中級</button>
        </div>
        <div className={styles.level}>
          <button onClick={exp}>上級</button>
        </div>
      </div>
      <div className={styles.levelCustom}>
        <label>たて</label>
        <input
          placeholder="X"
          value={customX}
          onChange={(e) => setCustomX(Number(e.target.value))}
        />
        <label>よこ</label>
        <input
          placeholder="Y"
          value={customY}
          onChange={(e) => setCustomY(Number(e.target.value))}
        />
        <label>爆弾</label>
        <input
          placeholder="Bomb"
          value={customBombs}
          onChange={(e) => setCustomBombs(Number(e.target.value))}
        />
        <button onClick={custom}>カスタム</button>
      </div>
      <div
        className={styles.board}
        style={{
          width: `${level[1] >= 9 ? 70 + 35.8 * level[1] : 356.4}px`,
          height: `${200 + 35.8 * level[2]}px`,
        }}
      >
        <div
          className={styles.topStyle}
          style={{
            width: `${level[1] >= 9 ? 35.8 * level[1] : 296.4}px`,
          }}
        >
          <div className={styles.countStyle}>{String(count).padStart(3, '0')}</div>
          <div
            className={styles.faceStyle}
            style={{
              backgroundPosition: `${failGame ? -520 : isGameClear ? -480 : -440}px 0px`,
            }}
            onClick={() => reloadPage()}
          />
          <div className={styles.timerStyle}>{String(time).padStart(3, '0')}</div>
        </div>
        <div
          className={styles.gameStyle}
          style={{
            width: `${35.4 * level[1] + 10}px`,
            height: `${35.4 * level[2] + 10}px`,
          }}
        >
          <div
            className={styles.boardStyle}
            style={{
              width: `${35 * level[1]}px`,
              height: `${35 * level[2]}px`,
            }}
          >
            {userInputs.map((row, y) =>
              row.map((number, x) => (
                <div
                  className={styles.numStyle}
                  style={{
                    backgroundPosition: `${bombMap[y][x] === 11 ? -297 : -29.8 * bombMap[y][x]}px 1.7px`,
                    backgroundColor: `${{ 0: '#c6c6c6', 12: 'red' }[bombMap[y][x] + 1]}`,
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
