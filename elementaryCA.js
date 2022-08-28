// Given a one-dimensional grid of cells, calculate the next based on the provided rule
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

const generateAutomaton = (initial, numIterations, ruleBinary) => {
  const iterations = [initial]
  for (let i = 0; i < numIterations; i++) {
    const newRow = getNextRow(iterations[i], ruleBinary)
    iterations.push(newRow)
  }
  return iterations
}

const displayAutomaton = (iterations, genDelay) => {
  const canvas = document.querySelector('#canvas')
  canvas.height = 1080
  canvas.width = 1920
  const ctx = canvas.getContext('2d')
  const fillColour = window.getComputedStyle(document.body).color

  const cellSize = canvas.width/iterations[0].length
  canvas.height = Math.min(32000, Math.ceil(iterations.length * cellSize))
  ctx.fillStyle = fillColour
  ctx.clearRect(0, 0, canvas.width, canvas.height)
    iterations.forEach((iteration, iterationIdx) => {
    setTimeout(() => {
      iteration.forEach((cell, cellIdx) => {
        if (cell !== 1) return
        ctx.fillRect(cellSize*cellIdx, iterationIdx*cellSize, cellSize, cellSize)
      })
    }, genDelay*iterationIdx)
  })
}

const generateButton = document.querySelector('form')
generateButton.addEventListener('submit', (e) => {
  e.preventDefault()
  const RULE = Number(document.querySelector('#rule').value) || 90
  const NUM_ITERATIONS = document.querySelector('#num-iterations').value || 500
  const AUTOMATON_WIDTH = document.querySelector('#width').value || 500
  const GEN_DELAY = document.querySelector('#gen-delay').value || 5

  // Initial configuration
  const padding = Array.from({length: AUTOMATON_WIDTH}, () => '0').join('')
  const initial = `${padding}1${padding}`.split('').map(Number)
  const ruleBinary = RULE.toString(2).padStart(8, '0')

  const iterations = generateAutomaton(initial, NUM_ITERATIONS, ruleBinary)
  displayAutomaton(iterations, GEN_DELAY)
})