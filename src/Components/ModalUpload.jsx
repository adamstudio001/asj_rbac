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
import axios from "axios";

export default function ModalUpload({
  refreshData = () => {},
  idFolder = null,
  token = null,
  isAdmin = false,
  isCompany = false,
  isUser = false
}) {
  const { isModalOpen, setIsModalOpen } = useFileManager();
  const { addToast } = useToast();

  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleBrowse = () => inputRef.current.click();

  const readAllFiles = async (entry, path = "") => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file) => {
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

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);

    const newFiles = selected.map((file) => ({
      id: uuidv4(),
      file,
      path: file.webkitRelativePath || file.name,
      progress: 0,
      status: "idle", // idle | uploading | upload | uploaded | error
      error: null,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

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
      path: file.customPath || file.webkitRelativePath || file.name,
      progress: 0,
      status: "idle",
      error: null,
    }));

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemove = (target) => {
    setFiles((prev) => prev.filter((f) => f.id !== target.id));
  };

  // ==========================
  // 🚀 PARALLEL UPLOAD
  // ==========================
  const handleUploadFiles = async () => {
    if (!idFolder) {
      addToast("error", "Folder tujuan belum dipilih.");
      return;
    }

    const pending = files.filter((f) => f.status === "idle");

    pending.forEach((fileObj) => uploadSingleFile(fileObj));
  };

  // ==========================
  // 🚀 Upload Single File
  // ==========================
  const uploadSingleFile = async (f) => {
    const fileId = f.id;

    if (f.file.size > 1 * 1024 * 1024) {
      setFileState(fileId, { status: "error", error: "error.max_size" });
      addToast("error", `${f.path} — file too large (max 1MB)`);
      return;
    }

    // 1️⃣ STATE: uploading (shimmer)
    setFileState(fileId, { status: "uploading", progress: 0 });

    setTimeout(async () => {
      // 2️⃣ STATE: upload (progress bar)
      setFileState(fileId, { status: "upload" });

      const formData = new FormData();
      formData.append("file", f.file);

      try {
        const url = (isAdmin || isCompany)
          ? `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/company/1/storage/${idFolder}/file`
          : `https://staging-backend.rbac.asj-shipagency.co.id/api/v1/app/company/1/storage/${idFolder}/file`;

        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (p) => {
            const progress = Math.round((p.loaded * 100) / p.total);
            setFileState(fileId, { progress });
          },
        });

        setTimeout(()=>{
          const res = response.data;

          // 3️⃣ STATE: API RESPONSE CHECK
          if (res.error) {
            setFileState(fileId, {
              status: "error",
              error: res.error,
              progress: 0,
            });
            addToast("error", res.error);
          } else {
            setFileState(fileId, {
              status: "uploaded",
              progress: 100,
              error: null,
            });
            addToast("success", `Uploaded: ${f.path}`);
            refreshData();
          }
        },5000); // verify delay
      } catch (err) {
        setFileState(fileId, {
          status: "error",
          error: "error.common",
          progress: 0,
        });

        addToast(
          "error",
          `Failed: ${f.path} — ${err?.response?.data?.message || err.message}`
        );
      }
    }, 5000); // shimmer delay
  };

  // ==========================
  // Helper Update State
  // ==========================
  const setFileState = (id, updates) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const renderError = (message) => {
    if (!message) return null;

    let msg = message;
    if (message === "error.max_size") msg = "ukuran file lebih dari 1MB";
    if (message === "error.common") msg = "ada masalah teknis saat upload";

    return <p className="text-red-500 mt-1">{msg}</p>;
  };

  return (
    <DialogModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogModalContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-xl" showClose={false} isUplodFile={true}>
        <DialogModalHeader>
          <DialogModalTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48] text-center">
            Upload
          </DialogModalTitle>
        </DialogModalHeader>

        <DialogModalDescription asChild className="flex flex-col mx-4 sm:mx-auto">
          <div className="flex-1 max-w-lg pb-6 space-y-4 w-[-webkit-fill-available]">

            {/* DRAG AREA */}
            <div
              className={cn(
                files.length === 0 && `flex-1 h-auto`,
                `bg-[#f8f8ff] rounded-lg p-8 flex flex-col gap-4 items-center justify-center text-center cursor-pointer`
              )}
              onClick={handleBrowse}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <img src={Upload} className="text-4xl text-blue-500 mb-2" />
              <div>
                <p className="font-medium text-black">
                  Drag & drop files or{" "}
                  <span className="text-[#483ea8] underline">Browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, MP4, PDF, Word, PPT, etc.
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* FILE LIST */}
            {files.length > 0 && (
              <div className="w-full overflow-hidden flex flex-col gap-2">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className={cn(
                      "relative border rounded text-sm",
                      f.status === "error"
                        ? "border-red-400"
                        : f.status === "uploaded"
                          ? "border-green-500"
                          : "border-gray-400"
                    )}
                  >
                    <div className={`flex justify-between p-2`}>
                      <span className="truncate">{f.path}</span>
                      <button
                        disabled={f.status !== "idle" && f.status !== "uploaded" && f.status !== "error"}
                        onClick={() => handleRemove(f)}
                        className="w-5 h-5 bg-gray-300 hover:bg-black rounded-full text-white flex justify-center items-center"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* SHIMMER */}
                    {f.status === "uploading" && (
                      <div className="w-full h-2 rounded mt-1 overflow-hidden bg-gray-200">
                        <div className="animate-shimmer h-full w-full" />
                      </div>
                    )}

                    {/* PROGRESS */}
                    {f.status === "upload" && (
                      <div className="w-full h-2 rounded mt-1 overflow-hidden bg-gray-200">
                        <div
                          className="h-full bg-blue-500 transition-all duration-200"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                    )}

                    {f.error && renderError(f.error)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogModalDescription>

        <DialogModalFooter className="mx-4 sm:mx-6 pb-6">
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="flex-1 min-w-[250px]"
              onClick={() => {
                setIsModalOpen(false);
                setFiles([]);
              }}
            >
              <X className="opacity-60" size={16} />
              Cancel
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