import { getFileIcon } from '@src/Common/Utils';
import { useFileManager } from '../Providers/FileManagerProvider';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { filterAndSortFiles } from '@/Common/Utils';
import { useEffect } from 'react';

function FileGridView({ lists, folderKeys, mode, isLoading=false }) {
  // const { 
  //     activeFilter, 
  //     getFileDirectory,
  //   } = useFileManager();

  // let files = getFileDirectory(lists, folderKeys);
  if(mode=="Folders"){
    lists = lists.filter((f) => f.type_identifier.toLowerCase()=="folder")
  } else if(mode=="Files"){
    lists = lists.filter((f) => f.type_identifier.toLowerCase()!="folder")
  } 
  // else{
  //   files = files.filter((f) => f.name.toLowerCase().includes(activeFilter.search.toLowerCase()))
  // }

  // const sortedFiles = filterAndSortFiles(lists, activeFilter, mode);

  useEffect(()=>{
    console.log(lists)
  },[lists]);

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
    >
      {isLoading?
        <>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="skeleton h-16 flex flex-row gap-2 bg-[#7979790D] p-4 rounded shadow-md transition cursor-pointer flex flex-col items-center text-center">
            </div>
          ))}
        </> : 
        (lists??[]).map((file, index) =>
          file.type_identifier.toLowerCase()==="folder" ? (
            <NavLink
              key={index}
              to={file.type_identifier.toLowerCase()=="folder"? `/dashboard/${encodeURIComponent(folderKeys!=file.parent_id? file.parent_id:file.id)}`:`#`}
              className="flex flex-row gap-2 bg-[#7979790D] p-4 rounded shadow-md hover:shadow-md transition cursor-pointer flex flex-col items-center text-center"
            >
              <div className="text-4xl">{getFileIcon(file.name, true)}</div>
              <div className="text-left text-[#1A1A1A] text-[13px] leading-[18px] font-inter font-medium truncate w-full">{file.name}</div>
            </NavLink>
          ) : (
            <div
              key={index}
              className="flex flex-row gap-2 bg-[#7979790D] p-4 rounded shadow-md hover:shadow-md transition cursor-pointer flex flex-col items-center text-center"
            >
              <div className="text-4xl">{getFileIcon(file.name, false)}</div>
              <div className="text-left text-[#1A1A1A] text-[13px] leading-[18px] font-inter font-medium truncate w-full">{file.name}</div>
            </div>
          )
        )
      }

      {(lists ?? []).length > 0 && lists.length < 4 &&
        Array.from({ length: 4 - lists.length }).map((_, i) => (
          <div key={uuidv4()}>
            &nbsp;
          </div>
        ))
      }
    </div>
  );
}

export default FileGridView;
