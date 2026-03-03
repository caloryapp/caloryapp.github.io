import { Router, Route } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import HomePage from 'src/pages/HomePage'

const AppProvider = () => {
  return (
    <Router hook={useHashLocation}>
      <Route path="/" component={HomePage} />
    </Router>
  )
}

export default AppProvider
