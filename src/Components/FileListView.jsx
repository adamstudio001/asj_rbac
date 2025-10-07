import { getFileIcon } from '@src/Common/Utils';
import { useFileManager } from '../Providers/FileManagerProvider';
import { NavLink } from 'react-router-dom';

function FileListView({ folderKeys, mode }) {
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
    <div className="bg-transparent divide-y divide-[#e0e0e0] rounded shadow">
      {sortedFiles.map((file, index) => (
        file.isFolder? 
        <NavLink key={index} to={`/filemanager/${file.folderKeys}`} className="flex items-center px-4 py-3 hover:bg-gray-50 transition">
          <div className="text-2xl w-10">{getFileIcon(file.name, file.isFolder)}</div>
          <div className="ml-4 text-sm font-medium">{file.name}</div>
        </NavLink> : 
        <div key={index} className="flex items-center px-4 py-3 hover:bg-gray-50 transition">
          <div className="text-2xl w-10">{getFileIcon(file.name, file.isFolder)}</div>
          <div className="ml-4 text-sm font-medium">{file.name}</div>
        </div>
      ))}
    </div>
  );
}

export default FileListView;