import { FileExplorerContextProps, FileItem } from '@/interface'
import React, { createContext, useState, ReactNode } from 'react'

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
      return parent === 'Root'
        ? [
            {
              ...prevStructure[0],
              children: [
                ...(prevStructure[0].children || []),
                type === 'folder'
                  ? { name, type: 'folder', children: [] }
                  : { name, type: 'file' },
              ],
            },
          ]
        : updateStructure(prevStructure, name, parent, type)
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

    setStructure((prevStructure) => deleteRecursively(prevStructure))
  }

  return (
    <FileExplorerContext.Provider
      value={{ structure, addFolder, addFile, deleteItem }}
    >
      {children}
    </FileExplorerContext.Provider>
  )
}
