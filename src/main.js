const { app, BrowserWindow } = require('electron');
const WindowsACLs = require('./WindowsACLs');

console.log('==> main process entry point');

const createMainWindow = () => {
  console.log('==> creating main window');

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // Load your WebXR app inside the main browser window.
  // Using an example from three.js.org here, but alternativly you can use loadFile() to load a local file, webpack, etc.
  mainWindow.loadURL('https://threejs.org/examples/webxr_vr_ballshooter.html');
};

const initApp = () => {
  console.log('==> initializing app');

  const onACLSGranted = () => {
    console.log('==> Application has the required windows ACLS, proceeding with app init');
    createMainWindow();
  };

  const onACLError = error => {
    console.log('==> ERROR trying to grant this application the required windows ACLs: ', error);
  };

  if (process.platform == 'win32') {
    console.log('==> application is running on windows, we must grant the required ACLs (if not already granted)');
    WindowsACLs.grantRequiredACLs().then(onACLSGranted, onACLError);
  } else {
    console.log('==> application not on windows, skipping checking/granting ACLS');
    createMainWindow()
  }
};

app.on('ready', initApp);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    initApp();
  }
});
