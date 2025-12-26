import { v4 as uuidv4 } from "uuid";

export const createFileObject = async ({ file = null, reference = null, name = null }) => {
    if (file) {
      // File asli dari input / drag-drop
      return {
        id: uuidv4(),
        file,
        path: file.webkitRelativePath || file.name,
        progress: 0,
        status: "idle",
        error: null,
        isReference: false,
      };
    }

    if (reference) {
      // Reference dari context menu / file URL
      return {
        id: uuidv4(),
        file: null,
        path: name,
        reference,
        progress: 0,
        status: "idle",
        error: null,
        isReference: true,
      };
    }

    throw new Error("Either file or reference must be provided");
};