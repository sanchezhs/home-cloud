from typing import List, Optional
from datetime import datetime
from backend.interfaces.interfaces import File as IFile
from os.path import isfile
from threading import Lock
import sqlite3

DB_NAME = "files.db"


class SingletonMeta(type):
    """
    This is a thread-safe implementation of Singleton.
    (Stolen from https://refactoring.guru/es/design-patterns/singleton/python/example#example-1)
    """

    _instances = {}
    _lock: Lock = Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance
        return cls._instances[cls]


class Database:
    def __init__(self) -> None:
        self.db = self.init_db()

    def init_db(self):
        db_exists = isfile(f"database/{DB_NAME}")
        self.db = sqlite3.connect(f"database/{DB_NAME}")
        cursor = self.db.cursor()
        if not db_exists:
            cursor.execute(
                """
                    CREATE TABLE IF NOT EXISTS File (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        file_name TEXT NOT NULL,
                        last_modified DATETIME NOT NULL,
                        uploaded_at DATETIME NOT NULL,
                        size INTEGER NOT NULL,
                        mimeType TEXT,
                        path TEXT,
                        content BLOB
                    );
                """
            )
            self.db.commit()
        return self.db

    def get_all_files(self) -> List[IFile]:
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT id, file_name, last_modified, uploaded_at, size, mimeType, path, content FROM File"
        )
        rows = cursor.fetchall()
        files = [
            IFile(
                id=row[0],
                file_name=row[1],
                last_modified=datetime.fromisoformat(row[2]),
                uploaded_at=datetime.fromisoformat(row[3]),
                size=row[4],
                mimeType=row[5],
                path=row[6],
                content=row[7],
            )
            for row in rows
        ]
        return files

    def get_file_by_name(self, name: str) -> Optional[str]:
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT content FROM File WHERE file_name = ?",
            (name,),
        )
        row = cursor.fetchone()
        if row:
            return row[0]
        return None

    def get_file_by_id(self, id: int) -> Optional[IFile]:
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT id, file_name, last_modified, uploaded_at, size, mimeType, path, content FROM File WHERE id = ?",
            (id,),
        )
        row = cursor.fetchone()
        if row:
            return IFile(
                id=row[0],
                file_name=row[1],
                last_modified=datetime.fromisoformat(row[2]),
                uploaded_at=datetime.fromisoformat(row[3]),
                size=row[4],
                mimeType=row[5],
                path=row[6],
                content=row[7],
            )
        return None

    def add_file(self, file: IFile):
        cursor = self.db.cursor()
        cursor.execute(
            """
            INSERT INTO File (file_name, last_modified, uploaded_at, size, mimeType, path, content)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                file.file_name,
                file.last_modified.isoformat(),
                file.uploaded_at.isoformat(),
                file.size,
                file.mimeType,
                file.path,
                file.content,
            ),
        )
        self.db.commit()
        if cursor.lastrowid:
            return self.get_file_by_id(cursor.lastrowid)
        else:
            raise Exception(f'File ID "{cursor.lastrowid}" is none')

    def delete_all_files(self):
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM File")
        self.db.commit()

    def delete_file_by_id(self, id: int):
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM File WHERE id = ?", (id,))
        self.db.commit()

    def delete_file_by_name(self, name: str):
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM File WHERE file_name = ?", (name,))
        self.db.commit()
