// import React from 'react'
// import FolderComponent from '../components/Folder'
// import { useExplorer } from '../context/Explorer'

// const HomePage: React.FC = () => {
//   const { root } = useExplorer()

//   return (
//     <div>
//       <FolderComponent folder={root} />
//     </div>
//   )
// }

// const App: React.FC = () => {
//   return (
//       <HomePage />
//   )
// }

// export default App

// pages/index.tsx
import React from 'react'
import FileExplorer from '../components/File'
import { FileExplorerProvider } from '../context/Explorer'

const HomePage: React.FC = () => {
  return (
    <FileExplorerProvider>
      <FileExplorer />
    </FileExplorerProvider>
  )
}

export default HomePage
