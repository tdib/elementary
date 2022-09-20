// Given a one-dimensional grid of cells (a single iteration),
// calculate the next based on the provided rule
export function getNextRow(currRow, ruleBinary, randomNoisePercent) {
  return currRow.map((cell, idx) => {
    // Find left values of left and right neighbours
    const leftNeighbour = currRow[idx - 1] || 0
    const rightNeighbour = currRow[idx + 1] || 0

    // Convert neighbours to binary bits and decimal
    const neighbourhoodRuleBits = [leftNeighbour, cell, rightNeighbour].join('')
    const neighbourhoodRule = parseInt(neighbourhoodRuleBits, 2)

    // Determine the value of the cell in the next iteration based on the rule provided
    const newCellValue = parseInt(
      ruleBinary[ruleBinary.length - 1 - neighbourhoodRule]
    )

    // If we have a random noise set, have a chance to invert that cell,
    // otherwise return the new cell based on the provided rule
    // Note: randomNoise is a value between 0 and 100 (inclusive)
    if (randomNoisePercent) {
      return Math.random() > randomNoisePercent/100 ? newCellValue : (newCellValue + 1) % 2
    } else {
      return newCellValue
    }
  })
}

// Given an initial automaton state, number of iterations, and rule, generate
// the automaton and return a two-dimensional array containing this information
export function generateAutomaton(initial, numIterations, ruleBinary, randomNoisePercent) {
  const iterations = [initial]

  for (let i = 0; i < numIterations-1; i++) {
    const newRow = getNextRow(iterations[i], ruleBinary, randomNoisePercent)
    iterations.push(newRow)
  }

  return iterations
}

// Given the generated rows of the automaton, calculate a binary number of the central
// row, and return this number as well as a decimal conversion
export function getRandomNumber(iterations, numRNGBits) {
  if (numRNGBits > iterations.length) numRNGBits = iterations.length
  const centreIdx = Math.floor(iterations[0].length/2)
  let randomNumber = []

  for (let i = 0; i < numRNGBits; i++) {
    randomNumber.push(iterations[i][centreIdx])
  }

  const randomNumberBinary = randomNumber.join('').slice(0, numRNGBits)
  const randomNumberDecimal = parseInt(randomNumberBinary, 2)

  return [randomNumberBinary, randomNumberDecimal]
}
