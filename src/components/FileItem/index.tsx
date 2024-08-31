'use client'
import { FileItemProps } from '@/interface'
import styles from './index.module.css'


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
}

const FileItemComponent: React.FC<FileItemProps> = ({
  item,
  depth,
  selectedItem,
  setSelectedItem,
}) => {
  const renderIcon = (name: string) => {
    const extension = name.split('.').pop() || ''
    return ICONS[extension] ? (
      <i className={`fa ${ICONS[extension]}`} aria-hidden='true' />
    ) : (
      <i className='fa fa-file' aria-hidden='true' />
    )
  }

  return (
    <li className={styles.listItem} style={{ paddingLeft: `${depth * 20}px` }}>
      <div
        className={`${styles.item} ${
          item.name === selectedItem ? styles.selected : ''
        }`}
        onClick={() => setSelectedItem(item.name)}
      >
        {renderIcon(item.name)}
        <span>{item.name}</span>
      </div>
    </li>
  )
}

export default FileItemComponent
