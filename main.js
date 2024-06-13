const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater, dialog } = require('electron');

require('update-electron-app');

const server = 'https://update.electronjs.org';
const feed = `${server}/dummyrichtech/electron-updates/${process.platform}-${process.arch}/${app.getVersion()}`;
console.log('Update feed URL:', feed);

autoUpdater.setFeedURL({ url: feed });

setInterval(() => {
  autoUpdater.checkForUpdates();
}, 10 * 60 * 1000); // Check for updates every 10 minutes

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  // Use absolute path for local testing
  const absolutePath = 'C:\\Users\\husna\\Downloads\\offline\\src\\index.html';
  win.loadFile(absolutePath).catch((error) => {
    console.error('Failed to load index.html:', error);
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

autoUpdater.on('error', (error) => {
  // Handle error
  console.error('Error during update:', error.message);
});

autoUpdater.on('update-available', () => {
  console.log('Update available.');
});

autoUpdater.on('update-not-available', () => {
  console.log('Update not available.');
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  console.log('Update downloaded:', releaseName);
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

app.on('ready', () => {
  const shortcutPath = path.join(app.getPath('desktop'), `${app.getName()}.lnk`);

  if (!fs.existsSync(shortcutPath)) {
    const electronPath = path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.exe');
    const htmlPath = 'C:\\Users\\husna\\Downloads\\offline\\src\\index.html';

    shell.writeShortcutLink(shortcutPath, {
      target: electronPath,
      args: htmlPath,
      description: 'My Electron Application'
    });
  }
});

