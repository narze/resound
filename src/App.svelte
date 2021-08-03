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
  

  <ul class="sound">
    {#each audioArray as audio }
      <li>{audio.name} <Sound label={audio.name} filename={audio.name} /></li>
    {/each}
  </ul>

  <button on:click={addNewAudio}>Add New Audio</button>
  <button on:click={clearAudio}>Remove all audios</button>

  <footer>
    <a href="https://github.com/narze/remote-soundboard" target="_blank" rel="noreferrer">Github</a>
    |
    <a href="https://twitter.com/narze" target="_blank" rel="noneferrer">@narze</a>
    |
    <a href="https://watasalim.vercel.app" target="_blank" rel="noreferrer">วาทะสลิ่มสุดเจ๋ง</a>
    |
    <a href="https://tid-vs-truad.vercel.app" target="_blank" rel="noreferrer">ติด vs ตรวจ</a>
    |
    <a href="https://9speech.vercel.app" target="_blank" rel="noreferrer">9speech</a>
    |
    <a href="https://thailand-grand-opening.web.app" target="_blank" rel="noreferrer">ลุงจะใช้เวลาเท่าไหร่ในการเปิดประเทศ?</a>
  </footer>

  <script src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"></script>
  <script>
    kofiWidgetOverlay.draw("narze", {
      type: "floating-chat",
      "floating-chat.donateButton.text": "สนับสนุน ฿",
      "floating-chat.donateButton.background-color": "#f45d22",
      "floating-chat.donateButton.text-color": "#fff",
    });
  </script>
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
