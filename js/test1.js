function seed() {
    const argArray = Array.from(arguments);
    return argArray;
  }
  
  function same([x, y], [j, k]) {
    const areSame = (x === j && y === k) ? true : false;
    return areSame;
  }
  
  // The game state to search for `cell` is passed as the `this` value of the function.
  function contains(cell) {
    let isAlive = false;
    this.forEach((x) => {
      if (x[0] === cell[0] && x[1] === cell[1]) isAlive = true;
    })
    return isAlive;
  }
  
  const printCell = (cell, state) => {
    let printedCell = contains.call(state, cell) == true ? '\u25A3' : '\u25A2';
    return printedCell;
  };
  
  const corners = (state = []) => {
    let l = state.length;
    let xValues = [];
    let yValues = [];
      state.forEach((cell) => {
        xValues.push(cell[0]);
        yValues.push(cell[1]);
      });
      xValues.sort();
      yValues.sort();
      topRight = (l > 0) ? [xValues[l-1], yValues[l-1]] : [0,0];
      bottomLeft = (l > 0) ? [xValues[0], yValues[0]] : [0,0];
    return {topRight, bottomLeft};
  };
  
  const printCells = (state) => {
    let c = corners(state);
    let symbolString = '';
  
    for (i = c.topRight[1]; i >= c.bottomLeft[1]; i--) {
        for (j = c.bottomLeft[0]; j <= c.topRight[0]; j++) {
            let cell = [j, i];
            symbolString += printCell(cell, state);
        } symbolString += '\n';
    }
    
    return symbolString;
  };
  
  const getNeighborsOf = ([x, y]) => {
    let neighborArray = [[x-1, y+1], [x, y+1], [x+1, y+1], [x-1, y], [x+1, y], [x-1, y-1], [x, y-1], [x+1, y-1]];
    return neighborArray;
  };
  
  const getLivingNeighbors = (cell, state) => {
    const neighbors = getNeighborsOf(cell);
    const containsLimited = contains.bind(state);
    const activeNeighbors = [];
    neighbors.forEach((x) => {
        if (containsLimited(x)) activeNeighbors.push(x);
    });
    return activeNeighbors;
  };
  
  const willBeAlive = (cell, state) => {
    let firstCondition = (getLivingNeighbors(cell, state).length === 3) ? true : false;
    let secondCondition = (getLivingNeighbors(cell, state).length === 2 && contains.call(state, cell)) ? true : false;
    return firstCondition || secondCondition;
  };
  
  const calculateNext = (state) => {
    const {bottomLeft, topRight} = corners(state);
    let nextArray = [];
    for (let i = topRight[1]+1; i >= bottomLeft[1]-1; i--) {
        for (let j = bottomLeft[0]-1; j <= topRight[0]+1; j++) {
            let cell = [j, i];
            nextArray = nextArray.concat(willBeAlive(cell, state) ? [cell] : []);
        } 
    }
    return nextArray;
  };
  
  
  
  const iterate = (state, iterations) => {
    let stateArrays = [];
    stateArrays.push(state);
    for (let i = 0; i < iterations; i++) {
      state = calculateNext(state);
      stateArrays.push(state);
      console.log(printCells(state));
    }
    return stateArrays;
  };
  
  
  const startPatterns = {
      rpentomino: [
          [3, 2],
          [2, 3],
          [3, 3],
          [3, 4],
          [4, 4]
        ],
        glider: [
            [-2, -2],
        [-1, -2],
        [-2, -1],
        [-1, -1],
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 2],
        [2, 3]
    ],
    square: [
        [1, 1],
        [2, 1],
        [1, 2],
        [2, 2]
    ]
};

const main = (pattern, iterations) => {
  const {rpentomino, glider, square} = startPatterns;
  let patternName = (pattern === 'rpentomino') ? rpentomino : (pattern === 'glider') ? glider : square;
  iterate(patternName, iterations)
};

main('rpentomino', 2);

// const [pattern, iterations] = process.argv.slice(2);
// const runAsScript = require.main === module;

    // if (runAsScript) {
    //   if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    //     main(pattern, parseInt(iterations));
    //   } else {
    //     console.log("Usage: node js/gameoflife.js rpentomino 50");
    //   }
    // }
    