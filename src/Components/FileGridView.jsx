import { getFileIcon } from '@src/Common/Utils';
import { useFileManager } from '../Providers/FileManagerProvider';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function FileGridView({ folderKeys, mode }) {
  const { 
      activeFilter, 
      getFileDirectory,
    } = useFileManager();

  let files = getFileDirectory(folderKeys);
  if(mode=="Folders"){
    files = files.filter((f) => f.isFolder)
  } else if(mode=="Files"){
    files = files.filter((f) => !f.isFolder)
  } else{
    files = files.filter((f) => f.name.toLowerCase().includes(activeFilter.search.toLowerCase()))
  }

  console.log(folderKeys, mode, activeFilter)
  const isFolderFilter = activeFilter.group?.label === 'Folders';
  const searchQuery = activeFilter.search?.toLowerCase() || ''; // Ambil search query dan ubah ke lowercase

  // Filter berdasarkan folder, ekstensi, dan pencarian
  const filteredFiles = files.filter((file) => {
    // Filter berdasarkan folder
    if (isFolderFilter) return file.isFolder;

    // Filter berdasarkan ekstensi file
    if (activeFilter.group?.extensions?.length > 0) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!file.isFolder && activeFilter.group.extensions.includes(ext)) {
        // Jika ada filter ekstensi, lanjutkan ke pencarian
        return searchQuery ? file.name.toLowerCase().includes(searchQuery) : true;
      }
      return false;
    }

    // Filter berdasarkan pencarian
    return searchQuery ? file.name.toLowerCase().includes(searchQuery) : true;
  });

  // Sort folder ke atas
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (a.isFolder === b.isFolder) return 0;
    return a.isFolder ? -1 : 1;
  });

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
    >
      {sortedFiles.map((file, index) =>
        file.isFolder ? (
          <NavLink
            key={index}
            to={`/filemanager/${file.folderKeys}`}
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
