import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import JsonParser from './components/JsonParser';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={enUS}>
      <div className="app">
        <main>
          <JsonParser />
        </main>
      </div>
    </ConfigProvider>
  );
}

export default App;
