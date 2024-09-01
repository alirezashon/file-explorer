import { FileExplorerContextProps, FileItem } from '@/interface'
import { createContext, useState, ReactNode } from 'react'

export const FileExplorerContext = createContext<FileExplorerContextProps>({
  structure: [],
  addFolder: () => {},
  addFile: () => {},
  deleteItem: () => {},
})

export const FileExplorerProvider = ({ children }: { children: ReactNode }) => {
  const [structure, setStructure] = useState<FileItem[]>([
    { name: 'Root', type: 'folder', children: [] },
  ])

  const ensureRootFolderExists = (items: FileItem[]): FileItem[] => {
    if (items.length === 0 || !items.some((item) => item.name === 'Root')) {
      return [{ name: 'Root', type: 'folder', children: [] }]
    }
    return items
  }

  const updateStructure = (
    items: FileItem[],
    name: string,
    parent: string,
    type: 'folder' | 'file'
  ): FileItem[] =>
    items.map((item) => {
      if (item.name === parent && item.type === 'folder') {
        return {
          ...item,
          children: [
            ...(item.children || []),
            type === 'folder'
              ? { name, type: 'folder', children: [] }
              : { name, type: 'file' },
          ],
        }
      }
      return item.children
        ? {
            ...item,
            children: updateStructure(item.children, name, parent, type),
          }
        : item
    })

  const addItem = (name: string, parent: string, type: 'folder' | 'file') => {
    setStructure((prevStructure) => {
      const updatedStructure = ensureRootFolderExists(prevStructure)

      return parent === 'Root'
        ? [
            {
              ...updatedStructure[0],
              children: [
                ...(updatedStructure[0].children || []),
                type === 'folder'
                  ? { name, type: 'folder', children: [] }
                  : { name, type: 'file' },
              ],
            },
          ]
        : updateStructure(updatedStructure, name, parent, type)
    })
  }

  const addFolder = (name: string, parent: string) =>
    addItem(name, parent, 'folder')

  const addFile = (name: string, parent: string) =>
    addItem(name, parent, 'file')

  const deleteItem = (name: string) => {
    const deleteRecursively = (items: FileItem[]): FileItem[] =>
      items
        .filter((item) => item.name !== name)
        .map((item) =>
          item.children
            ? { ...item, children: deleteRecursively(item.children) }
            : item
        )

    setStructure((prevStructure) => {
      const updatedStructure = deleteRecursively(prevStructure)
      return ensureRootFolderExists(updatedStructure)
    })
  }

  return (
    <FileExplorerContext.Provider
      value={{ structure, addFolder, addFile, deleteItem }}
    >
      {children}
    </FileExplorerContext.Provider>
  )
}
