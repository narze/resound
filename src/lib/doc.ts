import * as Y from "yjs"
import { WebrtcProvider } from "y-webrtc"

export type AudioRecord = {
  id: number
  name: string
}

const ydoc = new Y.Doc()
new WebrtcProvider("remote-soundboard-test", ydoc)
export const sharedAudios = ydoc.getArray<AudioRecord>("audios")
export const playQueues = ydoc.getArray<AudioRecord["id"]>("play_queues")
