import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({ cursorBlink: true });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    // Connect to backend PTY
    const socket = new WebSocket("ws://localhost:5000/terminal");
    socket.onmessage = (event) => term.write(event.data);
    term.onData(data => socket.send(data));
  }, []);

  return <div ref={terminalRef} style={{ height: "400px", width: "100%" }} />;
};

export default TerminalComponent;
