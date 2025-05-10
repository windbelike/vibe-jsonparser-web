import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import JsonParser from './components/JsonParser';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app">
        <main>
          <JsonParser />
        </main>
      </div>
    </ConfigProvider>
  );
}

export default App;
