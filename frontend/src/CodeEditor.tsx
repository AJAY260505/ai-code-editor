// File: CodeEditor.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import '@uiw/codemirror-theme-dracula';

export default function CodeEditor() {
  const [code, setCode] = useState('print("Hello, world!")');
  const [output, setOutput] = useState('');

  const runPythonCode = () => {
    // @ts-ignore
    const Sk = window.Sk;
    Sk.configure({
      output: (text) => setOutput((prev) => prev + text),
      read: (file) => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[file] === undefined) {
          throw `File not found: '${file}'`;
        }
        return Sk.builtinFiles.files[file];
      },
    });

    setOutput(''); // Clear previous output

    Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
      .catch((err) => setOutput(err.toString()));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">💻 Gemini AI Code Editor</h1>
      
      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <CodeMirror
            value={code}
            height="300px"
            extensions={[python()]}
            theme="dracula"
            onChange={(value) => setCode(value)}
          />
        </CardContent>
      </Card>

      <div className="mt-4 flex gap-4">
        <Button onClick={runPythonCode} className="bg-green-600 hover:bg-green-700">
          ▶️ Run
        </Button>
      </div>

      <Card className="w-full max-w-4xl mt-6 bg-black text-green-500 font-mono text-sm p-4 overflow-y-auto max-h-60">
        <CardContent>
          <pre>{output || 'Output will appear here...'}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
