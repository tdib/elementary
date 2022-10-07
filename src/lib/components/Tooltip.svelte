<script>
  import { X } from 'lucide-svelte'
  export let info
  export let closeFn

</script>

<div class='tooltip-container'>
  <button type='button' on:click={closeFn} title='Close tooltip'>
    <X />
  </button>
  <span>{info}</span>

</div>


<style lang='scss'>
  .tooltip-container {
    z-index: 1;
    position: absolute;
    background-color: var(--panel);
    max-width: 30em;
    border-radius: .5em;
    box-shadow: 2px 2px 2px var(--shadow);
    padding: 1em;
    padding-inline-end: 2em;

    button {
      position: absolute;
      top: 0;
      right: 0;
      padding: .5em;
      cursor: pointer;
      background: none;
      border: none;
    }
  }

</style>