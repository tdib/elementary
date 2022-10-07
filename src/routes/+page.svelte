<script>
  import RuleSquare from '$lib/components/RuleSquare.svelte'
  import ConfigInput from '$lib/components/ConfigInput.svelte'
  import Canvas from '$lib/components/Canvas.svelte'
  import { Dices } from 'lucide-svelte'
  import getRandomRule from '$lib/scripts/randomRule.js'
  import { onMount } from 'svelte'
  import { generateAutomaton, getRandomNumber } from '$lib/scripts/automatonUtil.js'
  import classification from '$lib/misc/classification.json'

  let rule = getRandomRule()
  let width = 300
  let numGenerationSteps = 150
  let genDelay = 5

  let initialSeed = 1
  let mathRandomInitialSeed = false
  let completeRandomInitialSeed = false
  let randomNoisePercent = 0
  let numRNGBits = 16
  let borderCellValue = 'off'
  let infiniscroll = false

  let ruleClassification = '-'
  let flip
  let invert
  let rngBinary
  let rngDecimal

  let automatonLoading = false

  let canvas


  // $: {
  //   ruleClassification = 'Unknown'
  //   for (let [classification, classificationRules] of Object.entries(classification.classes)) {
  //     if (classificationRules.includes(Number(rule))) {
  //       ruleClassification = classification
  //       break
  //     }
  //   }
  //   if (ruleClassification === "Unknown") console.log('could not find')
  // }

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


  function generate() {
    // #HACK: loading is not set to false when genDelay is 0, so this is the fix
    if (Number(genDelay) !== 0)
      automatonLoading = true
    
    // Initial configuration
    const ruleBinary = Number(rule).toString(2).padStart(8, '0')
    const initialSeedBinary = Number(initialSeed).toString(2)
    let padding
    let initial = []
    if (completeRandomInitialSeed) {
      for (let i = 0; i < width; i++) {
        initial.push(Math.random() > 0.5 ? 1 : 0)
      }
    } else {
      padding = Array.from({length: Math.floor(width/2)}, () => '0').join('')
      initial = `${padding}${initialSeedBinary}${padding}`.split('').map(Number)
    }

    ruleClassification = 'Unknown'
    for (let [classificationName, classificationRules] of Object.entries(classification.classes)) {
      if (classificationRules.includes(Number(rule))) {
        ruleClassification = classificationName
        break
      }
    }

    flip = classification.flips[rule]
    invert = classification.inverts[rule]

    if (mathRandomInitialSeed) {
      if (initialSeed < 8) initialSeed = 8
      const max = Math.floor(initialSeed * 1.25)
      const min = Math.floor(initialSeed * 0.8)
      initialSeed = Math.floor(Math.random() * (max - min + 1)) + min
    }

    // Generate the values of the automaton using the given configuration
    const generations = generateAutomaton(initial, numGenerationSteps, ruleBinary, randomNoisePercent, borderCellValue)
    const randomNumbers = getRandomNumber(generations, numRNGBits)
    rngBinary = randomNumbers[0]
    rngDecimal = randomNumbers[1]

    // Display the automaton in the canvas
    canvas.displayAutomaton(generations, Number(genDelay), borderCellValue)
  }




</script>

<main>
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
    <div class='config-set'>
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
        on:enterPressed={generate}
      >
        <button type='button' title='Randomise rule' slot='extra-icon' on:click={() => {
          rule = getRandomRule()
          if (!automatonLoading || !infiniscroll) generate()
        }}>
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
        on:enterPressed={generate}
      />

      <ConfigInput
        name='Generation steps'
        inputProps={{
          type: 'number',
          min: 1,
          placeholder: 150,
        }}
        info='The number of generations/rows that will be stacked on top of one another (i.e. vertical height).
        Increasing this will allow you to see more of the pattern, but will increase computation. A good number
        for this is approximately half of the width.'
        bind:value={numGenerationSteps}
        on:enterPressed={generate}
      />

      <ConfigInput
        name='Generation delay'
        inputProps={{
          type: 'number',
          min: 0,
          placeholder: 5,
        }}
        info='The buffer time in milliseconds between the generation of each generation. A value of 0 will mean
        (near) instant generation, while a value of 5 will slowly display each generation one by one in a
        cascading effect. Note: this is a purely aesthetic feature, and will not affect the generation of
        the automaton.'
        bind:value={genDelay}
        on:enterPressed={generate}
      />
    </div>

    <div class='config-set'>
      <h2>Experimental configuration</h2>
      <ConfigInput
        name='Initial seed'
        inputProps={{
          type: 'number',
          min: 1,
          placeholder: 1,
          disabled: completeRandomInitialSeed,
        }}
        info='Determines the configuration of bits in the first row. The default value is 1, a single
        active cell.'
        bind:value={initialSeed}
        on:enterPressed={generate}
      />

      <ConfigInput
        name='Math.random initial seed'
        inputProps={{
          type: 'checkbox'
        }}
        info='Randomises initial seed by multiplying it by a value generated by Math.random(). The larger
        your initial seed is, the larger the effect of this randomness will become. Note: this multiplication
        will take place after the generate button is pressed.'
        bind:value={mathRandomInitialSeed}
      />

      <ConfigInput
        name='Random initial seed'
        inputProps={{
          type: 'checkbox'
        }}
        info='Randomises initial seed by completely randomising the entire width of the initial generation row.'
        bind:value={completeRandomInitialSeed}
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
        info='This percentage will be used as the chance to invert the generation of any given bit.
        For example, setting this to 0.005% will randomly change the rule of 0.005% of the generated cells.'
        bind:value={randomNoisePercent}
        on:enterPressed={generate}
      />

      <ConfigInput
        name='Number of RNG bits'
        inputProps={{
          type: 'number',
          min: 1,
          max: 32,
          placeholder: 0,
        }}
        info='This number determines the number of bits used to calculate a random number from the automaton.
        A value of 8 means the first eight bits of the central column will be used. If the value of this option
        is larger than the number of generation steps, then it will only consider the number of generation steps.
        This option is best paired with a randomised initial seed.'
        bind:value={numRNGBits}
        on:enterPressed={generate}
      />

      <ConfigInput
        name='Border cell value'
        inputOverride={true}
        info='Determines whether the cells at the bounds of the selected width are on or off.
        "Off" will treat the edges as though the cells are off. "On" will treat them as though
        they are on. "Random" will randomly select a value between on or off on every generation.'
      >
        <select bind:value={borderCellValue} id='border-cell-value' slot='input-override'>
          <option value='off'>Off</option>
          <option value='on'>On</option>
          <option value='random'>Random</option>
        </select>
      </ConfigInput>

      <ConfigInput
        name='Infiniscroll'
        inputProps={{
          type: 'checkbox',
        }}
        info='This will endlessly generate the automata corresponding to the selected rule. This one is fun.'
        bind:value={infiniscroll}
      />


    </div>

    {#if automatonLoading}
      <button type='button' on:click={() => canvas.cancelGeneration()}>Cancel generation</button>
    {:else}
      <button type='button' disabled={!rule || !width || !numGenerationSteps} on:click={generate}>Generate!</button>
    {/if}


    <div class='automaton-info'>
      <!-- Display the generated automaton's class -->
      <span>Class: {ruleClassification}</span>

      <!-- Display (if any) the flipped automaton, and allow user to click on label to generate it -->
      <span>
        Flip:
        <button class='clickable-text' type='button'
          disabled={!flip} title={flip && 'Generate flipped automaton'}
          on:click={() => {
            rule = flip
            generate()
          }}>{flip ?? '-'}</button>
      </span>
      
      <!-- Display (if any) the inverted automaton, and allow user to click on label to generate it -->
      <span>
        Invert:
        <button class='clickable-text' type='button'
          disabled={!invert} title={invert && 'Generate inverted automaton'}
          on:click={() => {
            rule = invert
            generate()
          }}>{invert ?? '-'}</button>
      </span>
    </div>

    <!-- Display randomly generated numbers -->
    <div class='automaton-info'>
      {#if rngBinary || rngDecimal}
        <span>Generated binary number: {rngBinary}</span>
        <span>Generated decimal number: {rngDecimal}</span>
      {/if}
    </div>

    <Canvas
      bind:this={canvas}
      {infiniscroll}
      {ruleBinary}
      {randomNoisePercent}
      bind:automatonLoading={automatonLoading}
    />
  </form>
</main>

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

    > button:not(.clickable-text) {
      height: 3em;
      width: 100%;
    }

    .automaton-info {
      width: 100%;
      display: flex;
      justify-content: space-evenly;

      span {
        font-size: 1.25em;
        .clickable-text {
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          font-size: inherit;

        }
          :disabled {
            cursor: default;
            text-decoration: none;
            color: var(--active);
          }
      }
    }


  }


</style>