function createNameSheet() { // eslint-disable-line
  const spreadsheetFile: GoogleAppsScript.Drive.File =
    Service.getFileFromTopFiles(
      Define.SPREADSHEET_FILE_NAME,
      Define.DEFAULT_FOLDER_ID
    );
  const namesheetFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.NAMESHEET_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );
  let outputFolder: GoogleAppsScript.Drive.Folder =
    Service.getFolderFromTopFolders(
      Define.NAMESHEET_OUTPUT_FOLDER_NAME,
      Define.DEFAULT_FOLDER_ID
    );
  const namesheetFile: GoogleAppsScript.Drive.File = Service.getFileFromFolder(
    Define.NAMESHEET_FILE_NAME,
    namesheetFolder
  );

  if (spreadsheetFile == null) {
    console.log("spreadsheetのファイル名がcompetitionではありません");
    return;
  }

  if (namesheetFolder == null) {
    console.log("namesheetのフォルダ名がnamesheetではありません");
    return;
  }

  if (outputFolder != null) {
    outputFolder.setTrashed(true);
  }
  outputFolder = Service.createFolder(Define.NAMESHEET_OUTPUT_FOLDER_NAME);

  if (namesheetFile == null) {
    console.log("namesheetファイルが存在しません。");
    return;
  }

  const basePresentation: GoogleAppsScript.Slides.Presentation =
    SlidesApp.openById(namesheetFile.getId());
  if (basePresentation.getSlides().length !== Define.HOLDING_DAYS) {
    console.log("namesheetのスライド数と開催日数が一致していません。");
    return;
  }

  const fileName: string = Define.COMPETITION_NAME + "_namesheet";
  const newFile: GoogleAppsScript.Drive.File =
    namesheetFile.makeCopy(outputFolder);
  newFile.setName(fileName);

  const eventData: { [key: string]: { [key: string]: string } } =
    Service.getEventData(spreadsheetFile.getId());
  const eventIds: string[] = Object.keys(eventData);

  const roundData: { [key: string]: { [key: string]: string } } =
    Service.getRoundData(spreadsheetFile.getId());
  const roundIds: string[] = Object.keys(roundData);

  const eventRoundIds: string[] = Service.getEventRoundIds(eventIds, roundIds);

  const slideObjectIdInfo: { [key: number]: string } = {};
  const removeSlideObjectIds: string[] = [];

  const presentation = SlidesApp.openById(newFile.getId());
  for (let day = 1; day <= Define.HOLDING_DAYS; day++) {
    // duplicateするとpageIndexがずれるのでコピー元はobjectIdを使い先に確保する。
    const slides: GoogleAppsScript.Slides.Slide[] = presentation.getSlides();
    slideObjectIdInfo[day - 1] = slides[day - 1].getObjectId();
    // 後で消すので先にobjectIdを確保する
    removeSlideObjectIds.push(presentation.getSlides()[day - 1].getObjectId());
  }

  const slideInfo: {
    [key: number]: { [key: string]: GoogleAppsScript.Slides.Slide };
  } = {};
  const competitorIds: string[] = [];
  let competitorCount = 0;
  for (let day = 1; day <= Define.HOLDING_DAYS; day++) {
    const competitorData: { [key: string]: { [key: string]: string } } =
      Service.getCompetitorData(spreadsheetFile.getId(), day);
    const isWCA: boolean = Service.isWCACompetition(competitorData);

    if (Object.keys(competitorData).length === 0) {
      console.log(day + "日目の競技者データが存在しません。");
      continue;
    }

    if (
      competitorCount !== 0 &&
      competitorCount !== Object.keys(competitorData).length
    ) {
      console.log(day + "日目の競技者データ数が前日と一致していません。");
      return;
    }
    competitorCount = Object.keys(competitorData).length;

    slideInfo[day] = {};
    Object.values(competitorData).forEach((value) => {
      // 初日のcompetitorIdを確保しておく。複数日にまたがる場合基準となるidがないとソートができないため。
      if (day === 1) {
        competitorIds.push(value.id);
      }

      const competitorInfo = Service.getCompetitorInfoData(
        eventRoundIds,
        roundData,
        value
      );

      const slide: GoogleAppsScript.Slides.Slide = presentation
        .getSlideById(slideObjectIdInfo[day - 1])
        .duplicate();
      // あとで後ろから順番で追加するのでここでduplicateするものは消すためobjectIdを確保する。
      removeSlideObjectIds.push(slide.getObjectId());

      slideInfo[day][value.id] = slide;

      let specificId = "";
      if (isWCA) {
        specificId = value.wca_id;
      } else {
        specificId = value.scj_id;
      }

      let dayText = "";
      if (Define.HOLDING_DAYS > 1) {
        dayText = "Day " + day;
      }

      slide.replaceAllText("competitor_id", value.id);
      slide.replaceAllText("specific_id", specificId);
      slide.replaceAllText("wca_name", value.name);
      slide.replaceAllText("kana_name", value.full_name_kana);
      slide.replaceAllText("competition_name", Define.COMPETITION_NAME);
      slide.replaceAllText("day_number", dayText);

      // eventRoundIdから存在するはずの予選文字列を生成する
      // 現状では名札に載せるのは予選(決勝)のみであるはずなので、eventIdからすべての割当を引いてよいはず。
      // つまりtext上に333を指定されているならば333予選の個人情報をすべて書き出すでいいはず。
      // 将来的に準決勝、決勝のスクランブラージャッジを先に割り当てたくなるかもしれないが、現時点では不要か？
      // これは敗退などで先に割り当てるのは現実的ではないので大規模大会以外では不要な気がしています。
      const eventTextDict: { [key: string]: string } = {};
      for (const eventId of eventIds) {
        let competitorEventTaskText = "";
        for (const eventRoundId in competitorInfo) {
          const infos: string[] = eventRoundId.split("_");
          if (eventId === infos[0] && competitorInfo[eventRoundId] !== "") {
            competitorEventTaskText += competitorInfo[eventRoundId] + " ";
          }
        }
        eventTextDict[eventId] = competitorEventTaskText;
      }

      const keys = Object.keys(eventTextDict);
      // 333から置換すると最小マッチしてしまうのでソート。
      // 333bfが333でマッチしてしまうという意味です。
      keys.reverse();
      for (const key of keys) {
        slide.replaceAllText(key, eventTextDict[key]);
      }
    });
  }

  for (const competitorId of competitorIds) {
    for (let day = 1; day <= Define.HOLDING_DAYS; day++) {
      // 0始まりなので+1する
      presentation.appendSlide(slideInfo[day][competitorId]);
    }
  }

  for (const removeSlideObjectId of removeSlideObjectIds) {
    presentation.getSlideById(removeSlideObjectId).remove();
  }

  console.log(fileName + " Complete.");
}
