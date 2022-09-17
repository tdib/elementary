// Given a one-dimensional grid of cells (a single iteration),
// calculate the next based on the provided rule
const getNextRow = (currRow, ruleBinary, randomNoise) => {
  return currRow.map((cell, idx) => {
    // Find left values of left and right neighbours
    const leftNeighbour = currRow[idx - 1] || 0
    const rightNeighbour = currRow[idx + 1] || 0
    // console.log(leftNeighbour, cell, rightNeighbour);

    // Convert neighbours to binary bits and decimal
    const neighbourhoodRuleBits = [leftNeighbour, cell, rightNeighbour].join('')
    const neighbourhoodRule = parseInt(neighbourhoodRuleBits, 2)
    // console.log(neighbourhoodRuleBits);

    // Determine the value of the cell in the next iteration based on the rule provided
    const newCellValue = parseInt(
      ruleBinary[ruleBinary.length - 1 - neighbourhoodRule]
    )

    // If we have a random noise set, have a chance to invert that cell,
    // otherwise return the new cell based on the provided rule
    // Note: randomNoise is a value between 0 and 100 (inclusive)
    if (randomNoise) {
      return Math.random() > randomNoise/100 ? newCellValue : (newCellValue + 1) % 2
    } else {
      return newCellValue
    }
  })
}

// Given an initial automaton state, number of iterations, and rule, generate
// the automaton and return a two-dimensional array containing this information
const generateAutomaton = (initial, numIterations, ruleBinary, randomNoise) => {
  const iterations = [initial]
  const centreIdx = Math.floor(iterations[0].length/2)
  let randomNumber = []

  for (let i = 0; i < numIterations; i++) {
    const newRow = getNextRow(iterations[i], ruleBinary, randomNoise)
    randomNumber.push(newRow[centreIdx])
    iterations.push(newRow)
  }

  const numRNGBits = Number(document.querySelector('#num-rng-bits').value) || numIterations
  const randomNumberBinary = randomNumber.join('').slice(0, numRNGBits)
  document.querySelector('#rng-binary').innerHTML = randomNumberBinary
  const randomNumberDecimal = parseInt(randomNumberBinary, 2)
  document.querySelector('#rng-decimal').innerHTML = randomNumberDecimal
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
  const cellSize = canvas.width / iterations[0].length
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
        ctx.fillRect(
          cellSize * cellIdx,
          iterationIdx * cellSize,
          cellSize,
          cellSize
        )
      })
    }, genDelay * iterationIdx)
  })
}

// Add submit event on generate button
const generateButton = document.querySelector('form')
generateButton.addEventListener('submit', e => {
  e.preventDefault()
  // Find each of the configuration values and assign a value from the input or use default
  const ruleElement = document.querySelector('#rule')
  const rule = 
    ruleElement.value !== undefined
      ? Number(ruleElement.value)
      : Number(ruleElement.placeholder)

  const widthElement = document.querySelector('#width')
  const automatonWidth =
    Math.floor(widthElement.value / 2) || Number(widthElement.placeholder)

  const numIterationsElement = document.querySelector('#num-iterations')
  const numIterations =
    Number(numIterationsElement.value) || Number(numIterationsElement.placeholder)

  const genDelayElement = document.querySelector('#gen-delay')
  const genDelay =
    genDelayElement.value !== undefined
      ? Number(genDelayElement.value)
      : Number(genDelayElement.placeholder)

  const initialSeedElement = document.querySelector('#initial-seed')
  const timestampInitialSeed = document.querySelector('#timestamp-initial-seed').checked
  const mathRandomInitialSeed = document.querySelector('#mathrandom-initial-seed').checked
  let initialSeed =
    initialSeedElement.value !== undefined
      ? Number(initialSeedElement.value)
      : Number(initialSeedElement.placeholder)
  if (timestampInitialSeed && mathRandomInitialSeed) {
    initialSeed = Math.floor(Math.random() * Number(new Date()))
  } else if (timestampInitialSeed) {
    initialSeed = Number(new Date())
  } else if (mathRandomInitialSeed) {
    if (initialSeed < 99999) initialSeed = Number(new Date())
    initialSeed = Math.floor(Math.random() * 2 * initialSeed)
  }
  initialSeedElement.value = initialSeed

  
  const randomNoiseElement = document.querySelector('#random-noise')
  const RANDOM_NOISE =
    randomNoiseElement.value !== undefined
      ? Number(randomNoiseElement.value)
      : Number(randomNoiseElement.placeholder)

  // Initial configuration
  const padding = Array.from({ length: automatonWidth }, () => '0').join('')
  const initial = `${padding}${initialSeed.toString(2)}${padding}`.split('').map(Number)
  const ruleBinary = rule.toString(2).padStart(8, '0')

  // Generate the values of the automaton using the given configuration
  const iterations = generateAutomaton(initial, numIterations, ruleBinary, RANDOM_NOISE)
  // Display the automaton in the canvas
  displayAutomaton(iterations, genDelay)
})
