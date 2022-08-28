// Given a one-dimensional grid of cells (a single iteration), 
// calculate the next based on the provided rule
const getNextRow = (currRow, ruleBinary) => {
  return currRow.map((cell, idx) => {
    // Find left values of left and right neighbours
    const leftNeighbour = currRow[idx-1] || 0
    const rightNeighbour = currRow[idx+1] || 0
    // console.log(leftNeighbour, cell, rightNeighbour);

    // Convert neighbours to binary bits and decimal
    const neighbourhoodRuleBits = [leftNeighbour, cell, rightNeighbour].join('')
    const neighbourhoodRule = parseInt(neighbourhoodRuleBits, 2)
    // console.log(neighbourhoodRuleBits);

    // Determine the value of the cell in the next iteration based on the rule provided
    const newCellValue = parseInt(ruleBinary[(ruleBinary.length-1)-neighbourhoodRule])
    return newCellValue
  })
}

// Given an initial automaton state, number of iterations, and rule, generate
// the automaton and return a two-dimensional array containing this information
const generateAutomaton = (initial, numIterations, ruleBinary) => {
  const iterations = [initial]
  for (let i = 0; i < numIterations; i++) {
    const newRow = getNextRow(iterations[i], ruleBinary)
    iterations.push(newRow)
  }
  return iterations
}

// Display the provided two-dimensional automaton in the canvas,
// using the generation delay as a buffer for displaying each iteration
const displayAutomaton = (iterations, genDelay) => {
  // Link to html canvas element
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  // Set the internal canvas width and height,
  // computed from the number of iterations
  canvas.width = 1920
  const cellSize = canvas.width/iterations[0].length
  canvas.height = Math.min(32000, Math.ceil(iterations.length * cellSize))

  // Determine whether the fill should be black or white depending on the user's colour theme
  const fillColour = window.getComputedStyle(document.body).color
  ctx.fillStyle = fillColour

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // For every iteration (i.e. row)
  iterations.forEach((iteration, iterationIdx) => {
    // Use generation delay/buffer timeout
    setTimeout(() => {
      // Display each cell if it is active
      iteration.forEach((cell, cellIdx) => {
        if (cell !== 1) return
        ctx.fillRect(cellSize*cellIdx, (iterationIdx*cellSize), cellSize, cellSize)
      })
    }, genDelay*iterationIdx)
  })
}

// Add submit event on generate button
const generateButton = document.querySelector('form')
generateButton.addEventListener('submit', (e) => {
  e.preventDefault()
  // Find each of the configuration values and assign a value from the input or use default
  const ruleElement = document.querySelector('#rule')
  const RULE = ruleElement.value !== undefined ? Number(ruleElement.value) : Number(ruleElement.placeholder)
  const widthElement = document.querySelector('#width')
  const AUTOMATON_WIDTH = Math.floor(widthElement.value/2) || Number(widthElement.placeholder)
  const numIterationElement = document.querySelector('#num-iterations')
  const NUM_ITERATIONS = Number(numIterationElement.value) || Number(numIterationElement.placeholder)
  const genDelayElement = document.querySelector('#gen-delay')
  const GEN_DELAY = genDelayElement.value !== undefined ? Number(genDelayElement.value) : Number(genDelayElement.placeholder)

  // Initial configuration
  const padding = Array.from({length: AUTOMATON_WIDTH}, () => '0').join('')
  const initial = `${padding}1${padding}`.split('').map(Number)
  const ruleBinary = RULE.toString(2).padStart(8, '0')

  // Generate the values of the automaton using the given configuration
  const iterations = generateAutomaton(initial, NUM_ITERATIONS, ruleBinary)
  // Display the automaton in the canvas
  displayAutomaton(iterations, GEN_DELAY)
})