function createCertificateFromSheet() { // eslint-disable-line
  const spreadsheetFile: GoogleAppsScript.Drive.File =
    Service.getFileFromTopFiles(
      Define.SPREADSHEET_FILE_NAME,
      Define.DEFAULT_FOLDER_ID
    );

  if (spreadsheetFile == null) {
    console.log(
      "spreadsheetのファイルが存在しないか名称がcompetitionではありません"
    );
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

  const result = Service.getResultData(spreadsheetFile.getId());
  if (Object.keys(result).length === 0) {
    console.log("結果が存在しません。");
    return;
  }

  const certificateFile: GoogleAppsScript.Drive.File =
    Service.getFileFromFolder(Define.CERTIFICATE_FILE_NAME, certificateFolder);

  if (certificateFile == null) {
    console.log("表彰状のファイルが存在しません。");
    return;
  }

  const fileNameValues: string[] = [];
  fileNameValues.push(Define.COMPETITION_NAME);
  fileNameValues.push("certificate");

  const fileName: string = fileNameValues.join("_");
  if (outputFolder == null) {
    outputFolder = Service.createFolder(Define.CERTIFICATE_OUTPUT_FOLDER_NAME);
  } else {
    Service.setTrashByFileName(fileName, outputFolder);
  }

  const basePresentation: GoogleAppsScript.Slides.Presentation =
    SlidesApp.openById(certificateFile.getId());
  if (basePresentation.getSlides().length !== 1) {
    console.log("certificateのスライド数が2枚以上存在します。");
    return;
  }

  const newFile: GoogleAppsScript.Drive.File =
    certificateFile.makeCopy(outputFolder);
  newFile.setName(fileName);

  const removeSlideObjectIds: string[] = [];

  const presentation = SlidesApp.openById(newFile.getId());
  // 表彰状は1枚想定。
  const slide: GoogleAppsScript.Slides.Slide = presentation.getSlides()[0];
  const slideObjectId = slide.getObjectId();
  removeSlideObjectIds.push(slideObjectId);

  const slideInfo: GoogleAppsScript.Slides.Slide[] = [];

  Object.keys(result).forEach((key) => {
    const resultData = result[key];
    Object.values(resultData).forEach((value: any) => { // eslint-disable-line
      if (value["#"] > Define.CERTIFICATE_MIN_RANKING) {
        return;
      }

      const slide: GoogleAppsScript.Slides.Slide = presentation
        .getSlideById(slideObjectId)
        .duplicate();
      // あとで後ろから順番で追加するのでここでduplicateするものは消すためobjectIdを確保する。
      removeSlideObjectIds.push(slide.getObjectId());
      slideInfo.push(slide);

      const event: string = Define.EVENT_ID_NAME_INFO[key];
      slide.replaceAllText(Define.SCORE_CERTIFICATE_SOURCE_STRING_EVENT, event);

      slide.replaceAllText(
        Define.CERTIFICATE_SOURCE_STRING_RANK,
        Define.CERTIFICATE_RANK_INFO[value["#"]]
      );

      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_COMPETITION_NAME,
        Define.COMPETITION_NAME
      );
      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_NAME,
        value.name
      );
    });
  });

  for (const slide of slideInfo) {
    presentation.appendSlide(slide);
  }

  for (const removeSlideObjectId of removeSlideObjectIds) {
    presentation.getSlideById(removeSlideObjectId).remove();
  }

  console.log(fileName + " Complete.");
}
