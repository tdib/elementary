<script>
  import RuleSquare from "$lib/components/RuleSquare.svelte"
  import ConfigInput from "$lib/components/ConfigInput.svelte"
  import { Dices } from 'lucide-svelte'
  import getRandomRule from '$lib/scripts/randomRule.js'
  import { onMount } from "svelte"

  let rule = getRandomRule()
  let width = 30
  let numIterations = 150
  let genDelay = 5

  let initialSeed = 1
  let timestampInitialSeed = false
  let mathRandomInitialSeed = false
  let randomNoisePercent = 0
  let numRNGBits = 16

  onMount(() => {
    const inputs = document.querySelectorAll('.input')

    // Update the rule input based on the input squares
    inputs.forEach((input) => {
      input.addEventListener('click', () => {
        input.classList.toggle('active')
        let ruleBinaryStr = ''

        inputs.forEach((input) => {
          // Convert active/inactive cells to binary/decimal
          ruleBinaryStr += Number(input.classList.contains('active'))
        })

        // Update rule input field according to selected cells
        rule = parseInt(ruleBinaryStr, 2)
      })
    })
  })

  // Create list of strings indicating configurations of neighbours
  // [111, 110, 101, ...]
  const neighbourConfigs = [...Array(8).keys()].map((num) => num.toString(2).padStart(3, '0')).reverse()

  // Based on the rule in the input section, calculate the binary value
  let ruleBinary
  $: ruleBinary = Number(rule).toString(2).padStart(8, '0').split('').map((x) => Number(x))


</script>

<h1>Elementary Cellular Automata</h1>
<p>This is a simple implementation of Wolfram's Elementary Automata. Simply plug in the values you would like to experiment with, and either click generate, or press enter.</p>
<p>
  The grid cells below are a visual representation of the chosen rule. This rule may be updated by either clicking on the cells below the rows of three, or by simply typing it into the input field.
  Refreshing the page will randomly set a new rule.
</p>

<!-- Render visual rule blocks -->
<div class='ruleset-container'>
  {#each neighbourConfigs as neighbourConfig, idx}
    <RuleSquare neighbourConfig={neighbourConfig}
      bind:isActiveRule={ruleBinary[idx]}
    />
  {/each}
</div>

<form>
  <div class="config-set">
    <h2>Main configuration</h2>
    <ConfigInput
      name='Rule'
      inputProps={{
        type: 'number',
        min: 0,
        max: 255,
        placeholder: 167,
      }}
      info='Determines the neighbourhood update rules. A visual representation of this rule will be reflected
      by the squares above the configuration. Alternatively, you may click on directly on these squares to
      update the rule. Updating the rule will affect the generation of the automaton.'
      bind:value={rule}
    >
      <button type='button' title='Randomise rule' on:click={() => rule = getRandomRule()}>
        <Dices />
      </button>
    </ConfigInput>

    <ConfigInput
      name='Width'
      inputProps={{
        type: 'number',
        min: 3,
        placeholder: 300,
      }}
      info='The number of cells generated horizontally. A larger number means the cells will become
      smaller, and will require more computation. Note: if a pattern reaches the edge of the defined
      width, the automaton is bounded, and will treat the edges as inactive/dead cells.'
      bind:value={width}
    />

    <ConfigInput
      name='Number of iterations'
      inputProps={{
        type: 'number',
        min: 1,
        placeholder: 150,
      }}
      info='The number of iterations/rows that will be stacked on top of one another (i.e. vertical height).
      Increasing this will allow you to see more of the pattern, but will increase computation. A good number
      for this is approximately half of the width.'
      bind:value={numIterations}
    />

    <ConfigInput
      name='Generation delay'
      inputProps={{
        type: 'number',
        min: 0,
        placeholder: 5,
      }}
      info='The buffer time between the generation of each iteration. A value of 0 will mean (near) instant
      generation, while a value of 5 will slowly display each iteration one by one in a cascading effect.
      Note: this is a purely aesthetic feature, and will not affect the generation of the automaton.'
      bind:value={genDelay}
    />
  </div>

  <div class="config-set">
    <h2>Experimental configuration</h2>
    <ConfigInput
      name='Initial seed'
      inputProps={{
        type: 'number',
        min: 1,
        placeholder: 1,
      }}
      bind:value={initialSeed}
    />

    <ConfigInput
      name='Timestamp initial seed'
      inputProps={{
        type: 'checkbox',
      }}
      bind:value={timestampInitialSeed}
    />

    <ConfigInput
      name='Math.random initial seed'
      inputProps={{
        type: 'checkbox'
      }}
      bind:value={mathRandomInitialSeed}
    />

    <ConfigInput
      name='Random noise (%)'
      inputProps={{
        type: 'number',
        min: 0,
        max: 100,
        step: 0.0005,
        placeholder: 0,
      }}
      bind:value={randomNoisePercent}
    />

    <ConfigInput
      name='Number of RNG bits'
      inputProps={{
        type: 'number',
        min: 0,
        placeholder: 0,
      }}
      bind:value={numRNGBits}
    />
  </div>

  <button type='button' on:click={() => {
    console.log({
      rule,
      width,
      numIterations,
      genDelay,
      initialSeed,
      timestampInitialSeed,
      mathRandomInitialSeed,
      randomNoisePercent,
      numRNGBits,
    })
  }}>Generate!</button>
</form>


<!-- random binary generated -->
<!-- random decimal generated -->

<style lang='scss'>
  .ruleset-container {
    display: flex;
    justify-content: center;
    gap: 1.5em;
    flex-wrap: wrap;
    margin-block-start: 5em;
  }

  form {
    display: flex;
    flex-wrap: wrap;
    column-gap: 5em;
    row-gap: 2em;
    justify-content: center;
    margin-block: 3em;
    margin-inline: auto;

    .config-set {
      display: grid;
      gap: 1em;
      max-width: fit-content;
      align-self: start;
      justify-self: center;

      button {
        width: auto;
        background: none;
        border: none;
        cursor: pointer;
      }
    } 

    > button {
      height: 3em;
      width: 100%;
    }

  }


</style>