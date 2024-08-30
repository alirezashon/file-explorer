import React, { createContext, useState, ReactNode } from 'react';

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

interface FileExplorerContextProps {
  structure: FileItem[];
  addFolder: (name: string, parent?: string) => void;
  addFile: (name: string, parent?: string) => void;
  deleteItem: (name: string) => void;
}

export const FileExplorerContext = createContext<FileExplorerContextProps>({
  structure: [],
  addFolder: () => {},
  addFile: () => {},
  deleteItem: () => {},
});

export const FileExplorerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [structure, setStructure] = useState<FileItem[]>([
    { name: 'Root', type: 'folder', children: [] },
  ]);

  const addFolder = (name: string, parent: string = 'Root') => {
    const updateStructure = (items: FileItem[]): FileItem[] =>
      items.map((item) => {
        if (item.name === parent && item.type === 'folder') {
          return {
            ...item,
            children: [
              ...(item.children || []),
              { name, type: 'folder', children: [] },
            ],
          };
        }
        return item.children
          ? { ...item, children: updateStructure(item.children) }
          : item;
      });

    setStructure((prevStructure) => {
      return parent === 'Root'
        ? [
            {
              ...prevStructure[0],
              children: [
                ...(prevStructure[0].children || []),
                { name, type: 'folder', children: [] },
              ],
            },
          ]
        : updateStructure(prevStructure);
    });
  };

  const addFile = (name: string, parent: string = 'Root') => {
    const updateStructure = (items: FileItem[]): FileItem[] =>
      items.map((item) => {
        if (item.name === parent && item.type === 'folder') {
          return {
            ...item,
            children: [...(item.children || []), { name, type: 'file' }],
          };
        }
        return item.children
          ? { ...item, children: updateStructure(item.children) }
          : item;
      });

    setStructure((prevStructure) => {
      return parent === 'Root'
        ? [
            {
              ...prevStructure[0],
              children: [
                ...(prevStructure[0].children || []),
                { name, type: 'file' },
              ],
            },
          ]
        : updateStructure(prevStructure);
    });
  };

  const deleteItem = (name: string) => {
    const deleteRecursively = (items: FileItem[]): FileItem[] =>
      items
        .filter((item) => item.name !== name)
        .map((item) =>
          item.children
            ? { ...item, children: deleteRecursively(item.children) }
            : item
        );

    setStructure((prevStructure) => deleteRecursively(prevStructure));
  };

  return (
    <FileExplorerContext.Provider
      value={{ structure, addFolder, addFile, deleteItem }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
};
