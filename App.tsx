import { useState, useEffect } from 'react';

interface Tile {
    value: number;
    id: number;
  }
  
  const colors = {
    5: 'bg-gray-200',
    10: 'bg-gray-300',
    20: 'bg-yellow-200',
    40: 'bg-yellow-400',
    80: 'bg-orange-200',
    160: 'bg-orange-400',
    320: 'bg-red-200',
    640: 'bg-red-400',
    1280: 'bg-pink-200',
    2560: 'bg-pink-400',
    5120: 'bg-purple-200',
    10240: 'bg-purple-400',
    20480: 'bg-blue-200',
    40960: 'bg-blue-400',
    81920: 'bg-green-200',
    163840: 'bg-green-400',
    327680: 'bg-indigo-200',
    655360: 'bg-indigo-400',
  };

const Game_5_Plus = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    setTiles([]);
    setScore(0);
    setGameOver(false);
    addTile();
    addTile();
  };

  const addTile = () => {
    const newTile: Tile = {
      value: Math.random() < 0.9 ? 5 : 10,
      id: Math.random(),
    };
    const emptyCells = getEmptyCells();
    if (emptyCells.length === 0) return;
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    setTiles((prevTiles) => [...prevTiles, { ...newTile, id: emptyCells[randomIndex] }]);
  };

  const getEmptyCells = () => {
    const emptyCells: number[] = [];
    for (let i = 0; i < 12; i++) {
      if (!tiles.find((tile) => tile.id === i)) emptyCells.push(i);
    }
    return emptyCells;
  };

  const moveUp = () => {
    const newTiles: Tile[] = [];
    for (let i = 0; i < 4; i++) {
      const column: Tile[] = [];
      for (let j = 0; j < 3; j++) {
        const tile = tiles.find((tile) => tile.id === i + j * 4);
        if (tile) column.push(tile);
      }
      const mergedColumn = mergeTiles(column);
      for (let j = 0; j < 3; j++) {
        if (mergedColumn[j]) newTiles.push({ ...mergedColumn[j], id: i + j * 4 });
      }
    }
    setTiles(newTiles);
    addTile();
    checkGameOver();
  };

  const moveDown = () => {
    const newTiles: Tile[] = [];
    for (let i = 0; i < 4; i++) {
      const column: Tile[] = [];
      for (let j = 2; j >= 0; j--) {
        const tile = tiles.find((tile) => tile.id === i + j * 4);
        if (tile) column.push(tile);
      }
      const mergedColumn = mergeTiles(column);
      for (let j = 2; j >= 0; j--) {
        if (mergedColumn[2 - j]) newTiles.push({ ...mergedColumn[2 - j], id: i + j * 4 });
      }
    }
    setTiles(newTiles);
    addTile();
    checkGameOver();
  };

  const moveLeft = () => {
    const newTiles: Tile[] = [];
    for (let i = 0; i < 3; i++) {
      const row: Tile[] = [];
      for (let j = 0; j < 4; j++) {
        const tile = tiles.find((tile) => tile.id === j + i * 4);
        if (tile) row.push(tile);
      }
      const mergedRow = mergeTiles(row);
      for (let j = 0; j < 4; j++) {
        if (mergedRow[j]) newTiles.push({ ...mergedRow[j], id: j + i * 4 });
      }
    }
    setTiles(newTiles);
    addTile();
    checkGameOver();
  };

  const moveRight = () => {
    const newTiles: Tile[] = [];
    for (let i = 0; i < 3; i++) {
      const row: Tile[] = [];
      for (let j = 3; j >= 0; j--) {
        const tile = tiles.find((tile) => tile.id === j + i * 4);
        if (tile) row.push(tile);
      }
      const mergedRow = mergeTiles(row);
      for (let j = 3; j >= 0; j--) {
        if (mergedRow[3 - j]) newTiles.push({ ...mergedRow[3 - j], id: j + i * 4 });
      }
    }
    setTiles(newTiles);
    addTile();
    checkGameOver();
  };

  const mergeTiles = (tiles: Tile[]) => {
    const newTiles: Tile[] = [];
    for (let i = 0; i < tiles.length; i++) {
      if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
        newTiles.push({ value: tiles[i].value * 2, id: Math.random() });
        setScore((prevScore) => prevScore + tiles[i].value * 2);
        i++;
      } else {
        newTiles.push(tiles[i]);
      }
    }
    return newTiles;
  };

  const checkGameOver = () => {
    if (getEmptyCells().length === 0) {
      let gameOver = true;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          const tile = tiles.find((tile) => tile.id === i + j * 4);
          if (tile) {
            if (i < 3) {
              const rightTile = tiles.find((tile) => tile.id === i + 1 + j * 4);
              if (rightTile && rightTile.value === tile.value) gameOver = false;
            }
            if (j < 2) {
              const downTile = tiles.find((tile) => tile.id === i + (j + 1) * 4);
              if (downTile && downTile.value === tile.value) gameOver = false;
            }
          }
        }
      }
      setGameOver(gameOver);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded">
      <h1 className="text-3xl font-bold mb-4">Game 5 Plus</h1>
      <div className="flex justify-between mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startGame}>
          New Game
        </button>
        <p className="text-lg font-bold">Score: {score}</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="w-20 h-20 bg-gray-200 flex justify-center items-center rounded">
            {tiles.find((tile) => tile.id === i) && (
              <p
                className={`text-3xl font-bold ${tiles.find((tile) => tile.id === i)?.value === 5 ? 'bg-gray-200' : tiles.find((tile) => tile.id === i)?.value === 10 ? 'bg-gray-300' : 'bg-blue-500'} text-white`}
              >
                {tiles.find((tile) => tile.id === i)?.value}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={moveUp}
        >
          Up
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={moveDown}
        >
          Down
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={moveLeft}
        >
          Left
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={moveRight}
        >
          Right
        </button>
      </div>
      {gameOver && (
        <p className="text-lg font-bold mt-4">Game Over! Your final score is {score}.</p>
      )}
    </div>
  );
};

export default Game_5_Plus;