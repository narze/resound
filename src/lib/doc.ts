import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

export type Audio = {
  name: string;
};

const ydoc = new Y.Doc();
new WebrtcProvider("remote-soundboard-test", ydoc);
export const sharedAudios = ydoc.getArray<Audio>("audios");
