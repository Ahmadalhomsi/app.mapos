import { useEffect, useRef, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showExitButton, setShowExitButton] = useState(false);

  useEffect(() => {
    const setupKioskMode = async () => {
      try {
        const appWindow = getCurrentWindow();
        
        // Ensure fullscreen and kiosk-like behavior
        await appWindow.setFullscreen(true);
        await appWindow.setAlwaysOnTop(true);
        await appWindow.setSkipTaskbar(true);
        await appWindow.setDecorations(false);
        
        // Enable kiosk mode via Rust backend
        await invoke('enable_kiosk_mode');
        
        // Set up global print handler
        setupPrintHandler();
        
        // Set up exit shortcuts
        setupExitShortcuts();
        
        console.log("Kiosk mode enabled successfully");
      } catch (error) {
        console.error("Failed to setup kiosk mode:", error);
      }
    };

    const setupPrintHandler = () => {
      // Override the print function to make it automatic
      window.print = () => {
        console.log("Print triggered");
        // Trigger print without dialog
        setTimeout(() => {
          window.print = originalPrint;
          originalPrint();
        }, 100);
      };
      
      // Store original print function
      const originalPrint = window.print;
      
      // Listen for Ctrl+P or Cmd+P
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
          e.preventDefault();
          window.print();
        }
      });
    };

    const setupExitShortcuts = () => {
      document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+Q to quit (hidden shortcut)
        if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
          e.preventDefault();
          handleCloseApplication();
        }
        
        // Ctrl+Alt+E to show/hide exit button
        if (e.ctrlKey && e.altKey && e.key === 'e') {
          e.preventDefault();
          setShowExitButton(prev => !prev);
        }
        
        // ESC key pressed 3 times in succession to show exit button
        if (e.key === 'Escape') {
          handleEscapeSequence();
        }
      });
    };

    let escapeCount = 0;
    let escapeTimer: number;

    const handleEscapeSequence = () => {
      escapeCount++;
      
      if (escapeTimer) {
        clearTimeout(escapeTimer);
      }
      
      if (escapeCount >= 3) {
        setShowExitButton(true);
        escapeCount = 0;
      } else {
        escapeTimer = setTimeout(() => {
          escapeCount = 0;
        }, 2000); // Reset counter after 2 seconds
      }
    };

    setupKioskMode();
  }, []);

  const handleCloseApplication = async () => {
    try {
      await invoke('close_application');
    } catch (error) {
      console.error("Failed to close application:", error);
      // Fallback to window close
      window.close();
    }
  };

  // Handle iframe load to inject print scripts
  const handleIframeLoad = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        // Override print function in iframe
        iframe.contentWindow.print = () => {
          console.log("Iframe print triggered");
          window.print();
        };
      }
    } catch (error) {
      console.log("Cannot access iframe content due to CORS, but that's expected");
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      border: 'none',
      position: 'relative'
    }}>
      <iframe
        ref={iframeRef}
        src="https://app.mapos.com.tr"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block'
        }}
        title="App Mapos"
        onLoad={handleIframeLoad}
        allow="printing"
      />
      
      {/* Exit Button - only visible when triggered */}
      {showExitButton && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={handleCloseApplication}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Exit Kiosk
          </button>
          <button
            onClick={() => setShowExitButton(false)}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
