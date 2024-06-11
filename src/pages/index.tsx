import { useState } from 'react';
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
  // -1 -> ボム無し
  // 10 -> ボム有り
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
    while (board.flat().filter((number) => number === 10).length < 10) {
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

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    const newbombMap = structuredClone(bombMap);
    //console.log(bombMap);
    if (bombMap.flat().filter((a) => a === 10).length === 0) {
      initializeBombs(x, y, newbombMap);
      counter(newbombMap);
    }
    newuserInputs[y][x] = 1;
    setUserInputs(newuserInputs);
  };

  const clickR = (x: number, y: number,event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0) {
      newuserInputs[y][x] = 2;
      setUserInputs(newuserInputs);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <div className={styles.countStyle} />
        <div className={styles.gameStyle}>
          <div className={styles.boardStyle}>
            {userInputs.map((row, y) =>
              row.map((number, x) => (
                <div
                  className={styles.numStyle}
                  style={{
                    backgroundPosition: `${-29.8 * bombMap[y][x]}px 1.5px`,
                  }}
                  key={`${x}-${y}`}
                >
                  <div
                    className={styles.tileStyle}
                    style={{
                      border: [undefined, '0px'][0],
                      background: ['#c6c6c6', 'transparent'][1],
                    }}
                    key={`${x}-${y}`}
                    onClick={() => clickHandler(x, y)}
                    onContextMenu={(event) => clickR(x, y, event)}
                  >
                    <div
                      className={styles.flagStyle}
                      style={{
                        backgroundPosition: `${{ 0: 30, 1: 30, 2: -242, 3: -270 }[userInputs[y][x]]}px 0px`,
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
