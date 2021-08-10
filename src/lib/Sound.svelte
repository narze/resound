<script lang="ts">
  import * as localforage from "localforage"
  import { getContext } from "svelte"
  import * as Y from "yjs"
  import { soundKey } from "./shared"

  export let label
  export let audioId
  export let playQueues: Y.Array<AudioRecord["id"]>
  export let playingAudio: Y.Array<AudioRecord["id"]>

  let audioData: string
  let audio: HTMLAudioElement
  let isPlaying: boolean = false

  const { getAudioCache } = getContext(soundKey)
  const audioCache = getAudioCache()

  const play = async () => {
    if (!audioData) {
      audioData = (await localforage.getItem(`${audioId}`)) as string
      audio = new Audio(audioData)
    }

    if (audio.paused) {
      audio.onpause = () => {
        isPlaying = false
        playingAudio.delete(0, 1)
      }
      playingAudio.push([audioId])
      audio.play()
      pauseOtherSounds(audio)
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }

  function pauseOtherSounds(currentAudio: HTMLAudioElement) {
    audioCache.forEach((audio, idx) => {
      if (audio != currentAudio) {
        audio.pause()
        audio.currentTime = 0
        delete audioCache[idx]
      }
    })

    audioCache.push(currentAudio)
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
