<script lang="ts">
  import localForage from "localforage"

  export let label
  export let audioId
  export let playQueues

  const play = async () => {
    const audioData = (await localForage.getItem(`${audioId}`)) as string

    const audio = new Audio(audioData)
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
  class="text-xl text-center px-4 py-2 rounded bg-red-500 m-4"
  on:click={() => play()}
>
  {label}
</button>
