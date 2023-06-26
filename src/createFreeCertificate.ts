function createFreeCertificate() { // eslint-disable-line
  const spreadsheetFile: GoogleAppsScript.Drive.File =
    Service.getFileFromTopFiles(
      Define.SPREADSHEET_FILE_NAME,
      Define.DEFAULT_FOLDER_ID
    );

  if (spreadsheetFile == null) {
    console.log("spreadsheetのファイル名がcompetitionではありません");
    return;
  }

  const certificateFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.CERTIFICATE_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );

  if (certificateFolder == null) {
    console.log("certificateのフォルダ名が存在しません。");
    return;
  }

  let outputFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.CERTIFICATE_OUTPUT_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );

  // シートからデータ集計
  const resultData = Service.getFreeData(spreadsheetFile.getId());
  if (Object.keys(resultData).length === 0) {
    console.log("レコードが存在しません。");
    return;
  }

  const freeCertificateFile: GoogleAppsScript.Drive.File =
    Service.getFileFromFolder(
      Define.FREE_CERTIFICATE_FILE_NAME,
      certificateFolder
    );

  if (freeCertificateFile == null) {
    console.log("自由入力の証書のファイルが存在しません。");
    return;
  }

  if (outputFolder == null) {
    outputFolder = Service.createFolder(Define.CERTIFICATE_OUTPUT_FOLDER_NAME);
  } else {
    Service.setTrashByFileName(Define.FREE_CERTIFICATE_FILE_NAME, outputFolder);
  }

  const basePresentation: GoogleAppsScript.Slides.Presentation =
    SlidesApp.openById(freeCertificateFile.getId());
  if (basePresentation.getSlides().length !== 1) {
    console.log("free_certificateのスライド数が2枚以上存在します。");
    return;
  }

  const newFile: GoogleAppsScript.Drive.File =
    freeCertificateFile.makeCopy(outputFolder);
  newFile.setName(Define.FREE_CERTIFICATE_FILE_NAME);

  const removeSlideObjectIds: string[] = [];

  const presentation = SlidesApp.openById(newFile.getId());
  // 記録証書は1枚想定。
  const slide: GoogleAppsScript.Slides.Slide = presentation.getSlides()[0];
  const slideObjectId = slide.getObjectId();
  removeSlideObjectIds.push(slideObjectId);

  const slideInfo: GoogleAppsScript.Slides.Slide[] = [];

  Object.values(resultData).forEach((value: { [key: string]: string }) => { // eslint-disable-line

    const slide: GoogleAppsScript.Slides.Slide = presentation
      .getSlideById(slideObjectId)
      .duplicate();
    // あとで後ろから順番で追加するのでここでduplicateするものは消すためobjectIdを確保する。
    removeSlideObjectIds.push(slide.getObjectId());
    slideInfo.push(slide);

    Object.keys(value).forEach((key) => {
      slide.replaceAllText(key, value[key]);
    });
  });

  for (const slide of slideInfo) {
    presentation.appendSlide(slide);
  }

  for (const removeSlideObjectId of removeSlideObjectIds) {
    presentation.getSlideById(removeSlideObjectId).remove();
  }

  console.log(Define.FREE_CERTIFICATE_FILE_NAME + " Complete.");
}
