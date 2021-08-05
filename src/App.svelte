<script lang="ts">
  import localForage from "localforage"

  import type { AudioRecord } from "./lib/doc"
  import { sharedAudios, playQueues } from "./lib/doc"
  import Sound from "./lib/Sound.svelte"

  function clearAudio() {
    sharedAudios.delete(0, sharedAudios.length)
    playQueues.delete(0, playQueues.length)
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

  function playRemotely(id: number) {
    playQueues.push([id])
  }

  let audioUploadIds: AudioRecord[] = []

  localForage.getItem("ids").then((ids) => {
    audioUploadIds = (ids as Array<AudioRecord>) || []
  })

  let audioArray: AudioRecord[] = []

  sharedAudios.observe(() => {
    audioArray = Array.from(sharedAudios)
  })

  audioArray = Array.from(sharedAudios)
</script>

<main>
  <h1>Remote Soundboard</h1>

  <h3>Play on this browser</h3>
  {audioUploadIds.length == 0 ? "No audio" : ""}

  {#each audioUploadIds as { id, name }}
    <div class="sound-wrapper">
      <Sound label={name} audioId={id} />
      <button on:click={() => deleteAudioId(id)}>Delete</button>
    </div>
  {/each}

  <hr />

  <h3>Play remotely</h3>
  {audioArray.length == 0 ? "No audio" : ""}

  {#each audioArray as { id, name }}
    <div class="sound-wrapper">
      <button on:click={() => playRemotely(id)}>{name}</button>
    </div>
  {/each}

  <div class="file-wrapper">
    <h3>Upload Audio</h3>
    <input type="file" id="audio" on:change={uploadAudio} />
  </div>

  <button on:click={clearAudio}>Remove all audios</button>

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

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
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

  .sound-wrapper {
    margin: 0.5rem auto;
  }

  .file-wrapper {
    margin: 2rem auto;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
