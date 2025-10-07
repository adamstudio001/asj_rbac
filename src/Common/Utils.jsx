import { FaFolder } from "react-icons/fa";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";
import { GoDatabase } from "react-icons/go";
import { CgFileDocument } from "react-icons/cg";
import { BsFileEarmarkZip } from "react-icons/bs";
import { SlPicture } from "react-icons/sl";

export function getFileIcon(fileName, isFolder = false) {
  if (isFolder) return <FaFolder className="text-blue-500 text-xl" />;

  const ext = fileName.split('.').pop().toLowerCase();

  if (['ppt', 'pptx'].includes(ext)) return <HiOutlinePresentationChartLine className="text-orange-500 text-xl" />;
  if (['xlsx', 'xls'].includes(ext)) return <GoDatabase className="text-green-600 text-xl" />;
  if (['doc', 'docx', 'txt'].includes(ext)) return <CgFileDocument className="text-gray-600 text-xl" />;
  if (['pdf', 'mp3', 'zip'].includes(ext)) return <BsFileEarmarkZip className="text-red-500 text-xl" />;
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return <SlPicture className="text-purple-400 text-xl" />;

  return <CgFileDocument className="text-gray-400 text-xl" />; // default
}

export function getFileIconBig(fileName, isFolder = false) {
  if (isFolder) return <FaFolder size={"100%"} className="text-blue-500 text-xl" />;

  const ext = fileName.split('.').pop().toLowerCase();

  if (['ppt', 'pptx'].includes(ext)) return <HiOutlinePresentationChartLine size={"100%"} className="text-orange-500 text-xl" />;
  if (['xlsx', 'xls'].includes(ext)) return <GoDatabase size={"100%"} className="text-green-600 text-xl" />;
  if (['doc', 'docx', 'txt'].includes(ext)) return <CgFileDocument size={"100%"} className="text-gray-600 text-xl" />;
  if (['pdf', 'mp3', 'zip'].includes(ext)) return <BsFileEarmarkZip size={"100%"} className="text-red-500 text-xl" />;
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return <SlPicture size={"100%"} className="text-purple-400 text-xl" />;

  return <CgFileDocument size={"100%"} className="text-gray-400 text-xl" />; // default
}