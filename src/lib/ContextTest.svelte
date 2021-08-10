<script>
  import { setContext } from "svelte"

  export let Component
  export let contextKey
  export let contextValue
  export let componentProps = []

  setContext(contextKey, contextValue)
</script>

<svelte:component this={Component} {...componentProps} />
