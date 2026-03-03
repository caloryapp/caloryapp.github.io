import { render } from 'preact'
import App from './App'
import './i18n'
import '@caloryapp/calculator/styles.css'
import './styles.css'

render(<App />, document.getElementById('app')!)
