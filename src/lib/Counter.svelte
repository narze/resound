<script lang="ts">
  export let count: number = 0

  const increment = () => {
    count += 1
  }

  const decrement = () => {
    count -= 1
  }

  const reset = () => {
    count = 0
  }
</script>

<button on:click={increment}>+</button>
<button on:click={decrement}>-</button>
<h1 data-testId="counter-value" class="text-6xl">{count}</h1>
<button on:click={reset}>Reset</button>

<style>
  button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
