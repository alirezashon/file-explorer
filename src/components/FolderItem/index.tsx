import { useContext, useState } from 'react'
import styles from './index.module.css'
import { FolderItemProps } from '@/interface'
import { FileExplorerContext } from '../../context/Explorer'
import FileItemComponent from '../FileItem'

const FolderItem: React.FC<FolderItemProps> = ({
  item,
  depth,
  selectedItem,
  setSelectedItem,
  setIsAdding,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { deleteItem } = useContext(FileExplorerContext)

  const selectRow = () => {
    setIsOpen(!isOpen)
    setSelectedItem(item.name)
  }

  const getColor = (depth: number): string => {
    const colors = ['#f8bbd0', '#bbdefb', '#c8e6c9', '#ffe0b2', '#d1c4e9']
    return colors[depth % colors.length]
  }

  return (
    <li className={styles.listItem} style={{ paddingLeft: `${depth * 10}px` }}>
      <div
        className={`${styles.item} ${
          item.name === selectedItem ? styles.selected : ''
        }`}
        onClick={selectRow}
      >
        <i
          className={`fa ${isOpen ? 'fa-caret-down' : 'fa-caret-right'} ${
            styles.caretIcon
          }`}
        />
        <i
          className='fa fa-folder'
          style={{ color: getColor(depth) }}
          aria-hidden='true'
        />
        <span className={styles.folderName}>{item.name}</span>
        {item.name === selectedItem && (
          <div className={styles.iconContainer}>
            <i
              onClick={() => setIsAdding('file')}
              title='Add File'
              className={`${styles.icon} fa-solid fa-file-circle-plus`}
              aria-hidden='true'
            ></i>
            <i
              onClick={() => setIsAdding('folder')}
              className={`${styles.icon} fa-solid fa-folder-plus`}
              title='Add Folder'
              aria-hidden='true'
            ></i>

            <i
              onClick={() => deleteItem(item.name)}
              title='Delete Folder'
              className={`${styles.icon} ${styles.trash} fa fa-trash`}
              aria-hidden='true'
            ></i>
          </div>
        )}
      </div>
      {isOpen && item.children && (
        <ul className={styles.list}>
          {item.children.map((child, index) =>
            child.type === 'folder' ? (
              <FolderItem
                key={index}
                item={child}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                setIsAdding={setIsAdding}
              />
            ) : (
              <FileItemComponent
                key={child.name}
                item={child}
                depth={depth + 1}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )
          )}
        </ul>
      )}
    </li>
  )
}

export default FolderItem
