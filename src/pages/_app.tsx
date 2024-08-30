import '@/styles/globals.css'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
  return (
      <div>
        <Component {...pageProps} />
      </div>
  )
}
export default App