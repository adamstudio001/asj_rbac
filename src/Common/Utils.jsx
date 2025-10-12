import { CgFileDocument } from "react-icons/cg";
import Folder from "@assets/folder.svg";
import Images from "@assets/images.svg";
import Pdf from "@assets/pdf.svg";
import Png from "@assets/png.svg";
import Video from "@assets/video.svg";
import Xls from "@assets/xls.svg";
import Zip from "@assets/zip.svg";
import Document from "@assets/document.svg";

export function getFileIcon(fileName, isFolder = false, size=32) {
  if (isFolder) return <img src={Folder} alt="Folder" width={size} height={size} />;

  const ext = fileName.split('.').pop().toLowerCase();

  if (['ppt', 'pptx'].includes(ext)) return <img src={Document} alt="presentation" width={size} height={size} />;
  if (['xlsx', 'xls'].includes(ext)) return <img src={Xls} alt="Folder" width={size} height={size} />;
  if (['doc', 'docx', 'txt'].includes(ext)) return <img src={Document} alt="document" width={size} height={size} />;
  if (['mp3', 'zip'].includes(ext)) return<img src={Zip} alt="archive" width={size} height={size} />;
  if (['mp4', 'mkv', 'avi'].includes(ext)) return<img src={Video} alt="video" width={size} height={size} />;
  if (['pdf'].includes(ext)) return<img src={Pdf} alt="archive" width={size} height={size} />;
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return <img src={Images} alt="image" width={size} height={size} />;
  if (['png', 'svg'].includes(ext)) return <img src={Png} alt="ilustrate" width={size} height={size} />;

  return <CgFileDocument className="text-gray-400 text-xl" />; // default
}

export function getFileIconBig(fileName, isFolder = false) {
  if (isFolder) return <img src={Folder} alt="Folder" className="w-[10cqi]" />;

  const ext = fileName.split('.').pop().toLowerCase();

  if (['ppt', 'pptx'].includes(ext)) return <img src={Pp} alt="presentation" className="w-[10cqi]" />;
  if (['xlsx', 'xls'].includes(ext)) return <img src={Xls} alt="Folder" className="w-[10cqi]" />;
  if (['doc', 'docx', 'txt'].includes(ext)) return <img src={Document} alt="document" className="w-[10cqi]" />;
  if (['mp3', 'zip'].includes(ext)) return<img src={Zip} alt="archive" className="w-[10cqi]" />;
  if (['mp4', 'mkv', 'avi'].includes(ext)) return<img src={Video} alt="video" className="w-[10cqi]" />;
  if (['pdf'].includes(ext)) return<img src={Pdf} alt="archive" className="w-[10cqi]" />;
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return <img src={Images} alt="image" className="w-[10cqi]" />;
  if (['png', 'svg'].includes(ext)) return <img src={Png} alt="ilustrate" className="w-[10cqi]" />;

  return <CgFileDocument size={"100%"} className="text-gray-400 text-xl" />; // default
}
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(2)} ${sizes[i]}`;
}
export function formatFileType(fullFileName) {
  const ext = fullFileName.split('.').pop().toLowerCase();

  if (['ppt', 'pptx'].includes(ext)) return "Powerpoint File";
  if (['xlsx', 'xls'].includes(ext)) return "Microsoft Excel";
  if (['doc', 'docx'].includes(ext)) return "Microsoft World";
  if (['zip'].includes(ext)) return "ZIP File";
  if (['mp4', 'mkv', 'avi'].includes(ext)) return "Video File";
  if (['pdf'].includes(ext)) return "PDF Document";
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return "Image File";
  if (['png'].includes(ext)) return "PNG File";

  return "Folder";
}
export function formatDate(dateString){
  const date = new Date(dateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  
  hours = hours % 12 || 12; // ubah 0 jadi 12
  
  return `${year}/${month}/${day} at ${hours}:${minutes} ${ampm}`;
}