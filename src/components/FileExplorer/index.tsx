// 'use client'
// import styles from './index.module.css'
// import { FileExplorerContext, FileItem } from '../../context/Explorer'
// import { useContext, useState, useRef, useEffect } from 'react'
// import FolderItem from '../FolderItem'
// import FileItemComponent from '../FileItem'

// const FileExplorer = () => {
//   const { structure, addFolder, addFile } = useContext(FileExplorerContext)
//   const [selectedItem, setSelectedItem] = useState<string | null>('Root')
//   const [newItemName, setNewItemName] = useState<string>('')
//   const [isAdding, setIsAdding] = useState<'folder' | 'file' | null>(null)
//   const inputRef = useRef<HTMLInputElement>(null)

//   const AddFolder = () => {
//     setIsAdding('folder')
//     setNewItemName('')
//   }

//   const AddFile = () => {
//     setIsAdding('file')
//     setNewItemName('')
//   }

//   const SaveItem = () => {
//     if (!newItemName) return

//     const nameWithExtension =
//       isAdding === 'file' && !newItemName.includes('.')
//         ? `${newItemName}.txt`
//         : newItemName

//     if (isAdding === 'folder' && selectedItem) {
//       addFolder(nameWithExtension, selectedItem)
//     } else if (isAdding === 'file' && selectedItem) {
//       addFile(nameWithExtension, selectedItem)
//     }

//     setNewItemName('')
//     setIsAdding(null)
//   }

//   const Cancel = () => {
//     setNewItemName('')
//     setIsAdding(null)
//   }

//   const renderStructure = (structure: FileItem[], depth: number = 0) => (
//     <ul className={styles.list}>
//       {structure.map((item) =>
//         item.type === 'folder' ? (
//           <FolderItem
//             key={item.name}
//             item={item}
//             depth={depth}
//             selectedItem={selectedItem}
//             setSelectedItem={setSelectedItem}
//             setNewItemName={setNewItemName}
//             setIsAdding={setIsAdding}
//           />
//         ) : (
//           <FileItemComponent
//             key={item.name}
//             item={item}
//             depth={depth}
//             selectedItem={selectedItem}
//             setSelectedItem={setSelectedItem}
//           />
//         )
//       )}
//     </ul>
//   )

//   useEffect(() => {
//     if (isAdding && inputRef.current) {
//       inputRef.current.focus()
//     }
//   }, [isAdding])

//   return (
//     <div className={styles.container}>
//       <div className={styles.toolbar}>
//         <button onClick={AddFolder}>Add Folder</button>
//         <button onClick={AddFile}>Add File</button>
//       </div>
//       <div className={styles.structure}>{renderStructure(structure)}</div>
//       {isAdding && (
//         <div className={styles.newItemInput}>
//           <input
//             type='text'
//             value={newItemName}
//             onChange={(e) => setNewItemName(e.target.value)}
//             placeholder={`Enter ${isAdding} name`}
//             ref={inputRef}
//           />
//           <button className={styles.save} onClick={SaveItem}>
//             Save
//           </button>
//           <button className={styles.cancel} onClick={Cancel}>
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default FileExplorer
'use client'
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

  const SaveItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!inputRef.current?.value || !selectedItem) return

    let name = inputRef.current.value.trim()

    if (isAdding === 'file' && !name.includes('.')) name += '.txt'

    const doesItemExistInFolder = (
      folder: FileItem,
      nameToCheck: string
    ): boolean => {
      if (folder.name === selectedItem) {
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
      ? addFolder(finalName, selectedItem)
      : addFile(finalName, selectedItem)

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
      <div className={styles.toolbar}>
        <button onClick={() => setIsAdding('folder')}>Add Folder</button>
        <button onClick={() => setIsAdding('file')}>Add File</button>
      </div>
      <div className={styles.structure}>
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
      </div>
      {isAdding && (
        <div className={styles.newItemInput}>
          <input
            type='text'
            placeholder={`Enter ${isAdding} name`}
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
  )
}

export default FileExplorer
