// src/components/FileManager.tsx
import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IFile } from '../App';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

function FileManager({ files, setFiles }: { files: IFile[], setFiles: React.Dispatch<React.SetStateAction<IFile[]>> }) {

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const response = await axios.get('http://localhost:8000/');
    const filesData: IFile[] = response.data.map((file: any, index: number) => ({
      id: file.id,
      fileName: file.file_name,
      lastModified: file.last_modified,
      uploadedAt: file.uploaded_at,
      size: file.size,
      mimeType: file.mimeType,
      path: file.path,
      content: file.content,
    }));
    setFiles(filesData);
  };

  const buildDirectoryTreeItem = (files: IFile[]): TreeViewBaseItem[] => {
    const root: TreeViewBaseItem[] = [];

    files.forEach((file) => {
      const parts = file.path?.split('/');
      let currentLevel: TreeViewBaseItem[] = root;

      parts?.forEach((part, index) => {
        const existingNode = currentLevel.find(node => node.label === part);

        if (existingNode) {
          currentLevel = existingNode.children;
        } else {
          const newNode = {
            id: parts.slice(0, index + 1).join('/'),
            label: part,
            children: [],
          };
          currentLevel.push(newNode);

          if (index === parts.length - 1) {
            delete newNode.children;
          } else {
            currentLevel = newNode.children;
          }
        }
      });
    });

    return root;
  };

  const handleDelete = async (fileName: string) => {
    await axios.delete(`http://localhost:8000/${fileName}`);
    fetchFiles();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fileName', headerName: 'File Name', width: 150 },
    { field: 'size', headerName: 'Size (bytes)', width: 150 },
    { field: 'lastModified', headerName: 'Last Modified', width: 180 },
    { field: 'path', headerName: 'Path', width: 160 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            edge="end"
            aria-label="download"
            href={`http:localhost:8000/${params.row.id}`}
            download
          >
            <DownloadIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ minHeight: 1000, minWidth: 750 }}>
      <RichTreeView items={buildDirectoryTreeItem(files)} />
    </Box>
  );

  //return (
  //  <Box>
  //    <Box sx={{ height: 400, width: '100%' }}>
  //      <DataGrid
  //        rows={files}
  //        columns={columns}
  //      />
  //    </Box>
  //  </Box>
  //);
};

export default FileManager;

