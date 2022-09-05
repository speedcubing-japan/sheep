function init() { // eslint-disable-line
  // 初めに不要なものを削除
  const topFolder: GoogleAppsScript.Drive.Folder = DriveApp.getFolderById(
    Define.DEFAULT_FOLDER_ID
  );

  const folders: GoogleAppsScript.Drive.FolderIterator = topFolder.getFolders();
  const files: GoogleAppsScript.Drive.FileIterator = topFolder.getFiles();

  while (folders.hasNext()) {
    const folder: GoogleAppsScript.Drive.Folder = folders.next();
    folder.setTrashed(true);
  }

  while (files.hasNext()) {
    const file: GoogleAppsScript.Drive.File = files.next();
    if (
      file.getMimeType() !== MimeType.GOOGLE_SHEETS &&
      file.getMimeType() !== MimeType.GOOGLE_APPS_SCRIPT
    ) {
      file.setTrashed(true);
    }
  }

  const originTopFolder: GoogleAppsScript.Drive.Folder = DriveApp.getFolderById(
    Define.ORIGIN_FOLDER_ID
  );

  Service.copyFolder(topFolder, originTopFolder);

  console.log("Complete.");
}
