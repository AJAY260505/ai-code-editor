import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function App() {
  const [code, setCode] = useState(`print("Hello, world!")`);
  const [output, setOutput] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [language, setLanguage] = useState("python");

  // Run code
  const runCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/run", {
        code,
        language,
      });
      setOutput(res.data.output || res.data.error || "No output.");
    } catch (err) {
      setOutput("❌ Error running code");
    }
  };

  // Explain code with AI
  const explainCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/generate", {
        prompt: code,
      });
      setAIResponse(res.data.output || "No explanation available.");
    } catch (err) {
      setAIResponse("❌ AI failed to explain.");
    }
  };

  // Open file from disk
  const openFile = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const text = await file.text();
      setCode(text);
    } catch (err) {
      alert("❌ Failed to open file.");
    }
  };

  // Save current code to file
  const saveFile = async () => {
    try {
      const options = {
        types: [
          {
            description: "Code Files",
            accept: {
              "text/plain": [".py", ".js", ".txt"],
            },
          },
        ],
      };
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(code);
      await writable.close();
    } catch (err) {
      alert("❌ Failed to save file.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#1e1e1e] text-white">
      <header className="p-4 text-2xl font-bold bg-[#2c2c2c] shadow flex justify-between items-center">
        💻 Gemini AI Code Editor
        <div className="flex items-center gap-4">
          <select
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            className="bg-gray-700 text-white px-3 py-1 rounded"
          >
            <option value="python">🐍 Python</option>
            <option value="javascript">🟨 JavaScript</option>
          </select>
          <button
            onClick={openFile}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition"
          >
            📂 Open
          </button>
          <button
            onClick={saveFile}
            className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-500 transition"
          >
            💾 Save
          </button>
        </div>
      </header>

      <main className="flex flex-1">
        <div className="w-2/3 p-2">
          <Editor
            height="calc(100vh - 80px)"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
          />
        </div>

        <div className="w-1/3 p-4 bg-[#121212] flex flex-col gap-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={runCode}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition"
            >
              ▶️ Run
            </button>
            <button
              onClick={explainCode}
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-500 transition"
            >
              🤖 Explain with AI
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <h2 className="text-lg font-semibold mb-1">🖥️ Output</h2>
            <pre className="bg-black p-2 rounded h-40 overflow-auto whitespace-pre-wrap">
              {output}
            </pre>
          </div>

          <div className="flex-1 overflow-auto">
            <h2 className="text-lg font-semibold mb-1">💡 AI Output</h2>
            <pre className="bg-gray-800 p-2 rounded h-40 overflow-auto whitespace-pre-wrap">
              {aiResponse}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
