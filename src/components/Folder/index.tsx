'use client'
import { useState } from 'react'
import { Folder } from '../../interfaces'
import { useExplorer } from '../../context/Explorer'
import FileComponent from '../File'
import styles from './index.module.css'

interface FolderProps {
  folder: Folder
  parentFolderId?: string
}

const FolderComponent: React.FC<FolderProps> = ({
  folder,
  parentFolderId,
}) => {
  const { addFile, addFolder, deleteItem, toggleFolder } = useExplorer()
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState('')
  const [newFolderName, setNewFolderName] = useState('')

  const handleAddFile = () => {
    if (newFileName && newFileType) {
      addFile(folder.id, newFileName, newFileType)
      setNewFileName('')
      setNewFileType('')
    }
  }

  const handleAddFolder = () => {
    if (newFolderName) {
      addFolder(folder.id, newFolderName)
      setNewFolderName('')
    }
  }

  const handleDelete = (itemId: string, isFolder: boolean) => {
    deleteItem(folder.id, itemId, isFolder)
  }

  return (
    <div className={styles.folderContainer}>
      <div className={styles.folderHeader}>
        <span
          onClick={() => toggleFolder(folder.id)}
          className={styles.folderName}
        >
          {folder.isOpen ? '📂' : '📁'} {folder.name}
        </span>
        {parentFolderId && (
          <button
            className={styles.deleteButton}
            onClick={() => handleDelete(folder.id, true)}
          >
            Delete
          </button>
        )}
      </div>
      {folder.isOpen && (
        <div className={styles.folderContent}>
          <div className={styles.inputGroup}>
            <input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder='File name'
              className={styles.input}
            />
            <input
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
              placeholder='File type'
              className={styles.input}
            />
            <button className={styles.addButton} onClick={handleAddFile}>
              Add File
            </button>
          </div>
          <div className={styles.inputGroup}>
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder='Folder name'
              className={styles.input}
            />
            <button className={styles.addButton} onClick={handleAddFolder}>
              Add Folder
            </button>
          </div>
          {folder.files.map((file) => (
            <FileComponent
              key={file.id}
              file={file}
              onDelete={() => handleDelete(file.id, false)}
            />
          ))}
          {folder.folders.map((subFolder) => (
            <FolderComponent
              key={subFolder.id}
              folder={subFolder}
              parentFolderId={folder.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FolderComponent
