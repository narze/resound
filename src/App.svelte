<script lang="ts">
  import localForage from "localforage"
  import { WebrtcProvider } from "y-webrtc"
  import { IndexeddbPersistence } from "y-indexeddb"
  import * as Y from "yjs"
  import "twind/shim"

  import Sound from "./lib/Sound.svelte"
  import Counter from "./lib/Counter.svelte"

  const audioCache: Array<HTMLAudioElement> = []

  let sharedAudios: Y.Array<AudioRecord>
  let playQueues: Y.Array<AudioRecord["id"]>
  let playingAudio: Y.Array<AudioRecord["id"]>
  let audioArray: Array<AudioRecord & { isPlaying?: boolean }> = []
  let roomNumber: string
  let provider: WebrtcProvider
  let isServer: boolean

  function clearAudio() {
    if (sharedAudios) {
      sharedAudios.delete(0, sharedAudios.length)
    }

    if (playQueues) {
      playQueues.delete(0, playQueues.length)
    }

    localForage.clear()
    audioUploadIds = []
  }

  function uploadAudio(e: any) {
    const input = e.target as HTMLInputElement
    const file = input.files[0]
    const name = file.name.split(".").slice(0, -1).join(".")

    if (file.type.indexOf("audio/") !== 0) {
      alert("Please upload audio file")
      return
    }

    const reader = new FileReader()

    reader.onload = async function () {
      const audioString = this.result as string

      const audioRecords =
        ((await localForage.getItem("ids")) as Array<AudioRecord>) || []
      const id = audioRecords.length
        ? audioRecords[audioRecords.length - 1].id + 1
        : 0
      audioRecords.push({ id, name })

      try {
        await localForage.setItem(`${id}`, audioString)
        await localForage.setItem("ids", audioRecords)

        audioUploadIds = audioRecords

        // Clear all and push new audio records
        sharedAudios.delete(0, sharedAudios.length)
        sharedAudios.push(audioRecords)

        input.value = ""
      } catch (err) {
        alert(err.message)
      }
    }

    reader.readAsDataURL(file)
  }

  async function deleteAudioId(audioId) {
    const audioRecords =
      ((await localForage.getItem("ids")) as Array<AudioRecord>) || []
    const updatedIds = audioRecords.filter(({ id }) => id !== audioId)
    await localForage.setItem("ids", updatedIds)

    await localForage.removeItem(`${audioId}`)

    audioUploadIds = updatedIds

    // Clear all and push new audio records
    sharedAudios.delete(0, sharedAudios.length)
    sharedAudios.push(updatedIds)
  }

  async function enterRoomNumber(server: boolean) {
    isServer = server
    const input = document.getElementById("room-number") as HTMLInputElement
    roomNumber = input.value

    const ydoc = new Y.Doc()
    if (provider) {
      provider.disconnect()
      provider.destroy()
    }

    if (isServer) {
      const indexeddbProvider = new IndexeddbPersistence(
        `resound-room-${roomNumber}`,
        ydoc
      )

      indexeddbProvider.whenSynced.then(async () => {
        const audioRecords =
          ((await localForage.getItem("ids")) as Array<AudioRecord>) || []

        // Replace all shared audios with the one in IndexedDB
        sharedAudios.delete(0, sharedAudios.length)
        sharedAudios.push(audioRecords)
      })
    }

    provider = new WebrtcProvider(`resound-room-${roomNumber}`, ydoc)

    sharedAudios = ydoc.getArray<AudioRecord>("audios")
    playQueues = ydoc.getArray<AudioRecord["id"]>("play_queues")
    playingAudio = ydoc.getArray<AudioRecord["id"]>("playing")

    sharedAudios.observe(() => {
      audioArray = Array.from(sharedAudios)
    })

    playingAudio.observe(() => {
      const playingAudioArray = Array.from(playingAudio)

      audioArray = Array.from(sharedAudios).map((sharedAudio) => {
        return {
          ...sharedAudio,
          isPlaying: playingAudioArray.includes(sharedAudio.id),
        }
      })
    })

    audioArray = Array.from(sharedAudios)

    provider.on("peers", (e) => {
      console.log("peers", { e })
    })
  }

  function playRemotely(id: number) {
    playQueues.push([id])
  }

  function onPlay(playingAudio: HTMLAudioElement) {
    audioCache.forEach((audio, idx) => {
      if (audio != playingAudio) {
        audio.pause()
        audio.currentTime = 0
        delete audioCache[idx]
      }
    })

    audioCache.push(playingAudio)
  }

  let audioUploadIds: AudioRecord[] = []

  localForage.getItem("ids").then((ids) => {
    audioUploadIds = (ids as Array<AudioRecord>) || []
  })
</script>

<main>
  <!-- <Counter count={1} /> -->

  {#if isServer || !roomNumber}
    <h1>Resound</h1>
  {/if}

  {#if roomNumber}
    <h2 class="text-2xl">Room {roomNumber}</h2>
  {:else}
    <input
      id="room-number"
      type="text"
      class="border p-2"
      placeholder="Enter Room Number"
      value="1234"
    />

    <button
      on:click={() => enterRoomNumber(true)}
      class="border rounded p-2 bg-red-500">Create Room</button
    >
    <button
      on:click={() => enterRoomNumber(false)}
      class="border rounded p-2 bg-red-500">Join Room</button
    >
  {/if}

  {#if roomNumber}
    {#if isServer}
      {audioUploadIds.length == 0 ? "No audio" : ""}
      <div class="grid grid-cols-5 gap-1">
        {#each audioUploadIds as { id, name }}
          <div class="relative h-40">
            <Sound
              label={name}
              audioId={id}
              {onPlay}
              {playQueues}
              {playingAudio}
            />
            <button
              on:click={() => deleteAudioId(id)}
              class="absolute top-1 right-1 border">ⓧ</button
            >
          </div>
        {/each}
      </div>
    {:else}
      {audioArray.length == 0 ? "No audio" : ""}
      <div class="grid grid-cols-5 gap-1">
        {#each audioArray as { id, name, isPlaying }}
          <div class="relative h-40">
            <button
              on:click={() => playRemotely(id)}
              class="text-xl h-full w-full rounded {isPlaying
                ? 'bg-green-400 hover:bg-green-500 active:bg-green-700'
                : 'bg-yellow-200 hover:bg-yellow-500 active:bg-yellow-700'}"
              >{name}</button
            >
          </div>
        {/each}
      </div>
    {/if}

    {#if isServer}
      <div class="file-wrapper">
        <h3>Upload Audio</h3>
        <input type="file" id="audio" on:change={uploadAudio} />
      </div>

      <button on:click={clearAudio} class="border rounded p-2 bg-red-400"
        >Remove all audios</button
      >
    {/if}
  {/if}

  <footer>
    <a
      href="https://github.com/narze/remote-soundboard"
      target="_blank"
      rel="noreferrer">Github</a
    >
  </footer>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
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

  :global(button) {
    background-color: #ff3e00; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }

  footer {
    color: black;
    position: fixed;
    right: 10px;
    bottom: 10px;
    font-size: 1rem;
  }

  a {
    color: black;
    text-decoration: none;
  }

  .file-wrapper {
    margin: 2rem auto;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }
  }
</style>
