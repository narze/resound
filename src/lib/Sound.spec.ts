import { render, fireEvent } from "@testing-library/svelte"
import * as Y from "yjs"
import Sound from "./Sound.svelte"
import * as localforage from "localforage"

jest.mock("localforage")

const mockedLocalforage = localforage as jest.Mocked<typeof localforage>

mockedLocalforage.getItem.mockImplementation(async () => {
  return "data:audio/mpeg;base64//Mock"
})

jest.spyOn(window, "Audio").mockImplementation((src?: string) => {
  return {
    paused: true,
    play: () => {
      console.log("PLAY")
    },
  } as unknown as HTMLAudioElement
})

it("it works", async () => {
  const onPlay = jest.fn()

  const { getByText } = render(Sound, {
    label: "Test Audio",
    audioId: 0,
    playQueues: Y.Array.from([]),
    playingAudio: Y.Array.from([]),
    onPlay: (audio: HTMLAudioElement) => {
      console.log(audio.src)
      onPlay()
    },
  })

  expect(getByText("Test Audio")).toBeInTheDocument()

  await fireEvent.click(getByText("Test Audio"))

  expect(onPlay).toHaveBeenCalled()
})
