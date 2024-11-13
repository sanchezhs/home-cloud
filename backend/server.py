import os
import base64
from datetime import datetime
from os.path import isfile
from zipfile import ZipFile
from typing import List
from io import BytesIO
from backend.interfaces.interfaces import File as IFile
from backend.database.database import Database
from fastapi import FastAPI, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todas las cabeceras
)


@app.get("/", response_model=List[IFile])
def get_files():
    if not os.path.exists("files/"):
        os.makedirs("files/")
        return []
    return Database().get_all_files()


# @app.get("/{file_id}", response_model=IFile)
# def get_file(file_id: int):
#    file = Database().get_file_by_id(file_id)
#    if not file:
#        raise HTTPException(status_code=404, detail=f'File "{file_id}" not found.')
#    return file


@app.get("/{file_name}", response_model=str)
def get_file(file_name: str):
    content = Database().get_file_by_name(file_name)
    if not content:
        raise HTTPException(status_code=404, detail="File not found.")
    return content


@app.post("/", response_model=List[IFile])
async def add_files(files: List[UploadFile]):
    db = Database()
    uploaded_files = []

    for file in files:
        content = await file.read()

        if file.content_type and "zip" in file.content_type.split("/"):
            with ZipFile(BytesIO(content)) as zip_file:
                for name in zip_file.namelist():
                    with zip_file.open(name) as extracted_file:
                        if name.endswith("/"):
                            continue
                        extracted_content = extracted_file.read()
                        file_name = name.split("/")[-1]
                        new_file = IFile(
                            file_name=file_name,
                            last_modified=datetime.now(),
                            uploaded_at=datetime.now(),
                            size=len(extracted_content),
                            mimeType="application/octet-stream",
                            path=name,
                            content=base64.b64encode(extracted_content),
                        )
                        uploaded_files.append(db.add_file(new_file))
        else:
            new_file = IFile(
                file_name=file.filename,
                last_modified=datetime.now(),
                uploaded_at=datetime.now(),
                size=len(content),
                mimeType=file.content_type,
                path=file.filename,
                content=content,
            )
            uploaded_files.append(db.add_file(new_file))

    return uploaded_files


# @app.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_file_by_id(file_id: int):
#    Database().delete_file_by_id(file_id)


@app.delete("/{file_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file_by_name(file_name: str):
    Database().delete_file_by_name(file_name)
