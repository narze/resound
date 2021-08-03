<script lang="ts">
  import type { Audio } from "./lib/doc"
  import { sharedAudios, playQueues } from './lib/doc';
  import Sound from "./lib/Sound.svelte"

  function addNewAudio() {
    const name = `${~~(Math.random() * 11)}`

    sharedAudios.push([{name}]);
  }

  function clearAudio() {
    sharedAudios.delete(0, sharedAudios.length)
    playQueues.delete(0, playQueues.length)
  }

  let audioArray: Audio[] = []

  sharedAudios.observe(() => {
    audioArray = Array.from(sharedAudios)
  })
</script>

<main>
  <h1>Remote Soundboard</h1>

  <ul>
    {#each audioArray as audio }
      <li>{audio.name} <Sound label={audio.name} filename={audio.name} /></li>
    {/each}
  </ul>

  <button on:click={addNewAudio}>Add New Audio</button>
  <button on:click={clearAudio}>Remove all audios</button>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
