import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
      <div>
        <Component {...pageProps} />
      </div>
  )
}
export default App