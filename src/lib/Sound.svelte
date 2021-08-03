<script lang="ts">
  import {playQueues} from "./doc"

  export let label
  export let filename

  const play = () => {
    let sound = document.getElementById(filename) as HTMLAudioElement

    sound.pause()
    sound.currentTime = 0
    sound.play()
  }

  const addToQueue = (filename: string) => {
    playQueues.push([filename])
  }

  let queueArray: string[] = []

  playQueues.observe(() => {
    queueArray = Array.from(playQueues)

    if (queueArray[0] == filename) {
      play()
      playQueues.delete(0)
    }
  })
</script>

<button
  class="text-xl text-center px-4 py-2 rounded bg-red-500 m-4"
  on:click={() => addToQueue(filename)}
>
  {label}
</button>
<audio id={filename} preload="metadata">
  <source src={`/sounds/${filename}.mp3`} type="audio/mpeg" />
</audio>
