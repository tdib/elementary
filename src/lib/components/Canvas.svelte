<script>
  import { getNextRow } from '$lib/scripts/automatonUtil.js'
  export let infiniscroll
  export let ruleBinary
  export let randomNoisePercent
  export let automatonLoading
  let currAnimation

  export function cancelGeneration() {
    automatonLoading = false
    cancelAnimationFrame(currAnimation)
  }

  export function displayAutomaton(iterations, genDelay) {
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
    cancelAnimationFrame(currAnimation)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dispatch each row to either generate immediately or be queued for rendering
    let drawQueue = []
    iterations.forEach((iteration, iterationIdx) => {
      if (genDelay === 0) return displayIteration(iteration, iterationIdx)
      drawQueue.push(iteration)
    })

    let lastTime = 0
    let iterationIdx = 0
    drawLoop()

    function drawLoop(timestamp) {
      // Infiniscroll is activated and the end of the iterations have been reached
      if (infiniscroll && iterationIdx >= iterations.length) {
        if (timestamp > lastTime + genDelay) {
          // Remove the first iteration and generate a new one at the end, then display instantly
          iterations = iterations.slice(1, iterations.length)
          iterations.push(getNextRow(iterations[iterations.length-1], ruleBinary, randomNoisePercent, borderCellValue))
          displayAutomaton(iterations, 0)
        }
      // Execution as normal - either infiniscroll is disabled or the specified number
      // of durations has not yet been reached
      } else {
        // We have nothing left to render - return so we don't infinitely recurse
        if (!drawQueue.length) return
        // Assuming the generation delay has passed, display the next iteration
        if (timestamp > lastTime + genDelay) {
          displayIteration(drawQueue.shift(), iterationIdx)
          iterationIdx++
          lastTime = timestamp
        }
      }
      currAnimation = requestAnimationFrame(drawLoop)
    }

    // Given a row/iteration and its index (depth), display it on the canvas
    function displayIteration(iteration, iterationIdx) {
      // Display each cell if it is active
      iteration.forEach((cell, cellIdx) => {
        if (cell !== 1) return
        ctx.fillRect(cellSize*cellIdx, (iterationIdx*cellSize), cellSize, cellSize)
      })
      
      // Once we reach the final iteration, cancel loading
      // * This isn't setting the loading to false for some reason (but it is being reached)
      if (!infiniscroll && iterationIdx === iterations.length-1) {
        automatonLoading = false
      }
    }
  }

</script>

<div class="canvas-container">
  <canvas></canvas>
</div>

<style lang='scss'>
  .canvas-container {
    width: 100%;
    height: 50em;
    overflow: auto;
    border-radius: .25em;
    background-color: var(--surface);
  
    canvas {
      width: 100%;
      box-sizing: border-box;
    }
  }
  
</style>