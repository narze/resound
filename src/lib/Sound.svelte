<script lang="ts">
  import localForage from "localforage"
  import {playQueues} from "./doc"

  export let label
  export let audioId

  const play = async () => {
    const audioData = (await localForage.getItem(`${audioId}`)) as string

    const audio = new Audio(audioData);
    audio.play();
  }

  // const addToQueue = (filename: string) => {
  //   playQueues.push([filename])
  // }

  // let queueArray: string[] = []

  // playQueues.observe(() => {
  //   queueArray = Array.from(playQueues)

  //   if (queueArray[0] == filename) {
  //     play()
  //     playQueues.delete(0)
  //   }
  // })
</script>

<button
  class="text-xl text-center px-4 py-2 rounded bg-red-500 m-4"
  on:click={() => play()}
>
  {label}
</button>
