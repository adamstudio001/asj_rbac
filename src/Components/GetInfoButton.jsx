import React, { useState } from "react";
import Info from "@assets/info.svg";
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

function GetInfoButton({ file, onOpenDialog_ }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={() => {
            if (onOpenDialog_) onOpenDialog_(); // tutup popper lebih dulu
            setOpen(true); // buka dialog manual
          }}
          className="flex gap-2 items-center w-full px-3 py-2 text-sm text-[#424242] hover:bg-[#F4F4F4] hover:text-[#242424]"
        >
          <img src={Info} alt="Info" /> Get Info
        </button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            File Information
          </DialogTitle>

          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <section>
                    <h3 className="font-semibold text-gray-800 mb-1">General:</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium text-gray-500">Name:</span>{" "}
                        {file.name}
                      </p>
                      <p>
                        <span className="font-medium text-gray-500">Type:</span>{" "}
                        {file.isFolder ? "Folder" : file.name.split(".").pop()}
                      </p>
                      <p>
                        <span className="font-medium text-gray-500">Size:</span>{" "}
                        {file.fileSize ? `${file.fileSize} bytes` : "-"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-500">Modified:</span>{" "}
                        {file.lastModified}
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </DialogDescription>

            <DialogFooter className="px-6 pb-6 sm:justify-start">
              <DialogClose asChild>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default GetInfoButton;
