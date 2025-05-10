import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import JsonParser from './components/JsonParser';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app">
        <header className="app-header">
          <h1>JSON解析工具</h1>
        </header>
        <main>
          <JsonParser />
        </main>
        <footer className="app-footer">
          <p>© 2024 JSON解析工具 - 简洁高效的JSON格式化工具</p>
        </footer>
      </div>
    </ConfigProvider>
  );
}

export default App;
