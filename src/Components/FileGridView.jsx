import { getFileIcon } from '@src/Common/Utils';

function FileGridView({ files, activeFilter }) {
  console.log(activeFilter)
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
    <div className="grid grid-cols-4 gap-4">
      {sortedFiles.map((file, index) => (
        <div key={index} className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer">
          <div className="text-4xl mb-2">{getFileIcon(file.name, file.isFolder)}</div>
          <div className="text-sm font-medium truncate">{file.name}</div>
        </div>
      ))}
    </div>
  );
}

export default FileGridView;
