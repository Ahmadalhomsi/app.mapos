use tauri::{Manager, WindowEvent};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn enable_kiosk_mode(window: tauri::Window) -> Result<(), String> {
    window.set_fullscreen(true).map_err(|e| e.to_string())?;
    window.set_always_on_top(true).map_err(|e| e.to_string())?;
    window.set_skip_taskbar(true).map_err(|e| e.to_string())?;
    window.set_decorations(false).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn print_page() -> Result<(), String> {
    // This will trigger the browser's print functionality
    // The JavaScript side should handle the actual printing
    Ok(())
}

#[tauri::command]
async fn close_application(app: tauri::AppHandle) -> Result<(), String> {
    app.exit(0);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, enable_kiosk_mode, print_page, close_application])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Set up kiosk mode immediately
            let _ = window.set_fullscreen(true);
            let _ = window.set_always_on_top(true);
            let _ = window.set_skip_taskbar(true);
            let _ = window.set_decorations(false);
            let _ = window.set_resizable(false);
            
            Ok(())
        })
        .on_window_event(|_window, event| {
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    // Allow window to close now (removed prevent_close())
                    // The close button and shortcuts will work
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
