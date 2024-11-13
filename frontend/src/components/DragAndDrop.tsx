import React, { useRef, useState } from 'react';
import { IFile } from '../App';
import AppState from '../api/axios';

type DragAndDropProps = {
  appState: AppState
}

function DragAndDrop({ appState }: DragAndDropProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setDroppedFiles(droppedFiles);
    appState.uploadFiles(droppedFiles);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setDroppedFiles(droppedFiles);
      appState.uploadFiles(selectedFiles)
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #777',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: isDragging ? '#333' : '#424242',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <p>{isDragging ? 'Drop your files here...' : 'Drag and drop, or click to select a file'}</p>
      <ul>
        {droppedFiles.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple
      />
    </div>
  );
};

export default DragAndDrop;

