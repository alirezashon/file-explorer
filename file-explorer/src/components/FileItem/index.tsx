'use client'
import { FileItemProps } from '@/interface'
import styles from './index.module.css'
import { useContext } from 'react'
import { FileExplorerContext } from '@/context/Explorer'

const ICONS: { [key: string]: string } = {
  html: 'fa-brands fa-html5',
  css: 'fa-brands fa-css3-alt',
  js: 'fa-brands fa-square-js',
  jsx: 'fa-brands fa-react',
  tsx: 'fa-brands fa-react',
  ts: 'fa-solid fa-t',
  vue: 'fa-brands fa-vuejs',
  angular: 'fa-brands fa-angular',
  java: 'fa-brands fa-java',
  py: 'fa-brands fa-python',
  php: 'fa-brands fa-php',
  rb: 'fa-brands fa-gem',
  txt: 'fa-file-alt',
  md: 'fa-markdown',
  json: 'fa-file-code',
  xml: 'fa-file-code',
  yml: 'fa-file-code',
  jpg: 'fa-file-image',
  jpeg: 'fa-file-image',
  png: 'fa-file-image',
  gif: 'fa-file-image',
  mp4: 'fa-file-video',
  mp3: 'fa-file-audio',
  pdf: 'fa-file-pdf',
  doc: 'fa-file-word',
  docx: 'fa-file-word',
  xls: 'fa-file-excel',
  xlsx: 'fa-file-excel',
  ppt: 'fa-file-powerpoint',
  pptx: 'fa-file-powerpoint',
  zip: 'fa-file-archive',
  rar: 'fa-file-archive',
}

const FileItemComponent: React.FC<FileItemProps> = ({
  item,
  depth,
  selectedItem,
  setSelectedItem,
}) => {
  const { deleteItem } = useContext(FileExplorerContext)
  const renderIcon = (name: string) => {
    const extension = name.split('.').pop()?.toLowerCase() || 'txt'
    return ICONS[extension] ? (
      <i className={`fa ${ICONS[extension]}`} aria-hidden='true' />
    ) : (
      <i className='fa fa-file' aria-hidden='true' />
    )
  }

  return (
    <li className={styles.listItem} style={{ paddingLeft: `${depth * 10}px` }}>
      <div
        className={`${styles.item} ${
          item.name === selectedItem ? styles.selected : ''
        }`}
        onClick={() => setSelectedItem(item.name)}
      >
        {renderIcon(item.name)}
        <span>{item.name}</span>
        {item.name === selectedItem && (
          <i
            onClick={() => deleteItem(item.name)}
            title='Delete Folder'
            className={`${styles.icon} ${styles.trash} fa fa-trash`}
            aria-hidden='true'
          ></i>
        )}
      </div>
    </li>
  )
}

export default FileItemComponent
