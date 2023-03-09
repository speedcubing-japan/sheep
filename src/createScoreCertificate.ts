function createScoreCertificate() { // eslint-disable-line
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

  const resultData = result[Define.CERTIFICATE_EVENT_ID];

  const maxAttempt = resultData[0].attempts.length;

  const scoreCertificateFile: GoogleAppsScript.Drive.File =
    Service.getFileFromFolder(
      Define.SCORE_CERTIFICATE_FILE_NAME + "_" + maxAttempt,
      certificateFolder
    );

  if (scoreCertificateFile == null) {
    console.log("記録証書のファイルが存在しません。");
    return;
  }

  if (outputFolder != null) {
    outputFolder.setTrashed(true);
  }
  outputFolder = Service.createFolder(Define.CERTIFICATE_OUTPUT_FOLDER_NAME);

  const basePresentation: GoogleAppsScript.Slides.Presentation =
    SlidesApp.openById(scoreCertificateFile.getId());
  if (basePresentation.getSlides().length !== 1) {
    console.log("score_certificateのスライド数が2枚以上存在します。");
    return;
  }

  const fileName: string = Define.COMPETITION_NAME + "_score_certificate";
  const newFile: GoogleAppsScript.Drive.File =
    scoreCertificateFile.makeCopy(outputFolder);
  newFile.setName(fileName);

  const removeSlideObjectIds: string[] = [];

  const presentation = SlidesApp.openById(newFile.getId());
  // 記録証書は1枚想定。
  const slide: GoogleAppsScript.Slides.Slide = presentation.getSlides()[0];
  const slideObjectId = slide.getObjectId();
  removeSlideObjectIds.push(slideObjectId);

  const slideInfo: { [key: string]: GoogleAppsScript.Slides.Slide } = {};
  const competitorIds: string[] = [];

  Object.values(resultData).forEach((value: any) => { // eslint-disable-line
    const slide: GoogleAppsScript.Slides.Slide = presentation
      .getSlideById(slideObjectId)
      .duplicate();
    // あとで後ろから順番で追加するのでここでduplicateするものは消すためobjectIdを確保する。
    removeSlideObjectIds.push(slide.getObjectId());

    slideInfo[value.id] = slide;
    competitorIds.push(value.id);

    slide.replaceAllText("competition_name", Define.COMPETITION_NAME);
    slide.replaceAllText("name", value.person.name);
    [...Array(maxAttempt)].forEach(function (_, i) {
      const record = Service.convertRecord(
        Define.CERTIFICATE_EVENT_ID,
        value.attempts[i].result
      );
      slide.replaceAllText("solve" + (i + 1), record);
    });

    if (maxAttempt === Define.AVERAGE_OF_5_ATTEMPT_COUNT) {
      const average = Service.convertRecord(
        Define.CERTIFICATE_EVENT_ID,
        value.average
      );
      slide.replaceAllText("average", average);
    } else if (maxAttempt === Define.BEST_OF_3_ATTEMPT_COUNT) {
      const average = Service.convertRecord(
        Define.CERTIFICATE_EVENT_ID,
        value.average
      );
      slide.replaceAllText("mean", average);
    }
    const best = Service.convertRecord(Define.CERTIFICATE_EVENT_ID, value.best);
    slide.replaceAllText("best", best);

    const event: string =
      Define.EVENT_ID_NAME_INFO[Define.CERTIFICATE_EVENT_ID];
    slide.replaceAllText("event", event);
  });

  for (const competitorId of competitorIds) {
    presentation.appendSlide(slideInfo[competitorId]);
  }

  for (const removeSlideObjectId of removeSlideObjectIds) {
    presentation.getSlideById(removeSlideObjectId).remove();
  }

  console.log(fileName + " Complete.");
}
