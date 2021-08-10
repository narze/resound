import { render, fireEvent } from "@testing-library/svelte"
import * as Y from "yjs"
import * as localforage from "localforage"
import Sound from "./Sound.svelte"
import ContextTest from "./ContextTest.svelte"
import { soundKey } from "./shared"

jest.mock("localforage")

const mockedLocalforage = localforage as jest.Mocked<typeof localforage>

mockedLocalforage.getItem.mockImplementation(async () => {
  return "data:audio/mpeg;base64//Mock"
})

describe("when clicking the button", () => {
  afterEach(() => {
    ;(window.Audio as any).mockClear()
  })

  it("it creates audio and play it", async () => {
    const mockPlay = jest.fn()
    const mockPause = jest.fn()

    // TODO: Mock Audio class
    jest.spyOn(window, "Audio").mockImplementation((src?: string) => {
      return {
        paused: true,
        play: mockPlay,
        pause: mockPause,
      } as unknown as HTMLAudioElement
    })

    const { getByText } = render(ContextTest, {
      props: {
        Component: Sound,
        contextKey: soundKey,
        contextValue: {
          getAudioCache: () => [],
        },
        componentProps: {
          label: "Test Audio",
          audioId: 0,
          playQueues: Y.Array.from([]),
          playingAudio: Y.Array.from([]),
        },
      },
    })

    const button = getByText("Test Audio")
    expect(button).toBeInTheDocument()

    // expect(button).toHaveClass("bg-yellow-200")

    await fireEvent.click(button)

    // expect(button).toHaveClass("bg-green-400")

    expect(mockPlay).toHaveBeenCalled()
    expect(mockPause).not.toHaveBeenCalled()
  })

  describe("when the audio is already playing", () => {
    it("pauses the audio", async () => {
      const mockPlay = jest.fn()
      const mockPause = jest.fn()

      jest.spyOn(window, "Audio").mockImplementation((src?: string) => {
        return {
          paused: false,
          play: mockPlay,
          pause: mockPause,
        } as unknown as HTMLAudioElement
      })

      const { getByText } = render(ContextTest, {
        props: {
          Component: Sound,
          contextKey: soundKey,
          contextValue: {
            getAudioCache: () => [],
          },
          componentProps: {
            label: "Test Audio",
            audioId: 0,
            playQueues: Y.Array.from([]),
            playingAudio: Y.Array.from([]),
          },
        },
      })

      const button = getByText("Test Audio")

      // expect(button).toHaveClass("bg-green-400")

      await fireEvent.click(button)

      // expect(button).toHaveClass("bg-yellow-200")

      expect(mockPause).toHaveBeenCalled()
      expect(mockPlay).not.toHaveBeenCalled()
    })
  })
})
