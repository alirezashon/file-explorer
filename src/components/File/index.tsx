import React, { useContext, useState, useRef, useEffect } from 'react';
import styles from './index.module.css';
import { FileExplorerContext, FileItem } from '../../context/Explorer';

const ICONS: { [key: string]: string } = {
  html: 'fa-html5',
  css: 'fa-css3',
  js: 'fa-js',
  react: 'fa-react',
  vue: 'fa-vuejs',
  angular: 'fa-angular',
  java: 'fa-java',
  python: 'fa-python',
  php: 'fa-php',
  ruby: 'fa-ruby',
};

const FileExplorer = () => {
  const { structure, addFolder, addFile, deleteItem } =
    useContext(FileExplorerContext);
  const [selectedItem, setSelectedItem] = useState<string | null>('Root');
  const [newItemName, setNewItemName] = useState<string>('');
  const [isAdding, setIsAdding] = useState<'folder' | 'file' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectItem = (name: string, type: 'file' | 'folder') => {
    if (type === 'file') {
      setSelectedItem(findParentFolder(name) || 'Root');
    } else {
      setSelectedItem(name === selectedItem ? 'Root' : name);
    }
    setNewItemName('');
    setIsAdding(null);
  };

  const handleAddFolder = () => {
    setIsAdding('folder');
    setNewItemName('');
  };

  const handleAddFile = () => {
    setIsAdding('file');
    setNewItemName('');
  };

  const handleSaveItem = () => {
    if (!newItemName) return;

    const nameWithExtension =
      isAdding === 'file' && !newItemName.includes('.')
        ? `${newItemName}.txt`
        : newItemName;

    if (isAdding === 'folder' && selectedItem) {
      addFolder(nameWithExtension, selectedItem);
    } else if (isAdding === 'file' && selectedItem) {
      addFile(nameWithExtension, selectedItem);
    }

    setNewItemName('');
    setIsAdding(null);
  };

  const handleCancel = () => {
    setNewItemName('');
    setIsAdding(null);
  };

  const renderIcon = (name: string) => {
    const extension = name.split('.').pop() || '';
    return ICONS[extension] ? (
      <i className={`fa ${ICONS[extension]}`} aria-hidden="true" />
    ) : (
      <i className="fa fa-file" aria-hidden="true" />
    );
  };

  const renderStructure = (structure: FileItem[], depth: number = 0) => (
    <ul className={styles.list}>
      {structure.map((item) => (
        <li
          key={item.name}
          className={styles.listItem}
          style={{ paddingLeft: `${depth * 20}px` }}
        >
          <div
            className={`${styles.item} ${
              item.name === selectedItem ? styles.selected : ''
            }`}
            onClick={() => handleSelectItem(item.name, item.type)}
          >
            {renderIcon(item.name)}
            <span>{item.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(item.name);
              }}
            >
              Delete
            </button>
          </div>
          {item.name === selectedItem && isAdding ? (
            <div className={styles.newItemInput}>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`Enter ${isAdding} name`}
                ref={inputRef}
              />
              <button onClick={handleSaveItem}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : null}
          {item.children && renderStructure(item.children, depth + 1)}
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button onClick={handleAddFolder}>Add Folder</button>
        <button onClick={handleAddFile}>Add File</button>
      </div>
      <div className={styles.structure}>{renderStructure(structure)}</div>
    </div>
  );
};

export default FileExplorer;
