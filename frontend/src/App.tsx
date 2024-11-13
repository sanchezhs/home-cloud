import './App.css'
import { useState, useEffect } from 'react';
import AppState from './api/axios';
import FileExplorer from './components/FileExplorer';
import SearchBar from './components/SearchBar';
import DragAndDrop from './components/DragAndDrop';
import Grid from '@mui/material/Grid2';
import { Container } from '@mui/material';


export interface IFile {
  id?: number;
  fileName: string;
  lastModified: Date;
  uploadedAt: Date;
  size: number;
  mimeType?: string;
  path?: string;
  content?: Uint8Array
}

function App() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<IFile[]>([]);
  const appState = AppState.getInstance(files, setFiles, filteredFiles, setFilteredFiles);

  useEffect(() => {
    appState.fetchFiles();
  }, [appState]);

  return (
    <Container sx={{ flexGrow: 1, padding: 4 }}>
      <Grid container spacing={2} direction="column">
        <Grid >
          <SearchBar files={files} setFilteredFiles={setFilteredFiles} />
        </Grid>
        <Grid >
          <FileExplorer files={filteredFiles} appState={appState} />
        </Grid>
        <Grid >
          <DragAndDrop appState={appState} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App
