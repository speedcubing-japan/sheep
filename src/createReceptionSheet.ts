function createReceptionSheet() { // eslint-disable-line
  const spreadsheetFile: GoogleAppsScript.Drive.File =
    Service.getFileFromTopFiles(
      Define.SPREADSHEET_FILE_NAME,
      Define.DEFAULT_FOLDER_ID
    );

  if (spreadsheetFile == null) {
    console.log("spreadsheetのファイル名がcompetitionではありません");
    return;
  }

  for (let day = 1; day <= Define.HOLDING_DAYS; day++) {
    let sheetName: string = Define.SPREADSHEET_RECEPTION_SHEET_NAME;
    if (Define.HOLDING_DAYS > 1) {
      sheetName = Define.SPREADSHEET_RECEPTION_SHEET_NAME + "_day" + day;
    }

    const spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet =
      SpreadsheetApp.openById(spreadsheetFile.getId());
    // 存在確認。あったら削除
    let receptionSheet: GoogleAppsScript.Spreadsheet.Sheet | null =
      spreadsheet.getSheetByName(sheetName);
    if (receptionSheet != null) {
      spreadsheet.deleteSheet(receptionSheet);
    }

    // 生成
    receptionSheet = spreadsheet.insertSheet(
      sheetName,
      Define.SPREADSHEET_RECEPTION_SHEET_INDEX + day
    );

    // 競技者データ取得
    const competitorData: { [key: string]: { [key: string]: string } } =
      Service.getCompetitorData(spreadsheetFile.getId(), day);
    if (Object.keys(competitorData).length === 0) {
      console.log(day + "日目の競技者データが存在しません。");
      continue;
    }

    const isWCA: boolean = Service.isWCACompetition(competitorData);

    // 名前でソート
    const competitorInfoList: { [key: string]: string }[] = Object.values(
      competitorData
    ).sort(function (a, b) {
      if (a.full_name_kana > b.full_name_kana) return 1;
      if (b.full_name_kana > a.full_name_kana) return -1;
      return 0;
    });

    let headerList: string[] = [];

    let baseHeaderInfo: { [key: string]: string } = {};
    if (isWCA) {
      baseHeaderInfo = Define.SPREADSHEET_RECEPTION_WCA_BASE_HEADER_INFO;
    } else {
      baseHeaderInfo = Define.SPREADSHEET_RECEPTION_SCJ_BASE_HEADER_INFO;
    }
    // ベース情報追加
    Object.keys(baseHeaderInfo).forEach((key) => {
      headerList.push(baseHeaderInfo[key]);
    });
    headerList = headerList.concat(Define.SPREADSHEET_RECEPTION_HEADER_INFO);

    receptionSheet.appendRow(headerList);
    for (const competitorInfo of competitorInfoList) {
      const infos: string[] = [];
      for (const key of Object.keys(baseHeaderInfo)) {
        infos.push(competitorInfo[key]);
      }
      receptionSheet.appendRow(infos);
    }

    // データ入力セルの中央揃え
    const range: GoogleAppsScript.Spreadsheet.Range =
      receptionSheet.getDataRange();
    range.setHorizontalAlignment("center");
    range.setBorder(true, true, true, true, true, true);
    range.applyRowBanding(
      Define.SPREADSHEET_RECEPTION_BANDING_THEME,
      true,
      false
    );

    let baseHeaderSizeInfo: { [key: string]: number } = {};
    if (isWCA) {
      baseHeaderSizeInfo = Define.SPREADSHEET_RECEPTION_WCA_BASE_HEADER_SIZE;
    } else {
      baseHeaderSizeInfo = Define.SPREADSHEET_RECEPTION_SCJ_BASE_HEADER_SIZE;
    }
    // リサイズ
    Object.keys(baseHeaderSizeInfo).forEach((key) => {
      const columnIndex: number = headerList.indexOf(key) + 1;
      if (receptionSheet != null) {
        receptionSheet.setColumnWidth(columnIndex, baseHeaderSizeInfo[key]);
      }
    });

    console.log(sheetName + " Complete.");
  }
}
