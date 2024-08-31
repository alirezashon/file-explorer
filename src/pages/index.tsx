import FileExplorer from '../components/FileExplorer'
import { FileExplorerProvider } from '../context/Explorer'

const HomePage: React.FC = () => {
  return (
    <FileExplorerProvider>
      <FileExplorer />
    </FileExplorerProvider>
  )
}

export default HomePage
