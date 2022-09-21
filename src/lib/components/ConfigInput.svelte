<script>
  import { Info } from 'lucide-svelte'
  import Tooltip from './Tooltip.svelte'

  export let info = ''
  let infoOpen = false
  export let name = ''
  let nameProcessed = name.toLowerCase().replace(' ', '-')
  export let inputProps
  export let value = inputProps?.value
  export let inputOverride = false
</script>

<div class='field-container'>
  <label for={nameProcessed}>{name}</label>
  <div class='info-group'>
    {#if info}
      <button class='info-button' type='button' title='More info about {name.toLowerCase()}' on:click={() => infoOpen = !infoOpen}>
        <Info size='1.25em'/>
      </button>
      {#if infoOpen}
        <Tooltip {info} closeFn={() => infoOpen = false} />
      {/if}
    {/if}
  </div>
  <div class='input-group'>
    <slot name='extra-icon'/>
    {#if inputOverride}
      <slot name='input-override' />
    {:else}
      {#if inputProps.type === 'checkbox'}
        <input id={nameProcessed} {...inputProps} type='checkbox' bind:checked={value}>
      {:else}
        <input id={nameProcessed} {...inputProps} bind:value={value}>
      {/if}
    {/if}
  </div>
</div>

<style lang="scss">
  .field-container {
    display: flex;
    gap: .5em;
    align-items: center;

    .info-group {
      gap: .25em;

      .info-button {
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        display: flex;
        margin-right: 1em;
      }
    }

    .input-group {
      display: flex;
      align-items: center;
      gap: .25em;
      margin-inline-start: auto;
    }
  }

  input[type='number'] {
    border-radius: .25em;
    outline: none;
    border: none;
    padding: .25em;
    font-size: 1em;
    height: 1.5em;
    margin-inline-start: auto;
    background-color: var(--surface);
    width: 5em;
  }

  input[type='checkbox'] {
    height: 1.75em;
    width: 1.75em;
  }

</style>