import { v4 as uuidv4 } from 'uuid';
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Upload from "@assets/upload.svg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFileManager } from "@src/Providers/FileManagerProvider";
import { useRef, useState } from 'react';
import { useToast } from "@src/Providers/ToastProvider";

export default function ModalUpload() {
  const { 
      isModalOpen, 
      setIsModalOpen,
  } = useFileManager();
  const { addToast } = useToast();

  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const uploadRefs = useRef({}); // simpan timeout & interval per file

  // Handle browse click
  const handleBrowse = () => inputRef.current.click();

  // Handle file selection
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: uuidv4(),
      file: file,
      progress: 0,
      uploaded: false,
      uploading: false,
    }));
    setFiles(prev => [...prev, ...newFiles]);

    // ✅ Reset supaya file yang sama bisa dipilih ulang
    e.target.value = "";
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      id: uuidv4(),
      file: file,
      progress: 0,
      uploaded: false,
      uploading: false,
    }));
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Remove file (cancel upload)
  const handleRemove = (fileToRemove) => {
    const ref = uploadRefs.current[fileToRemove.id];
    if (ref) {
      if (ref.intervalId) clearInterval(ref.intervalId);
      if (ref.timeoutId) clearTimeout(ref.timeoutId);
      delete uploadRefs.current[fileToRemove.id];
    }
    setFiles(prev => prev.filter(f => f.id !== fileToRemove.id));
  };

  // Simulate upload with delay 3 detik per file (relatif)
  const handleUploadFiles = () => {
    const notUploaded = files.filter(f => !f.uploaded && !f.uploading);

    notUploaded.forEach((f, relIndex) => {
      const fileId = f.id;

      // Tandai file sedang upload
      setFiles(prev =>
        prev.map(fileObj =>
          fileObj.id === fileId ? { ...fileObj, uploading: true } : fileObj
        )
      );

      const timeoutId = setTimeout(() => {
        let progress = 0;
        const intervalId = setInterval(() => {
          progress += 10;

          setFiles(prev =>
            prev.map(fileObj =>
              fileObj.id === fileId
                ? { ...fileObj, progress: Math.min(progress, 100) }
                : fileObj
            )
          );

          if (progress >= 100) {
            clearInterval(intervalId);
            delete uploadRefs.current[fileId];
            setFiles(prev =>
              prev.map(fileObj =>
                fileObj.id === fileId
                  ? { ...fileObj, uploaded: true, uploading: false, progress: 100 }
                  : fileObj
              )
            );
            addToast("success", "Upload successfully");
          }
        }, 200);

        uploadRefs.current[fileId] = {
          ...(uploadRefs.current[fileId] || {}),
          intervalId
        };
      }, relIndex * 1000);

      uploadRefs.current[fileId] = {
        ...(uploadRefs.current[fileId] || {}),
        timeoutId
      };
    });
  };

  const uploadingCount = files.filter(f => !f.uploaded).length;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-xl" showClose={false}>
        <DialogHeader>
          <DialogTitle className="px-6 py-4 font-inter font-bold text-[22px] text-[#1B2E48] text-center">
            Upload
          </DialogTitle>

          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="max-w-lg mx-4 sm:mx-auto py-6 space-y-4">
                {/* Drag & Drop Area */}
                <div
                  className={`${files.length === 0 ? `h-[400px]` : ``} bg-[#f8f8ff] rounded-lg p-8 flex flex-col gap-4 items-center justify-center text-center cursor-pointer hover:border-blue-500 transition`}
                  onClick={handleBrowse}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <img src={Upload} className="text-4xl text-blue-500 mb-2"/>
                  <div className=" flex flex-col">
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
                    />
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="w-full overflow-hidden">
                    {/* Uploading Files */}
                    {uploadingCount > 0 && (
                      <div className="w-full px-4 sm:px-0">
                        <p className="font-mulish font-bold font-medium mb-2">
                          Uploading - {files.filter(f => f.uploaded).length}/{files.length} files
                        </p>
                        {files
                          .filter(f => !f.uploaded)
                          .map((f) => (
                            <div key={f.id} className="mb-2">
                              <div className="relative border border-gray-400 rounded p-2 mb-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="truncate">{f.file.name}</span>
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
                              <span className="truncate">{f.file.name}</span>
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
            </DialogDescription>

            <DialogFooter className="px-6 pb-6">
              <div className="flex flex-wrap items-between gap-4">
                <Button variant="outline" className="flex-1 min-w-[250px]"  onClick={()=>setIsModalOpen(false)}>
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
            </DialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}