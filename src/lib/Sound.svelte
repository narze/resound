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
  class="text-xl text-center px-4 py-2 rounded bg-green-500 mx-2"
  on:click={() => play()}
>
  {label}
</button>
