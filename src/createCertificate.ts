function createCertificate() { // eslint-disable-line
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

  const result = Service.getWcaLiveFinalResults();
  if (result === undefined) {
    console.log("大会が存在しないか、大会にその種目が存在しません。");
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

  const slideInfo: { [key: string]: GoogleAppsScript.Slides.Slide } = {};
  const competitorIds: string[] = [];

  Object.keys(result).forEach((key) => {
    const resultData = result[key];
    Object.values(resultData).forEach((value: any) => { // eslint-disable-line
      if (value.ranking > Define.CERTIFICATE_MIN_RANKING) {
        return;
      }

      const slide: GoogleAppsScript.Slides.Slide = presentation
        .getSlideById(slideObjectId)
        .duplicate();
      // あとで後ろから順番で追加するのでここでduplicateするものは消すためobjectIdを確保する。
      removeSlideObjectIds.push(slide.getObjectId());

      slideInfo[value.id] = slide;
      competitorIds.push(value.id);

      const event: string = Define.EVENT_ID_NAME_INFO[key];
      slide.replaceAllText(Define.SCORE_CERTIFICATE_SOURCE_STRING_EVENT, event);

      slide.replaceAllText(
        Define.CERTIFICATE_SOURCE_STRING_RANK,
        Define.CERTIFICATE_RANK_INFO[value.ranking]
      );

      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_COMPETITION_NAME,
        Define.COMPETITION_NAME
      );
      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_NAME,
        value.person.name
      );
    });
  });

  for (const competitorId of competitorIds) {
    presentation.appendSlide(slideInfo[competitorId]);
  }

  for (const removeSlideObjectId of removeSlideObjectIds) {
    presentation.getSlideById(removeSlideObjectId).remove();
  }

  console.log(fileName + " Complete.");
}
