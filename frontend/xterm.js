import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const term = new Terminal();
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    term.write('Welcome to your AI code terminal\r\n');

    // Optional: send commands to backend for execution
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '300px' }} />;
};

export default TerminalComponent;
