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

  // 指定されたイベントIDとラウンドIDから参加した選手のwca_user_idを取得する
  let wcaUserIds: number[] = [];
  if (Define.CERTIFICATE_ROUND_ID) {
    const spreadsheetFile: GoogleAppsScript.Drive.File =
      Service.getFileFromTopFiles(
        Define.SPREADSHEET_FILE_NAME,
        Define.DEFAULT_FOLDER_ID
      );

    if (spreadsheetFile == null) {
      console.log("spreadsheetのファイル名がcompetitionではありません");
      return;
    }

    const eventRoundId =
      Define.CERTIFICATE_EVENT_ID + "_" + Define.CERTIFICATE_ROUND_ID;
    for (let day = 1; day <= Define.HOLDING_DAYS; day++) {
      const competitorData: { [key: string]: { [key: string]: string } } =
        Service.getCompetitorData(spreadsheetFile.getId(), day);

      if (Object.keys(competitorData).length === 0) {
        console.log(day + "日目の競技者データが存在しません。");
        continue;
      }

      const userIds = Service.getRoundCompetitorWcaUserIds(
        eventRoundId,
        competitorData
      );

      if (userIds.length) {
        wcaUserIds = userIds;
      }
    }
  }

  const result = Service.getWcaLiveFinalResults();
  if (result === undefined) {
    console.log("大会が存在しないか、大会にその種目が存在しません。");
    return;
  }

  if (!Define.CERTIFICATE_EVENT_ID) {
    console.log("CERTIFICATE_EVENT_IDが指定されていません。");
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

  const fileNameValues: string[] = [];
  fileNameValues.push(Define.COMPETITION_NAME);
  fileNameValues.push(Define.CERTIFICATE_EVENT_ID);
  if (Define.CERTIFICATE_ROUND_ID) {
    fileNameValues.push(Define.CERTIFICATE_ROUND_ID);
  }
  fileNameValues.push("score_certificate");

  const fileName: string = fileNameValues.join("_");
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

  const removeSlideObjectIds: string[] = [];

  const presentation = SlidesApp.openById(newFile.getId());
  // 記録証書は1枚想定。
  const slide: GoogleAppsScript.Slides.Slide = presentation.getSlides()[0];
  const slideObjectId = slide.getObjectId();
  removeSlideObjectIds.push(slideObjectId);

  const slideInfo: { [key: string]: GoogleAppsScript.Slides.Slide } = {};
  const competitorIds: string[] = [];

  Object.values(resultData).forEach((value: any) => { // eslint-disable-line

    if (wcaUserIds.length && !wcaUserIds.includes(value.person.wcaUserId)) {
      return;
    }

    const slide: GoogleAppsScript.Slides.Slide = presentation
      .getSlideById(slideObjectId)
      .duplicate();
    // あとで後ろから順番で追加するのでここでduplicateするものは消すためobjectIdを確保する。
    removeSlideObjectIds.push(slide.getObjectId());

    slideInfo[value.id] = slide;
    competitorIds.push(value.id);

    slide.replaceAllText(
      Define.SCORE_CERTIFICATE_SOURCE_STRING_COMPETITION_NAME,
      Define.COMPETITION_NAME
    );
    slide.replaceAllText(
      Define.SCORE_CERTIFICATE_SOURCE_STRING_NAME,
      value.person.name
    );
    [...Array(maxAttempt)].forEach(function (_, i) {
      const record = Service.convertRecord(
        Define.CERTIFICATE_EVENT_ID,
        value.attempts[i].result
      );
      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_SOLVE + (i + 1),
        record
      );
    });

    if (maxAttempt === Define.AVERAGE_OF_5_ATTEMPT_COUNT) {
      const average = Service.convertRecord(
        Define.CERTIFICATE_EVENT_ID,
        value.average
      );
      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_AVERAGE,
        average
      );
    } else if (maxAttempt === Define.BEST_OF_3_ATTEMPT_COUNT) {
      const average = Service.convertRecord(
        Define.CERTIFICATE_EVENT_ID,
        value.average
      );
      slide.replaceAllText(
        Define.SCORE_CERTIFICATE_SOURCE_STRING_MEAN,
        average
      );
    }
    const best = Service.convertRecord(Define.CERTIFICATE_EVENT_ID, value.best);
    slide.replaceAllText(Define.SCORE_CERTIFICATE_SOURCE_STRING_BEST, best);

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
