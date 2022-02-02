import Layout from './components/Layout';
import './main.scss';
import { GlobalProvider } from './context/GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <Layout />
    </GlobalProvider>
  );
}

export default App;
