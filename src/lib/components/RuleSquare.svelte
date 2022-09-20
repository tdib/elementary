<script>
  export let neighbourConfig = '000'

  // Set up toggle logic on click of active neighbour rule
  let neighbourRuleButton
  export let isActiveRule // 0 if off, 1 if on

  $: {
    if (neighbourRuleButton) {
      if (isActiveRule) { 
        neighbourRuleButton.classList.add('active')
      } else {
        neighbourRuleButton.classList.remove('active')
      }
    }
  }
</script>

<div class="rule-container">
  <!-- Display given configuration of cells -->
  {#each neighbourConfig as neighbourCell}
    {#if neighbourCell == 1}
      <div class="rule-cell active" />
    {:else }
      <div class="rule-cell" />
    {/if}
  {/each}

  <!-- Toggleable input -->
  <button
    title='Toggle this neighbourhood rule'
    class='rule-cell input'
    bind:this={neighbourRuleButton}
  />
</div>

<style>
  .rule-container {
    min-width: 7em;
    max-width: 10em;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25em;
  }

  .rule-cell {
    flex: 1;
    aspect-ratio: 1/1;
    background-color: var(--surface);
  }

  .rule-cell.active {
    background-color: var(--active);
    opacity: 0.6;
  }

  .rule-cell.input {
    border: 2px solid grey;
    border-radius: .15em;
    grid-column: 2;
    opacity: 1;
    cursor: pointer;
  }
</style>