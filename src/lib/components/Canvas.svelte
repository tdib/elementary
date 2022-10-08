<script>
  import { getNextRow } from '$lib/scripts/automatonUtil.js'
  import { onMount } from 'svelte'
  export let infiniscroll
  export let ruleBinary
  export let randomNoisePercent
  export let automatonLoading
  export let borderCellValue
  let currAnimation
  let canvas
  let ctx

  onMount(() => {
    // Link to html canvas element
    ctx = canvas.getContext('2d')

    // Set the internal canvas width
    canvas.width = 1920
  })

  export function cancelGeneration() {
    automatonLoading = false
    cancelAnimationFrame(currAnimation)
  }

  export function displayAutomaton(generations, genDelay) {
    // Compute and set the canvas height from the number of generations
    const cellSize = canvas.width/generations[0].length
    canvas.height = Math.min(32000, Math.ceil(generations.length * cellSize))

    // Determine whether the fill should be black or white depending on the user's colour theme
    const fillColour = window.getComputedStyle(document.body).color
    ctx.fillStyle = fillColour

    // Clear the canvas
    cancelAnimationFrame(currAnimation)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dispatch each row to either generate immediately or be queued for rendering
    let drawQueue = []
    generations.forEach((generation, generationIdx) => {
      if (genDelay === 0) return displayGeneration(generation, generationIdx)
      drawQueue.push(generation)
    })

    let lastTime = 0
    let generationIdx = 0
    drawLoop()

    function drawLoop(timestamp) {
      // Infiniscroll is activated and the end of the generations have been reached
      if (infiniscroll && generationIdx >= generations.length) {
        if (timestamp > lastTime + genDelay) {
          // Remove the first generation and generate a new one at the end, then display instantly
          generations = generations.slice(1, generations.length)
          generations.push(getNextRow(generations[generations.length-1], ruleBinary, randomNoisePercent, borderCellValue))
          displayAutomaton(generations, 0)
        }
      // Execution as normal - either infiniscroll is disabled or the specified number
      // of durations has not yet been reached
      } else {
        // We have nothing left to render - return so we don't infinitely recurse
        if (!drawQueue.length) return
        // Assuming the generation delay has passed, display the next generation
        if (timestamp > lastTime + genDelay) {
          let delayedGenerations = 1
          while (timestamp > lastTime + delayedGenerations*genDelay) {
            displayGeneration(drawQueue.shift(), generationIdx)
            generationIdx++
            lastTime = timestamp

            delayedGenerations++
          }
        }
      }
      currAnimation = requestAnimationFrame(drawLoop)
    }

    // Given a row/generation and its index (depth), display it on the canvas
    function displayGeneration(generation, generationIdx) {
      // Display each cell if it is active
      generation.forEach((cell, cellIdx) => {
        if (cell !== 1) return
        ctx.fillRect(cellSize*cellIdx, (generationIdx*cellSize), cellSize, cellSize)
      })
      
      // Once we reach the final generation, cancel loading
      // * This isn't setting the loading to false for some reason (but it is being reached)
      if (!infiniscroll && generationIdx === generations.length-1) {
        automatonLoading = false
      }
    }
  }

</script>

<div class='canvas-container'>
  <canvas bind:this={canvas}></canvas>
  <!-- <canvas></canvas> -->
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
      display: block;
    }
  }
  
</style>