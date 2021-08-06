<script lang="ts">
  import localForage from "localforage"

  export let label
  export let audioId
  export let playQueues

  let audioData: string
  let audio: HTMLAudioElement

  const play = async () => {
    if (!audioData) {
      audioData = (await localForage.getItem(`${audioId}`)) as string
      audio = new Audio(audioData)
    }

    if (!audio.paused) {
      audio.currentTime = 0
    }

    audio.play()
  }

  let queueArray: number[] = []

  playQueues.observe(() => {
    queueArray = Array.from(playQueues)

    if (!queueArray.length) {
      return
    }

    if (queueArray[0] == audioId) {
      play()
      playQueues.delete(0)
    }
  })
</script>

<button
  class="text-xl h-full w-full bg-yellow-200 hover:bg-yellow-500 active:bg-yellow-700 rounded"
  on:click={() => play()}
>
  {label}
</button>
