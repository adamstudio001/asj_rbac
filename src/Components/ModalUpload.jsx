import { v4 as uuidv4 } from "uuid";
import { Trash2, X } from "lucide-react";
import { Button } from "@/Components/ui/Button";
import Upload from "@assets/upload.svg";
import {
  DialogModal,
  DialogModalContent,
  DialogModalDescription,
  DialogModalFooter,
  DialogModalHeader,
  DialogModalTitle,
} from "@/Components/ui/DialogModal";
import { useFileManager } from "@src/Providers/FileManagerProvider";
import { useRef, useState } from "react";
import { useToast } from "@src/Providers/ToastProvider";
import { cn } from "@/lib/utils";

export default function ModalUpload() {
  const { isModalOpen, setIsModalOpen } = useFileManager();
  const { addToast } = useToast();

  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const uploadRefs = useRef({});

  const handleBrowse = () => inputRef.current.click();

  // 🔁 Baca rekursif folder saat drag & drop
  const readAllFiles = async (entry, path = "") => {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file((file) => {
        // ❌ Tidak ubah file.webkitRelativePath (read-only)
        // ✅ Simpan path custom
        const customFile = Object.assign(file, {
          customPath: path + file.name,
        });
        resolve([customFile]);
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      let entries = [];
      const readEntries = () => {
        dirReader.readEntries(async (results) => {
          if (!results.length) {
            const nestedFiles = [];
            for (const e of entries) {
              const nested = await readAllFiles(e, path + entry.name + "/");
              nestedFiles.push(...nested);
            }
            resolve(nestedFiles);
          } else {
            entries = entries.concat(Array.from(results));
            readEntries();
          }
        });
      };
      readEntries();
    } else {
      resolve([]);
    }
  });
};

  // 📂 Saat pilih file/folder dari dialog
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    const newFiles = selected.map((file) => ({
      id: uuidv4(),
      file,
      path: file.webkitRelativePath || file.name, // ⬅️ Gunakan path penuh
      progress: 0,
      uploaded: false,
      uploading: false,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = ""; // reset input
  };

  // 📦 Saat drag & drop folder/file
  const handleDrop = async (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    const collectedFiles = [];

    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (entry) {
        const allFiles = await readAllFiles(entry);
        collectedFiles.push(...allFiles);
      }
    }

    const droppedFiles = collectedFiles.map((file) => ({
      id: uuidv4(),
      file,
      path: file.customPath || file.webkitRelativePath || file.name, // ⬅️ Gunakan path penuh
      progress: 0,
      uploaded: false,
      uploading: false,
    }));

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ❌ Hapus file
  const handleRemove = (fileToRemove) => {
    const ref = uploadRefs.current[fileToRemove.id];
    if (ref) {
      if (ref.intervalId) clearInterval(ref.intervalId);
      if (ref.timeoutId) clearTimeout(ref.timeoutId);
      delete uploadRefs.current[fileToRemove.id];
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileToRemove.id));
  };

  // 🚀 Simulasi upload
  const handleUploadFiles = () => {
    const notUploaded = files.filter((f) => !f.uploaded && !f.uploading);

    notUploaded.forEach((f, relIndex) => {
      const fileId = f.id;
      setFiles((prev) =>
        prev.map((fileObj) =>
          fileObj.id === fileId ? { ...fileObj, uploading: true } : fileObj
        )
      );

      const timeoutId = setTimeout(() => {
        let progress = 0;
        const intervalId = setInterval(() => {
          progress += 10;

          setFiles((prev) =>
            prev.map((fileObj) =>
              fileObj.id === fileId
                ? { ...fileObj, progress: Math.min(progress, 100) }
                : fileObj
            )
          );

          if (progress >= 100) {
            clearInterval(intervalId);
            delete uploadRefs.current[fileId];
            setFiles((prev) =>
              prev.map((fileObj) =>
                fileObj.id === fileId
                  ? { ...fileObj, uploaded: true, uploading: false, progress: 100 }
                  : fileObj
              )
            );
            addToast("success", `Uploaded ${f.path}`);
          }
        }, 200);

        uploadRefs.current[fileId] = { ...(uploadRefs.current[fileId] || {}), intervalId };
      }, relIndex * 1000);

      uploadRefs.current[fileId] = { ...(uploadRefs.current[fileId] || {}), timeoutId };
    });
  };

  const uploadingCount = files.filter((f) => !f.uploaded).length;

  return (
    <DialogModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-xl" showClose={false} isUplodFile={true}>
        
        {/* HEADER */}
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48] text-center">
            Upload
          </DialogModalTitle>
        </DialogModalHeader>

        {/* BODY (SCROLLABLE) */}
        <DialogModalDescription asChild className="flex flex-col overflow-y-auto scroll-custom mx-4 sm:mx-auto">
          <div className="flex-1 max-w-lg pb-6 space-y-4">
            {/* Drag & Drop Area */}
            <div
              className={cn(
                files.length === 0 ? `flex-1` : ``,
                files.length === 0 ? `h-auto` : ``,
                `bg-[#f8f8ff] rounded-lg p-8 flex flex-col gap-4 items-center justify-center text-center cursor-pointer hover:border-blue-500 transition`
              )}
              onClick={handleBrowse}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <img src={Upload} className="text-4xl text-blue-500 mb-2" />
              <div className="flex flex-col">
                <p className="font-medium text-black">
                  Drag &amp; drop files or{" "}
                  <span className="text-[#483ea8] underline">Browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  // webkitdirectory=""
                  directory="true"
                />
              </div>
            </div>

            {/* Upload Progress Area */}
            {files.length > 0 && (
              <div className="w-full overflow-hidden">
                {/* Uploading Files */}
                {uploadingCount > 0 && (
                  <div className="w-full">
                    <p className="font-mulish font-bold font-medium mb-2">
                      Uploading - {files.filter(f => f.uploaded).length}/{files.length} files
                    </p>
                    {files
                      .filter(f => !f.uploaded)
                      .map((f) => (
                        <div key={f.id} className="mb-2">
                          <div className="relative border border-gray-400 rounded p-2 mb-2 text-sm">
                            <div className="flex justify-between">
                              <span className="truncate">{f.path}</span>
                              <button
                                onClick={() => handleRemove(f)}
                                className="w-5 h-5 bg-gray-300 hover:bg-black rounded-full text-white flex justify-center items-center"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            <div className="absolute ml-[-8px] w-[100%] h-1 bg-gray-200 rounded mt-1">
                              <div
                                className="h-1 bg-blue-500 rounded transition-all duration-200"
                                style={{ width: `${f.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Uploaded Files */}
                {files.filter(f => f.uploaded).length > 0 && (
                  <div>
                    <p className="font-mulish font-bold font-medium mb-2">Uploaded</p>
                    {files
                      .filter(f => f.uploaded)
                      .map((f) => (
                        <div
                          key={f.id}
                          className="flex justify-between items-center border border-[#11AF22] border-[1.2px] rounded p-2 mb-2 text-sm"
                        >
                          <span className="truncate">{f.path}</span>
                          <button
                            onClick={() => handleRemove(f)}
                            className="text-[#E41D1D] bg-[#FFF3F3] p-[6px] rounded-full"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogModalDescription>

        {/* FOOTER */}
        <DialogModalFooter className="mx-4 sm:mx-6 pb-6">
          <div className="flex flex-wrap items-between gap-4">
            <Button
              variant="outline"
              className="flex-1 min-w-[250px]"
              onClick={() => {
                setIsModalOpen(false);
                setFiles([]);
              }}
            >
              <X className="opacity-60" size={16} aria-hidden="true" />
              <span>Cancel</span>
            </Button>
            <Button
              className="flex-1 min-w-[250px] bg-[#1a2f48] hover:bg-[#1a2f48]/90 text-white"
              disabled={files.length === 0}
              onClick={handleUploadFiles}
            >
              UPLOAD FILES
            </Button>
          </div>
        </DialogModalFooter>

      </DialogModalContent>
    </DialogModal>
  );
}
