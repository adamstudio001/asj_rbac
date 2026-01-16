import { CgFileDocument } from "react-icons/cg";
import Folder from "@assets/folder.svg";
import Images from "@assets/images.svg";
import Pdf from "@assets/pdf.svg";
import Png from "@assets/png.svg";
import Video from "@assets/video.svg";
import Xls from "@assets/xls.svg";
import Zip from "@assets/zip.svg";
import Document from "@assets/document.svg";
import { formatDistanceToNowStrict, isValid } from "date-fns";

export function getFileIcon(fileName, isFolder = false, size = 32) {
  if (isFolder)
    return <img src={Folder} alt="Folder" width={size} height={size} />;

  const ext = fileName.split(".").pop().toLowerCase();

  if (["ppt", "pptx"].includes(ext))
    return <img src={Document} alt="presentation" width={size} height={size} />;
  if (["xlsx", "xls"].includes(ext))
    return <img src={Xls} alt="Folder" width={size} height={size} />;
  if (["doc", "docx", "txt"].includes(ext))
    return <img src={Document} alt="document" width={size} height={size} />;
  if (["mp3", "zip"].includes(ext))
    return <img src={Zip} alt="archive" width={size} height={size} />;
  if (["mp4", "mkv", "avi"].includes(ext))
    return <img src={Video} alt="video" width={size} height={size} />;
  if (["pdf"].includes(ext))
    return <img src={Pdf} alt="archive" width={size} height={size} />;
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext))
    return <img src={Images} alt="image" width={size} height={size} />;
  if (["png", "svg"].includes(ext))
    return <img src={Png} alt="ilustrate" width={size} height={size} />;

  return <CgFileDocument className="text-gray-400 text-xl" />; // default
}

export function getFileIconBig(fileName, isFolder = false) {
  if (isFolder) return <img src={Folder} alt="Folder" className="w-[10cqi]" />;

  const ext = fileName.split(".").pop().toLowerCase();

  if (["ppt", "pptx"].includes(ext))
    return <img src={Pp} alt="presentation" className="w-[10cqi]" />;
  if (["xlsx", "xls", "csv"].includes(ext))
    return <img src={Xls} alt="Folder" className="w-[10cqi]" />;
  if (["doc", "docx", "txt"].includes(ext))
    return <img src={Document} alt="document" className="w-[10cqi]" />;
  if (["mp3", "zip"].includes(ext))
    return <img src={Zip} alt="archive" className="w-[10cqi]" />;
  if (["mp4", "mkv", "avi"].includes(ext))
    return <img src={Video} alt="video" className="w-[10cqi]" />;
  if (["pdf"].includes(ext))
    return <img src={Pdf} alt="archive" className="w-[10cqi]" />;
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext))
    return <img src={Images} alt="image" className="w-[10cqi]" />;
  if (["png", "svg"].includes(ext))
    return <img src={Png} alt="ilustrate" className="w-[10cqi]" />;

  return <CgFileDocument size={"100%"} className="text-gray-400 text-xl" />; // default
}
export function formatFileSize(bytes) {
  if (bytes === 0 || bytes === "0" || bytes === undefined || bytes === null) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(2)} ${sizes[i]}`;
}
export function formatFileType(fullFileName) {
  const ext = fullFileName.split(".").pop().toLowerCase();

  if (["ppt", "pptx"].includes(ext)) return "Powerpoint File";
  if (["xlsx", "xls"].includes(ext)) return "Microsoft Excel";
  if (["doc", "docx"].includes(ext)) return "Microsoft World";
  if (["zip"].includes(ext)) return "ZIP File";
  if (["mp4", "mkv", "avi"].includes(ext)) return "Video File";
  if (["pdf"].includes(ext)) return "PDF Document";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext))
    return "Image File";
  if (["png"].includes(ext)) return "PNG File";

  return "Folder";
}
export function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12; // ubah 0 jadi 12

  return (
    <span className="flex gap-2">
      <p>{`${year}/${month}/${day}`}</p>
      <span className="text-[#e0e0e0] text-[16px]">|</span>
      <p>{`${hours}:${minutes} ${ampm}`}</p>
    </span>
  );
}
export function formatDatetime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Format tanggal: 28 November 2025
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Format jam: 11.02
  const formattedTime = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate} at ${formattedTime} WIB`;
}

export function isValidDateTime(dateString) {
  if (isEmpty(dateString)) {
    return false;
  }

  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!regex.test(dateString)) return false;

  const parsed = new Date(dateString);
  return isValid(parsed);
}

export function formatLastSeen(start, end) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();

  // Validasi tanggal robust
  if (!isValid(startDate) || !isValid(endDate)) {
    return "Invalid date format";
  }

  let diffSec = Math.floor((endDate - startDate) / 1000);

  // Jika end < start → anggap 0
  if (diffSec < 0) diffSec = 0;

  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  // 0–59 detik
  if (days === 0 && hours === 0 && minutes === 0) {
    return `${seconds} seconds ago`;
  }

  // Menit dan detik → mm:ss minutes ago
  if (days === 0 && hours === 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")} minutes ago`;
  }

  // Jika sudah lewat jam/hari → gunakan date-fns
  return formatDistanceToNowStrict(startDate, {
    addSuffix: true,
    now: endDate,
  });
}

// export function filterAndSortFiles(files, activeFilter) {
//   const isFolderFilter = activeFilter?.group?.label === 'Folders';
//   const searchQuery = activeFilter?.search?.toLowerCase() || '';

//   const filteredFiles = files.filter((file) => {
//     // Filter folder
//     if (isFolderFilter) return file.type_identifier.toLowerCase()=="folder";

//     // Filter ekstensi
//     if (activeFilter?.group?.extensions?.length > 0) {
//       const ext = file.name.split('.').pop().toLowerCase();
//       if (file.type_identifier.toLowerCase()!="folder" && activeFilter?.group?.extensions?.includes(ext)) {
//         return searchQuery ? file.name.toLowerCase().includes(searchQuery) : true;
//       }
//       return false;
//     }

//     // Filter search
//     return searchQuery ? file.name.toLowerCase().includes(searchQuery) : true;
//   });

//   // Sort folder ke atas
//   return [...filteredFiles].sort((a, b) => ((a.type_identifier.toLowerCase()=="folder") === (b.type_identifier.toLowerCase()=="folder") ? 0 : a.type_identifier.toLowerCase()=="folder" ? -1 : 1));
// }

export function filterAndSortFiles(files, activeFilter) {
  const isFolderFilter = activeFilter?.group?.label === "folder";
  const searchQuery = activeFilter?.search?.toLowerCase() || "";

  const filteredFiles = files.filter((file) => {
    const isFolder = file.type_identifier?.toLowerCase() === "folder";

    // Filter folder
    if (isFolderFilter) return isFolder;

    // Filter ekstensi
    if (activeFilter?.group?.extensions?.length > 0) {
      const ext = (file.extension || file.name.split(".").pop())?.toLowerCase();
      if (!isFolder && activeFilter.group.extensions.includes(ext)) {
        return searchQuery
          ? file.name.toLowerCase().includes(searchQuery)
          : true;
      }
      return false;
    }

    // Filter search
    return searchQuery ? file.name.toLowerCase().includes(searchQuery) : true;
  });

  // 🔥 SORT FIXED → Folder first, then alphabetical name
  return [...filteredFiles].sort((a, b) => {
    const aIsFolder = a.type_identifier?.toLowerCase() === "folder";
    const bIsFolder = b.type_identifier?.toLowerCase() === "folder";

    // 1) Folder ke atas
    if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;

    // 2) Urutkan nama secara alphabetical
    return a.name.localeCompare(b.name, "id", { sensitivity: "base" });
  });
}

export const isEmpty = (str) =>
  !str || str.trim().length === 0 || str === undefined || str === null;

export function buildHeaders(old, token, isjson = true) {
  let latitude = old.lat;
  let longitude = old.lng;

  // Extract ASN number: "AS24203 PT XL Axiata" → 24203
  let asnNumber = null;
  if (old.org) {
    const match = old.org.match(/AS(\d+)/i);
    if (match) asnNumber = match[1];
  }

  // Extract ISP: "AS24203 PT XL Axiata" → "PT XL Axiata"
  let isp = null;
  if (old.org) {
    const parts = old.org.split(" ");
    parts.shift(); // remove "AS24203"
    isp = parts.join(" ");
  }

  const base = {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    ip_address: old.ip || null,
    country: old.country || null,
    state: old.region || null,
    city: old.city || null,
    latitude: latitude,
    longitude: longitude,
    "asn-number": asnNumber,
    "asn-organization": old.org || null,
    isp: isp,
    "postal-code": old.postal || null,
  };

  // ONLY set JSON content-type if needed
  if (isjson) {
    base["Content-Type"] = "application/json";
  }

  return base;
}

export function getLabelByIdentifier(identifier, fileTypes = []) {
  const found = fileTypes.find((item) => item.identifier === identifier);
  return found ? found.label : "";
}
// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
