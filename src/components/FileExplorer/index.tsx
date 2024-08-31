import styles from './index.module.css'
import { FileExplorerContext } from '../../context/Explorer'
import { useContext, useState, useRef, useEffect } from 'react'
import FolderItem from '../FolderItem'
import FileItemComponent from '../FileItem'
import { FileItem } from '@/interface'

const FileExplorer = () => {
  const { structure, addFolder, addFile } = useContext(FileExplorerContext)
  const [selectedItem, setSelectedItem] = useState<string | null>('Root')
  const [isAdding, setIsAdding] = useState<'folder' | 'file' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const findParentFolder = (
    items: FileItem[],
    itemName: string
  ): string | null => {
    for (const item of items) {
      if (item.children?.some((child) => child.name === itemName)) {
        return item.name
      }
      if (item.children) {
        const parent = findParentFolder(item.children, itemName)
        if (parent) return parent
      }
    }
    return null
  }

  const getSelectedFolder = () => {
    if (!selectedItem) return null

    const selectedItemIsFile = structure.some((folder) =>
      folder.children?.some((child) => child.name === selectedItem && child.type === 'file')
    )

    if (selectedItemIsFile) {
      const parentFolder = findParentFolder(structure, selectedItem)
      return parentFolder || 'Root'
    }

    return selectedItem
  }

  const SaveItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!inputRef.current?.value) return

    let name = inputRef.current.value.trim()

    if (isAdding === 'file' && !name.includes('.')) name += '.txt'

    const selectedFolder = getSelectedFolder()
    if (!selectedFolder) return

    const doesItemExistInFolder = (
      folder: FileItem,
      nameToCheck: string
    ): boolean => {
      if (folder.name === selectedFolder) {
        return (
          folder.children?.some(
            (item) => item.name === nameToCheck && item.type === isAdding
          ) ?? false
        )
      }
      return (
        folder.children?.some(
          (child) =>
            child.type === 'folder' && doesItemExistInFolder(child, nameToCheck)
        ) ?? false
      )
    }

    let finalName = name,
      counter = 1

    while (
      structure.some((folder) => doesItemExistInFolder(folder, finalName))
    ) {
      const [base, ext] =
        isAdding === 'file' && name.includes('.')
          ? name.split(/(?=\.[^.]+$)/)
          : [name, '']
      finalName = `${base}${counter++}${ext}`
    }

    isAdding === 'folder'
      ? addFolder(finalName, selectedFolder)
      : addFile(finalName, selectedFolder)

    inputRef.current.value = ''
    setIsAdding(null)
  }

  const Cancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (inputRef.current) inputRef.current.value = ''
    setIsAdding(null)
  }

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  return (
    <div className={styles.container}>
      <div className={styles.structure}>
        <div className={styles.toolbar}>
          <i
            onClick={() => setIsAdding('file')}
            title='Add File'
            className={`${styles.addFile} fa-solid fa-file-circle-plus`}
            aria-hidden='true'
          ></i>

          <i
            onClick={() => setIsAdding('folder')}
            className={`${styles.addFolder} fa-solid fa-folder-plus`}
            title='Add Folder'
            aria-hidden='true'
          ></i>
        </div>
        <ul className={styles.list}>
          {structure.map((item) =>
            item.type === 'folder' ? (
              <FolderItem
                key={item.name}
                item={item}
                depth={1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                setIsAdding={setIsAdding}
              />
            ) : (
              <FileItemComponent
                key={item.name}
                item={item}
                depth={1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )
          )}
        </ul>
        {isAdding && (
          <div className={styles.newItemInput}>
            <input
              type='text'
              placeholder={`Enter ${isAdding} name`}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                SaveItem(e as unknown as React.MouseEvent<HTMLButtonElement>)
              }
              ref={inputRef}
            />
            <button className={styles.save} onClick={SaveItem}>
              Save
            </button>
            <button className={styles.cancel} onClick={Cancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileExplorer
