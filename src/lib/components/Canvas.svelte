<script>
  let currAnimation

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

    let drawQueue = []
    let lastTime = 0
    let iterationIdx = 0
    iterations.forEach((iteration) => {
      if (genDelay === 0) return displayIteration(iteration)
      drawQueue.push(iteration)
    })

    // Given a row/iteration and its index (depth), display it on the canvas
    function displayIteration(iteration, iterationIdx) {
      // Display each cell if it is active
      iteration.forEach((cell, cellIdx) => {
        if (cell !== 1) return
        ctx.fillRect(cellSize*cellIdx, (iterationIdx*cellSize), cellSize, cellSize)
      })
    }

    function drawLoop(timestamp) {
      if (!drawQueue.length) return
      if (drawQueue.length && timestamp > lastTime + genDelay) {
        displayIteration(drawQueue.shift(), iterationIdx)
        iterationIdx++
        lastTime = timestamp
      }
      currAnimation = requestAnimationFrame(drawLoop)
    }
    drawLoop()
  }




  // Display the provided two-dimensional automaton in the canvas,
  // using the generation delay as a buffer for displaying each iteration
  export function displayomaton (iterations, genDelay) {
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
      // setTimeout(() => {
        // Display each cell if it is active
        iteration.forEach((cell, cellIdx) => {
          if (cell !== 1) return
          ctx.fillRect(cellSize*cellIdx, (iterationIdx*cellSize), cellSize, cellSize)
        })
      // }, genDelay*iterationIdx)
    })


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