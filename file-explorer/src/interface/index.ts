export interface FileItem {
  name: string
  type: 'file' | 'folder'
  children?: FileItem[]
}

export interface FileExplorerContextProps {
  structure: FileItem[]
  addFolder: (name: string, parent: string) => void
  addFile: (name: string, parent: string) => void
  deleteItem: (name: string) => void
}
export interface FolderItemProps {
  item: FileItem
  depth: number
  selectedItem: string | null
  setSelectedItem: (name: string) => void
  setIsAdding: (type: 'folder' | 'file' | null) => void
}

export interface FileItemProps {
  item: FileItem
  depth: number
  selectedItem: string | null
  setSelectedItem: (name: string) => void
}
