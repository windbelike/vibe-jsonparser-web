import React, { useState } from 'react';
import { Input, Button, message, Space, Card, Row, Col } from 'antd';
import { CopyOutlined, FormatPainterOutlined, CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import JSON5 from 'json5';
import './JsonParser.css';

const { TextArea } = Input;

interface JsonNode {
  key: string;
  value: any;
  type: 'object' | 'array' | 'primitive';
  children?: JsonNode[];
  level: number;
  isExpanded?: boolean;
}

const JsonParser: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [jsonTree, setJsonTree] = useState<JsonNode[]>([]);

  const convertToTree = (obj: any, key: string = 'root', level: number = 0): JsonNode => {
    if (obj === null) {
      return { key, value: 'null', type: 'primitive', level };
    }

    if (Array.isArray(obj)) {
      return {
        key,
        value: `Array(${obj.length})`,
        type: 'array',
        level,
        isExpanded: true,
        children: obj.map((item, index) => convertToTree(item, `[${index}]`, level + 1))
      };
    }

    if (typeof obj === 'object') {
      return {
        key,
        value: 'Object',
        type: 'object',
        level,
        isExpanded: true,
        children: Object.entries(obj).map(([k, v]) => convertToTree(v, k, level + 1))
      };
    }

    return {
      key,
      value: String(obj),
      type: 'primitive',
      level
    };
  };

  // 自动格式化逻辑
  const autoFormat = (value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput('');
      setJsonTree([]);
      setError('');
      return;
    }
    try {
      const parsed = JSON5.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setJsonTree([convertToTree(parsed)]);
      setError('');
    } catch (err) {
      setOutput('');
      setJsonTree([]);
      setError('Invalid JSON format, please check your input');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    message.success('Copied to clipboard!');
  };

  const toggleNode = (node: JsonNode) => {
    const updateNode = (nodes: JsonNode[]): JsonNode[] => {
      return nodes.map(n => {
        if (n === node) {
          return { ...n, isExpanded: !n.isExpanded };
        }
        if (n.children) {
          return { ...n, children: updateNode(n.children) };
        }
        return n;
      });
    };
    setJsonTree(updateNode(jsonTree));
  };

  const renderTreeNodes = (nodes: JsonNode[], parentType?: string): React.ReactNode => {
    return nodes.map((node, idx) => {
      const isExpandable = node.type === 'object' || node.type === 'array';
      const isLast = idx === nodes.length - 1;
      // 折叠时只显示类型提示
      if (isExpandable && !node.isExpanded) {
        return (
          <div
            key={node.key}
            className={`json-node ${node.type} expandable`}
            style={{ paddingLeft: `${node.level * 20}px` }}
          >
            <span className="expand-icon" onClick={() => toggleNode(node)}>
              <CaretRightOutlined />
            </span>
            <span className="json-key">{node.key}</span>
            <span className="json-type">
              : {node.type === 'array' ? `Array[${node.children?.length ?? 0}]` : 'Object{...}'}
            </span>
            {!isLast && <span className="json-comma">,</span>}
          </div>
        );
      }
      // 展开时显示具体内容
      if (isExpandable && node.isExpanded) {
        return (
          <React.Fragment key={node.key}>
            <div
              className={`json-node ${node.type} expandable`}
              style={{ paddingLeft: `${node.level * 20}px` }}
            >
              <span className="expand-icon" onClick={() => toggleNode(node)}>
                <CaretDownOutlined />
              </span>
              <span className="json-key">{node.key}</span>
              <span className="json-colon">: </span>
              <span className="json-bracket">{node.type === 'array' ? '[' : '{'}</span>
            </div>
            {node.children && renderTreeNodes(node.children, node.type)}
            <div
              className="json-node"
              style={{ paddingLeft: `${node.level * 20}px` }}
            >
              <span className="json-bracket">{node.type === 'array' ? ']' : '}'}</span>
              {!isLast && <span className="json-comma">,</span>}
            </div>
          </React.Fragment>
        );
      }
      // 叶子节点
      return (
        <div
          key={node.key}
          className="json-node"
          style={{ paddingLeft: `${node.level * 20}px` }}
        >
          <span className="json-key">{node.key}</span>
          <span className="json-colon">: </span>
          <span className="json-value">{node.value}</span>
          {!isLast && <span className="json-comma">,</span>}
        </div>
      );
    });
  };

  return (
    <div className="json-parser">
      <Card title="JSON Parser" className="parser-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <div className="input-section">
              <TextArea
                value={input}
                onChange={e => autoFormat(e.target.value)}
                placeholder="Enter JSON string here"
                autoSize={{ minRows: 20, maxRows: 30 }}
                className="input-area"
              />
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="output-section">
              <div className="tree-view">
                {jsonTree.length > 0 ? (
                  <pre className="json-tree">
                    {renderTreeNodes(jsonTree)}
                  </pre>
                ) : (
                  <TextArea
                    value={output}
                    readOnly
                    autoSize={{ minRows: 20, maxRows: 30 }}
                    className="output-area"
                    placeholder="Formatted JSON will appear here"
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
        
        <Space style={{ marginTop: 24, justifyContent: 'center', width: '100%', display: 'flex' }}>
          <Button 
            icon={<CopyOutlined />}
            onClick={handleCopy}
            disabled={!output}
            size="large"
          >
            Copy Result
          </Button>
        </Space>

        {error && <div className="error-message">{error}</div>}
      </Card>
    </div>
  );
};

export default JsonParser; 