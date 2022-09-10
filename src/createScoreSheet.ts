function createScoreSheet() { // eslint-disable-line
  const spreadsheetFile: GoogleAppsScript.Drive.File =
    Service.getFileFromTopFiles(
      Define.SPREADSHEET_FILE_NAME,
      Define.DEFAULT_FOLDER_ID
    );
  const scoresheetFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.SCORESHEET_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );
  let outputFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.SCORESHEET_OUTPUT_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );

  if (spreadsheetFile == null) {
    console.log("spreadsheetのファイル名がcompetitionではありません");
    return;
  }

  if (scoresheetFolder == null) {
    console.log("scoresheetのフォルダ名がscoresheetではありません");
    return;
  }

  if (outputFolder != null) {
    outputFolder.setTrashed(true);
  }
  outputFolder = Service.createFolder(Define.SCORESHEET_OUTPUT_FOLDER_NAME);

  const eventData: { [key: string]: { [key: string]: string } } =
    Service.getEventData(spreadsheetFile.getId());
  const eventIds: string[] = Object.keys(eventData);

  const roundData: { [key: string]: { [key: string]: string } } =
    Service.getRoundData(spreadsheetFile.getId());
  const roundIds: string[] = Object.keys(roundData);

  for (let day = 1; day <= Define.HOLDING_DAYS; day++) {
    const competitorData: { [key: string]: { [key: string]: string } } =
      Service.getCompetitorData(spreadsheetFile.getId(), day);

    if (Object.keys(competitorData).length === 0) {
      console.log(day + "日目の競技者データが存在しません。");
      continue;
    }

    // 大会がWCA大会かどうかを判定する
    const isWCA: boolean = Service.isWCACompetition(competitorData);
    // 存在しうるeventRoundIdsを取得
    const eventRoundIds: string[] = Service.getEventRoundIds(
      eventIds,
      roundIds
    );
    // 各ラウンド数の合計数を算出する
    const sum = Service.getEventRoundSumData(eventRoundIds, competitorData);

    for (const eventRoundId of eventRoundIds) {
      // eventRoundIdが存在しなければ見ない
      if (!(eventRoundId in sum)) {
        continue;
      }
      const infos: string[] = eventRoundId.split("_");
      const eventId: string = infos[0];
      const roundId: string = infos[1];

      const files: GoogleAppsScript.Drive.FileIterator =
        scoresheetFolder.getFiles();
      let file!: GoogleAppsScript.Drive.File;
      while (files.hasNext()) {
        const tmpFile = files.next();

        let scoresheetName: string =
          "scoresheet_" + eventData[eventId].attempt_number;
        if (isWCA) {
          scoresheetName += "_wca";
        }

        if (tmpFile.getName() === scoresheetName) {
          file = tmpFile;
          break;
        }
      }

      if (file == null) {
        console.log("eventシートのattempt_numberが不正の可能性があります。");
        break;
      }

      // 新規ファイル生成
      const newFile: GoogleAppsScript.Drive.File = file.makeCopy(outputFolder);

      let fileDayText = "";
      if (Define.HOLDING_DAYS > 1) {
        fileDayText = "_day" + day;
      }

      const fileName: string =
        Define.COMPETITION_NAME +
        fileDayText +
        "_" +
        eventId +
        "_" +
        roundData[roundId].round_name +
        "_" +
        roundData[roundId].group_name;
      newFile.setName(fileName);

      const presentation: GoogleAppsScript.Slides.Presentation =
        SlidesApp.openById(newFile.getId());
      const slideInfo: { [key: string]: GoogleAppsScript.Slides.Slide } = {};

      // 消すベースシートのオブジェクトID確保
      const removeSlideObjectIds: string[] = [];
      removeSlideObjectIds.push(presentation.getSlides()[0].getObjectId());

      let roundMemberCount = 0;
      Object.values(competitorData).forEach((value) => {
        if (value[eventRoundId] !== String(Define.ENTRY_STRING)) {
          return;
        }

        const slide: GoogleAppsScript.Slides.Slide = presentation
          .getSlides()[0]
          .duplicate();
        // あとで後ろから順番で追加するのでここでduplicateするものは消すためobjectIdを確保する。
        removeSlideObjectIds.push(slide.getObjectId());
        // あとで追加するので確保
        slideInfo[value.id] = slide;

        roundMemberCount += 1;

        let specificId = "";
        if (isWCA) {
          specificId = value.wca_id;
        } else {
          specificId = "SCJ ID " + value.scj_id;
        }

        slide.replaceAllText("competitor_id", value.id);
        slide.replaceAllText("specific_id", specificId);
        slide.replaceAllText("round", roundData[roundId].round_name);
        slide.replaceAllText("group", roundData[roundId].group_name);
        slide.replaceAllText("event_name", eventData[eventId].event_name);
        if (isWCA) {
          slide.replaceAllText("wca_name", value.name);
        } else {
          slide.replaceAllText("rome_name", value.full_name_rome);
          slide.replaceAllText("full_name", value.full_name);
        }
        slide.replaceAllText("kana_name", value.full_name_kana);
        slide.replaceAllText(
          "sequence",
          "# " + String(roundMemberCount) + "/" + sum[eventRoundId]
        );
        slide.replaceAllText("competition_name", Define.COMPETITION_NAME);
        slide.replaceAllText("cutoff_time", eventData[eventId].cutoff_time);
        slide.replaceAllText("limit_time", eventData[eventId].limit_time);
      });

      // メンバー数初期化
      roundMemberCount = 0;

      // 後ろから追加する
      Object.values(competitorData).forEach((value) => {
        if (value[eventRoundId] === String(Define.ENTRY_STRING)) {
          presentation.appendSlide(slideInfo[value.id]);
        }
      });

      // 不要なものは消す
      for (const removeSlideObjectId of removeSlideObjectIds) {
        presentation.getSlideById(removeSlideObjectId).remove();
      }

      console.log(fileName + " Complete.");
    }
  }
}
