// Given a one-dimensional grid of cells (a single generation),
// calculate the next based on the provided rule
export function getNextRow(currRow, ruleBinary, randomNoisePercent, borderCellValue) {
  let leftBorderCellValue
  let rightBorderCellValue

  if (borderCellValue === 'wrap') {
    leftBorderCellValue = currRow[currRow.length-1]
    rightBorderCellValue = currRow[0]
  } else {
    if (borderCellValue === 'random') borderCellValue = Number(Math.random() > 0.5)
    else if (borderCellValue === 'on') borderCellValue = 1
    else if (borderCellValue ==='off') borderCellValue = 0

    leftBorderCellValue = borderCellValue
    rightBorderCellValue = borderCellValue
  } 
  return currRow.map((cell, idx) => {
    // Find left values of left and right neighbours
    const leftNeighbour = currRow[idx - 1] ?? leftBorderCellValue
    const rightNeighbour = currRow[idx + 1] ?? rightBorderCellValue

    // Convert neighbours to binary bits and decimal
    const neighbourhoodRuleBits = [leftNeighbour, cell, rightNeighbour].join('')
    const neighbourhoodRule = parseInt(neighbourhoodRuleBits, 2)

    // Determine the value of the cell in the next generation based on the rule provided
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

// Given an initial automaton state, number of generations, and rule, generate
// the automaton and return a two-dimensional array containing this information
export function generateAutomaton(initial, numGenerations, ruleBinary, randomNoisePercent, borderCellValue) {
  const generations = [initial]

  for (let i = 0; i < numGenerations-1; i++) {
    const newRow = getNextRow(generations[i], ruleBinary, randomNoisePercent, borderCellValue)
    generations.push(newRow)
  }

  return generations
}

// Given the generated rows of the automaton, calculate a binary number of the central
// row, and return this number as well as a decimal conversion
export function getRandomNumber(generations, numRNGBits) {
  if (numRNGBits > generations.length) numRNGBits = generations.length
  const centreIdx = Math.floor(generations[0].length/2)
  let randomNumber = []

  for (let i = 0; i < numRNGBits; i++) {
    randomNumber.push(generations[i][centreIdx])
  }

  const randomNumberBinary = randomNumber.join('').slice(0, numRNGBits)
  const randomNumberDecimal = parseInt(randomNumberBinary, 2)

  return [randomNumberBinary, randomNumberDecimal]
}

// Given an asymmetric rule, find its flipped variant and return the number correlating to that rule
export function getComplementRule(rule) {
  const DOUBLE_LEFT = 1
  const DOUBLE_RIGHT = 4
  const SINGLE_LEFT = 3
  const SINGLE_RIGHT = 6

  function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }

  let ruleBinary = Number(rule).toString(2).padStart(8, '0')

  // Determine whether there is an asymmetric portion of the rule
  const asymmetricDouble = ruleBinary[DOUBLE_LEFT] ^ ruleBinary[DOUBLE_RIGHT]
  const asymmetricSingle = ruleBinary[SINGLE_LEFT] ^ ruleBinary[SINGLE_RIGHT]

  // If applicable, invert 110 and 011 rules
  if (asymmetricDouble) {
    ruleBinary = setCharAt(ruleBinary, DOUBLE_LEFT, Number(!Number(ruleBinary[DOUBLE_LEFT])))
    ruleBinary = setCharAt(ruleBinary, DOUBLE_RIGHT, Number(!Number(ruleBinary[DOUBLE_RIGHT])))
  }

  // If applicable, invert 100 and 001 rule
  if (asymmetricSingle) {
    ruleBinary = setCharAt(ruleBinary, SINGLE_LEFT, Number(!Number(ruleBinary[SINGLE_LEFT])))
    ruleBinary = setCharAt(ruleBinary, SINGLE_RIGHT, Number(!Number(ruleBinary[SINGLE_RIGHT])))
  }

  // Convert binary back to an int and return
  let complementRule = parseInt(ruleBinary, 2)
  // Only return complement if there was change
  return complementRule === Number(rule) ? null : complementRule
}
