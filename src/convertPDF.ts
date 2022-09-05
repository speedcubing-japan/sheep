function convertPDF() { // eslint-disable-line
  const outputScoresheetFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.SCORESHEET_OUTPUT_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );
  const outputNamesheetFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.NAMESHEET_OUTPUT_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );
  let outputPDFFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.PDF_OUTPUT_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );

  // 存在したら削除
  if (outputPDFFolder != null) {
    outputPDFFolder.setTrashed(true);
  }

  outputPDFFolder = Service.createFolder(Define.PDF_OUTPUT_FOLDER_NAME);

  if (outputScoresheetFolder != null) {
    const scoresheetFiles: GoogleAppsScript.Drive.FileIterator =
      outputScoresheetFolder.getFiles();
    while (scoresheetFiles.hasNext()) {
      const file: GoogleAppsScript.Drive.File = scoresheetFiles.next();
      outputPDFFolder.createFile(file.getAs("application/pdf"));
    }
  }

  if (outputNamesheetFolder != null) {
    const namesheetFiles: GoogleAppsScript.Drive.FileIterator =
      outputNamesheetFolder.getFiles();
    while (namesheetFiles.hasNext()) {
      const file: GoogleAppsScript.Drive.File = namesheetFiles.next();
      outputPDFFolder.createFile(file.getAs("application/pdf"));
    }
  }

  console.log("PDF convert Complete.");
}
