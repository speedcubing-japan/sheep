function createScoreCertificateFromSheet() { // eslint-disable-line
  const spreadsheetFile: GoogleAppsScript.Drive.File =
    Service.getFileFromTopFiles(
      Define.SPREADSHEET_FILE_NAME,
      Define.DEFAULT_FOLDER_ID
    );
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

  // 存在するカラム数からどの記録証を起こすか策定する
  const spreadsheet = SpreadsheetApp.openById(spreadsheetFile.getId());
  const sheet: GoogleAppsScript.Spreadsheet.Sheet | null =
    spreadsheet.getSheetByName(Define.SPREADSHEET_RESULT_NAME);

  if (sheet == null) {
    console.log("spreadsheetのresultシートがありません。");
    return;
  }

  // カラム情報を取得し試技回数を抽出し使用する記録証書のスライドを決定する
  const maxAttempt = Service.getResultAttemptCount(spreadsheetFile.getId());

  const scoreCertificateFile: GoogleAppsScript.Drive.File =
    Service.getFileFromFolder(
      Define.SCORE_CERTIFICATE_FILE_NAME + "_" + maxAttempt,
      certificateFolder
    );

  if (scoreCertificateFile == null) {
    console.log("記録証書のファイルが存在しません。");
    return;
  }

  const fileName: string = Define.COMPETITION_NAME + "_score_certificate";
  if (outputFolder == null) {
    outputFolder = Service.createFolder(Define.CERTIFICATE_OUTPUT_FOLDER_NAME);
  } else {
    Service.setTrashByFileName(fileName, outputFolder);
  }

  const basePresentation: GoogleAppsScript.Slides.Presentation =
    SlidesApp.openById(scoreCertificateFile.getId());
  if (basePresentation.getSlides().length !== 1) {
    console.log("score_certificateのスライド数が2枚以上存在します。");
    return;
  }

  const newFile: GoogleAppsScript.Drive.File =
    scoreCertificateFile.makeCopy(outputFolder);
  newFile.setName(fileName);

  const resultData = Service.getResultData(spreadsheetFile.getId());

  const removeSlideObjectIds: string[] = [];

  const presentation = SlidesApp.openById(newFile.getId());
  // 記録証書は1枚想定。
  const slide: GoogleAppsScript.Slides.Slide = presentation.getSlides()[0];
  const slideObjectId = slide.getObjectId();
  removeSlideObjectIds.push(slideObjectId);

  const slideInfo: { [key: string]: GoogleAppsScript.Slides.Slide } = {};
  const competitorIds: string[] = [];

  Object.values(resultData).forEach((value) => {
    const slide: GoogleAppsScript.Slides.Slide = presentation
      .getSlideById(slideObjectId)
      .duplicate();
    // あとで後ろから順番で追加するのでここでduplicateするものは消すためobjectIdを確保する。
    removeSlideObjectIds.push(slide.getObjectId());

    slideInfo[value["#"]] = slide;
    competitorIds.push(value["#"]);

    slide.replaceAllText(
      Define.SCORE_CERTIFICATE_SOURCE_STRING_COMPETITION_NAME,
      Define.COMPETITION_NAME
    );
    slide.replaceAllText(
      Define.SCORE_CERTIFICATE_SOURCE_STRING_NAME,
      value.Name
    );
    [...Array(maxAttempt)].forEach(function (_, i) {
      if (value[String(i + 1)] === "DNF" || value[String(i + 1)] === "DNS") {
        slide.replaceAllText(
          Define.SCORE_CERTIFICATE_SOURCE_STRING_SOLVE + (i + 1),
          value[String(i + 1)]
        );
      } else {
        slide.replaceAllText(
          Define.SCORE_CERTIFICATE_SOURCE_STRING_SOLVE + (i + 1),
          Number(value[String(i + 1)]).toFixed(2)
        );
      }
    });

    if (maxAttempt === Define.AVERAGE_OF_5_ATTEMPT_COUNT) {
      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_AVERAGE,
        Number(value.Average).toFixed(2)
      );
    } else if (maxAttempt === Define.BEST_OF_3_ATTEMPT_COUNT) {
      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_MEAN,
        Number(value.Mean).toFixed(2)
      );
    }
    slide.replaceAllText(
      Define.SCORE_CERTIFICATE_SOURCE_STRING_BEST,
      Number(value.Best).toFixed(2)
    );
    const event: string =
      Define.EVENT_ID_NAME_INFO[Define.CERTIFICATE_EVENT_ID];
    slide.replaceAllText(Define.SCORE_CERTIFICATE_SOURCE_STRING_EVENT, event);
  });

  for (const competitorId of competitorIds) {
    presentation.appendSlide(slideInfo[competitorId]);
  }

  for (const removeSlideObjectId of removeSlideObjectIds) {
    presentation.getSlideById(removeSlideObjectId).remove();
  }

  console.log(fileName + " Complete.");
}
