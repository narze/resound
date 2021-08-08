<script lang="ts">
  import localForage from "localforage"
  import * as Y from "yjs"

  export let label
  export let audioId
  export let playQueues: Y.Array<AudioRecord["id"]>
  export let playingAudio: Y.Array<AudioRecord["id"]>
  export let onPlay: (audio: HTMLAudioElement) => void

  let audioData: string
  let audio: HTMLAudioElement
  let isPlaying: boolean = false

  const play = async () => {
    if (!audioData) {
      audioData = (await localForage.getItem(`${audioId}`)) as string
      audio = new Audio(audioData)
    }

    if (audio.paused) {
      audio.onpause = () => {
        isPlaying = false
        playingAudio.delete(0, 1)
      }
      playingAudio.push([audioId])
      audio.play()
      onPlay(audio)
    } else {
      audio.pause()
      audio.currentTime = 0
    }
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

  $: isPlaying = audio && !audio.paused
  $: colors = isPlaying
    ? "bg-green-400 hover:bg-green-500 active:bg-green-700"
    : "bg-yellow-200 hover:bg-yellow-500 active:bg-yellow-700"
</script>

<button class="text-xl h-full w-full rounded {colors}" on:click={() => play()}>
  {label}
</button>
