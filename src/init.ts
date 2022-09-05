function init() { // eslint-disable-line
  // 初めに不要なものを削除
  const topFolder: GoogleAppsScript.Drive.Folder = DriveApp.getFolderById(
    Define.DEFAULT_FOLDER_ID
  );

  const folders: GoogleAppsScript.Drive.FolderIterator = topFolder.getFolders();
  const files: GoogleAppsScript.Drive.FileIterator = topFolder.getFiles();

  if (folders.hasNext()) {
    console.log(
      "すでにsheep以外のファイルがあるため初期化できません。初期化する場合はsheep以外は削除もしくは避難してください。"
    );
    return;
  }

  while (files.hasNext()) {
    const file: GoogleAppsScript.Drive.File = files.next();
    if (
      file.getMimeType() !== MimeType.GOOGLE_APPS_SCRIPT ||
      file.getName() !== Define.NAME
    ) {
      console.log(
        "すでにsheep以外のファイルがあるため初期化できません。初期化する場合はsheep以外は削除もしくは避難してください。"
      );
      return;
    }
  }

  const originTopFolder: GoogleAppsScript.Drive.Folder = DriveApp.getFolderById(
    Define.ORIGIN_FOLDER_ID
  );

  Service.copyFolder(topFolder, originTopFolder);

  console.log("Complete.");
}
