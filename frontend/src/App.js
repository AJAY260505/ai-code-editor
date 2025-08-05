import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('// Write your code here');
  const [suggestion, setSuggestion] = useState('');
  const [history, setHistory] = useState([]);

  const getSuggestion = async () => {
    setHistory(prev => [...prev, code]); // Save current version
    try {
      const res = await axios.post('http://localhost:5000/generate', {
        prompt: `Optimize or improve this code:\n${code}`
      });
      setSuggestion(res.data.output);
    } catch (error) {
      setSuggestion('Error: ' + error.message);
    }
  };

  const rollback = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setCode(prev);
      setHistory(prevHistory => prevHistory.slice(0, -1));
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>💻 Gemini AI Code Editor</h1>
      <Editor
        height="400px"
        theme="vs-dark"
        language="python"
        value={code}
        onChange={setCode}
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={getSuggestion}>✨ Get Suggestion</button>
        <button onClick={rollback} style={{ marginLeft: 10 }}>↩️ Rollback</button>
      </div>
      {suggestion && (
        <div style={{ marginTop: '1rem' }}>
          <h3>💡 Suggestion:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{suggestion}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
