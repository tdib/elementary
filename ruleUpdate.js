const ruleElement = document.querySelector('#rule')
const inputs = document.querySelectorAll('.input')

// Update the input squares based on an input change
const updateRuleSquares = () => {
  // Convert the decimal input to binary
  const ruleBinary = Number(ruleElement.value).toString(2).padStart(8, '0')
  // For every binary digit, set the active class on the respective input square
  for (let i = 0; i < ruleBinary.length; i++) {
    inputs[i].classList.remove('active')
    if (ruleBinary[i] === '1') { 
      inputs[i].classList.add('active')
    }
  }
}

// Update the rule input based on the input squares
const updateRuleInput = (inputToUpdate) => {
  // Toggle colour and class of input clicked
  inputToUpdate.classList.toggle('active')

  // Convert active/inactive cells to binary/decimal
  let ruleBinaryStr = ''
  inputs.forEach((input) => {
    ruleBinaryStr += Number(input.classList.contains('active'))
  })
  const rule = parseInt(ruleBinaryStr, 2)

  // Update rule input field according to selected cells
  ruleElement.value = rule
}

// Allow each input square to perform the necessary operation on click
inputs.forEach((input) => {
  input.addEventListener('click', () => updateRuleInput(input))
})
// Update the input squares every time the rule input is changed
ruleElement.addEventListener('input', updateRuleSquares)
// Initial input square update
updateRuleSquares()
