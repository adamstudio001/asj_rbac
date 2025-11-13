import { getFileIcon } from '@src/Common/Utils';
import { useFileManager } from '../Providers/FileManagerProvider';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { filterAndSortFiles } from '@/Common/Utils';

function FileGridView({ lists, folderKeys, mode }) {
  const { 
      activeFilter, 
      getFileDirectory,
    } = useFileManager();

  let files = getFileDirectory(lists, folderKeys);
  if(mode=="Folders"){
    files = files.filter((f) => f.isFolder)
  } else if(mode=="Files"){
    files = files.filter((f) => !f.isFolder)
  } else{
    files = files.filter((f) => f.name.toLowerCase().includes(activeFilter.search.toLowerCase()))
  }

  const sortedFiles = filterAndSortFiles(files, activeFilter, mode);

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
    >
      {sortedFiles.map((file, index) =>
        file.isFolder ? (
          <NavLink
            key={index}
            to={`/dashboard/${encodeURIComponent(file.folderKeys)}`}
            className="flex flex-row gap-2 bg-[#7979790D] p-4 rounded shadow-md hover:shadow-md transition cursor-pointer flex flex-col items-center text-center"
          >
            <div className="text-4xl">{getFileIcon(file.name, file.isFolder)}</div>
            <div className="text-left text-[#1A1A1A] text-[13px] leading-[18px] font-inter font-medium truncate w-full">{file.name}</div>
          </NavLink>
        ) : (
          <div
            key={index}
            className="flex flex-row gap-2 bg-[#7979790D] p-4 rounded shadow-md hover:shadow-md transition cursor-pointer flex flex-col items-center text-center"
          >
            <div className="text-4xl">{getFileIcon(file.name, file.isFolder)}</div>
            <div className="text-left text-[#1A1A1A] text-[13px] leading-[18px] font-inter font-medium truncate w-full">{file.name}</div>
          </div>
        )
      )}

      {sortedFiles.length > 0 && sortedFiles.length < 4 &&
        Array.from({ length: 4 - sortedFiles.length }).map((_, i) => (
          <div key={uuidv4()}>
            &nbsp;
          </div>
        ))
      }
    </div>
  );
}

export default FileGridView;
