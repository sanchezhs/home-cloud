import axios from "axios";
import { IFile } from "../App";

export default class AppState {
  private static instance: AppState;
  private baseUrl: string = 'http://localhost:8000';
  public files: IFile[];
  public setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
  public filteredFiles: IFile[];
  public setFilteredFiles: React.Dispatch<React.SetStateAction<IFile[]>>;


  static getInstance(
    files: IFile[],
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    filteredFiles: IFile[],
    setFilteredFiles: React.Dispatch<React.SetStateAction<IFile[]>>
  ) {
    if (!AppState.instance) {
      AppState.instance = new AppState(files, setFiles, filteredFiles, setFilteredFiles);
    }
    return AppState.instance;
  }

  constructor(
    files: IFile[],
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    filteredFiles: IFile[],
    setFilteredFiles: React.Dispatch<React.SetStateAction<IFile[]>>
  ) {
    this.files = files;
    this.setFiles = setFiles;
    this.filteredFiles = filteredFiles;
    this.setFilteredFiles = setFilteredFiles;
  }

  async fetchFiles() {
    const response = await axios.get(`${this.baseUrl}/`);
    const filesData: IFile[] = response.data.map((file: any) => ({
      id: file.id,
      fileName: file.file_name,
      lastModified: file.last_modified,
      uploadedAt: file.uploaded_at,
      size: file.size,
      mimeType: file.mimeType,
      path: file.path,
      content: file.content,
    }));
    this.setFiles(filesData);
    this.setFilteredFiles(filesData);
  }

  async uploadFiles(filesToUpload: File[]) {
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${this.baseUrl}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const uploadedFiles = response.data;
      const newFiles = uploadedFiles.map((file: any) => ({
        id: file.id,
        fileName: file.file_name,
        lastModified: file.last_modified,
        uploadedAt: file.uploaded_at,
        mimeType: file.mimeType,
        size: file.size,
        path: file.path,
        content: file.content,
      }));

      this.setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      this.setFilteredFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.error('ERROR uploading files: ', error);
    }
  }

  async fetchFile(fileName: string) {
    const response = await axios.get(`${this.baseUrl}/${fileName}`)
    return atob(response.data);
  }

  async deleteFileByName(fileName: string) {
    await axios.delete(`${this.baseUrl}/${fileName}`)
    this.fetchFiles();
  }

}
