<script lang="ts">
  import localForage from "localforage"
  import { WebrtcProvider } from "y-webrtc"
  import * as Y from "yjs"
  import "twind/shim"

  import Sound from "./lib/Sound.svelte"

  let sharedAudios: Y.Array<AudioRecord>
  let playQueues: Y.Array<AudioRecord["id"]>
  let audioArray: AudioRecord[] = []
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
  }

  function enterRoomNumber(server: boolean) {
    isServer = server
    const input = document.getElementById("room-number") as HTMLInputElement
    roomNumber = input.value

    const ydoc = new Y.Doc()
    if (provider) {
      provider.disconnect()
      provider.destroy()
    }
    provider = new WebrtcProvider(`resound-room-${roomNumber}`, ydoc)

    sharedAudios = ydoc.getArray<AudioRecord>("audios")
    playQueues = ydoc.getArray<AudioRecord["id"]>("play_queues")

    sharedAudios.observe(() => {
      audioArray = Array.from(sharedAudios)
    })

    audioArray = Array.from(sharedAudios)
  }

  function playRemotely(id: number) {
    playQueues.push([id])
  }

  let audioUploadIds: AudioRecord[] = []

  localForage.getItem("ids").then((ids) => {
    audioUploadIds = (ids as Array<AudioRecord>) || []
  })
</script>

<main>
  <h1>Resound</h1>

  {#if roomNumber}
    <h2 class="text-2xl">Room {roomNumber}</h2>
  {:else}
    <input
      id="room-number"
      type="text"
      class="border p-2"
      placeholder="Enter Room Number"
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
    {isServer ? "Server" : "Client"}
    {audioUploadIds.length == 0 ? "No audio" : ""}

    {#if isServer}
      {#each audioUploadIds as { id, name }}
        <div class="my-2">
          <Sound label={name} audioId={id} {playQueues} />
          <button
            on:click={() => deleteAudioId(id)}
            class="border rounded p-2 bg-red-400">Delete</button
          >
        </div>
      {/each}
    {:else}
      {#each audioArray as { id, name }}
        <div class="my-2">
          <button
            on:click={() => playRemotely(id)}
            class="border rounded p-2 bg-green-400">{name}</button
          >
        </div>
      {/each}
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
