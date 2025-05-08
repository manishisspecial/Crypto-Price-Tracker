import { Provider } from 'react-redux';
import { store } from './store/store';
import CryptoTable from './components/CryptoTable';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [dark, setDark] = useState(() => {
    // Persist dark mode in localStorage
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <Provider store={store}>
      <div className={"App min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"}>
        <header className="App-header bg-white dark:bg-gray-950 dark:text-gray-100 shadow">
          <div className="flex items-center justify-between">
            <h1 className="dark:text-white">Real-Time Crypto Price Tracker</h1>
            <button
              className="ml-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
            >
              {dark ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </header>
        <main>
          <CryptoTable />
        </main>
      </div>
    </Provider>
  );
}

export default App;
