// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { IFile } from '../App';

type SearchBarProps = {
  files: IFile[],
  setFilteredFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
}

function SearchBar({ files, setFilteredFiles }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: any) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter((file) =>
        file.path?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  };

  return (
    <TextField
      label="Search files"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={handleSearch}
    />
  );

};

export default SearchBar;

