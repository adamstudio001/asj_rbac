import { getFileIcon } from '@src/Common/Utils';
import { useFileManager } from '../Providers/FileManagerProvider';
import { NavLink } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/Tooltip"
import { filterAndSortFiles } from '@/Common/Utils';

function FileListView({ lists, folderKeys, mode, isLoading=false }) {
  // const { 
  //     activeFilter, 
  //     getFileDirectory,
  //   } = useFileManager();

  // let files = getFileDirectory(lists, folderKeys);
  // if(mode=="Folders"){
  //   files = files.filter((f) => f.isFolder)
  // } else if(mode=="Files"){
  //   files = files.filter((f) => !f.isFolder)
  // } else{
  //   files = files.filter((f) => f.name.toLowerCase().includes(activeFilter.search.toLowerCase()))
  // }

  // const sortedFiles = filterAndSortFiles(lists, activeFilter, mode);

  return (
    <div className="bg-transparent divide-y divide-[#e0e0e0] rounded shadow">
      {
        isLoading?
        <>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="skeleton h-16 flex items-center px-4 py-3 transition mb-2"></div>
          ))}
        </> : 
        //`/dashboard/${encodeURIComponent(file.folderKeys)}`
        (lists.map((file, index) => (
          file.type_identifier.toLowerCase()==="folder"? 
          <NavLink key={index} to={`#`} className="flex items-center px-4 py-3 hover:bg-gray-50 transition">
            <div className="text-2xl w-10">{getFileIcon(file.name, true, 24)}</div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="flex-1 ml-4 text-left text-[#1A1A1A] text-[13px] leading-[18px] font-inter font-medium line-clamp-1">{file.name}</p>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  {file.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </NavLink> : 
          <div key={index} className="flex items-center px-4 py-3 hover:bg-gray-50 transition">
            <div className="text-2xl w-10">{getFileIcon(file.name, false, 24)}</div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="flex-1 ml-4 text-left text-[#1A1A1A] text-[13px] leading-[18px] font-inter font-medium line-clamp-1">{file.name}</p>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  {file.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )))
      }
    </div>
  );
}

export default FileListView;