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


  function uploadAudio(e: any) {
    let input = e.target as HTMLInputElement

    if(input.files[0].type.indexOf('audio/') !== 0){
      alert('Please upload audio file');
      return;
    }
    const reader = new FileReader();

    reader.onload = function(){
      const str = this.result as string;
      // this is a string, so you can store it in localStorage, even if it's really not a good idea
      console.log(str);
      const aud = new Audio(str);
      aud.play();
    };

    reader.readAsDataURL(input.files[0]);
  }
</script>

<main>
  <h1>Remote Soundboard</h1>

  <ul class="sound">
    {#each audioArray as audio }
      <li>{audio.name} <Sound label={audio.name} filename={audio.name} /></li>
    {/each}
  </ul>

  <button on:click={addNewAudio}>Add New Audio</button>
  <button on:click={clearAudio}>Remove all audios</button>

  <div>
    <input type="file" id="audio" on:change={uploadAudio} />Upload Audio
  </div>

  <footer>
    <a href="https://github.com/narze/remote-soundboard" target="_blank" rel="noreferrer">Github</a>
  </footer>
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
  button{
    background-color: #ff3e00; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  }
  footer{color:black;position:fixed;right:10px;bottom:10px;font-size:1rem}
  a{color: black;text-decoration: none;}
  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }


</style>
