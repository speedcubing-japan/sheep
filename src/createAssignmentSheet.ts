function createAssignmentSheet() { // eslint-disable-line
  const spreadsheetFile: GoogleAppsScript.Drive.File =
    Service.getFileFromTopFiles(Define.SPREADSHEET_FILE_NAME);

  if (spreadsheetFile == null) {
    console.log("spreadsheetのファイル名がcompetitionではありません");
    return;
  }

  const eventData: { [key: string]: { [key: string]: string } } =
    Service.getEventData(spreadsheetFile.getId());
  const eventIds: string[] = Object.keys(eventData);

  const roundData: { [key: string]: { [key: string]: string } } =
    Service.getRoundData(spreadsheetFile.getId());
  const roundIds: string[] = Object.keys(roundData);

  const spreadsheet = SpreadsheetApp.openById(spreadsheetFile.getId());
  for (let day = 1; day <= Define.HOLDING_DAYS; day++) {
    let sheetName: string = Define.SPREADSHEET_ASSIGNMENT_SHEET_NAME;
    if (Define.HOLDING_DAYS > 1) {
      sheetName = Define.SPREADSHEET_ASSIGNMENT_SHEET_NAME + "_day" + day;
    }

    // 存在確認。あったら削除
    let assignmentSheet: GoogleAppsScript.Spreadsheet.Sheet | null =
      spreadsheet.getSheetByName(sheetName);
    if (assignmentSheet != null) {
      spreadsheet.deleteSheet(assignmentSheet);
    }

    // 生成
    assignmentSheet = spreadsheet.insertSheet(
      sheetName,
      Define.SPREADSHEET_ASSIGNMENT_SHEET_INDEX + day
    );
    if (assignmentSheet == null) {
      console.log("assignmentシートが不明なエラーです");
      return;
    }

    // 競技者データ取得
    const competitorData: { [key: string]: { [key: string]: string } } =
      Service.getCompetitorData(spreadsheetFile.getId(), day);
    if (Object.keys(competitorData).length === 0) {
      console.log(day + "日目の競技者データが存在しません。");
      continue;
    }

    const isWCA: boolean = Service.isWCACompetition(competitorData);
    const eventRoundIds: string[] = Service.getEventRoundIds(
      eventIds,
      roundIds
    );

    let baseHeaderInfo: { [key: string]: string } = {};
    if (isWCA) {
      baseHeaderInfo = Define.SPREADSHEET_ASSIGNMENT_WCA_BASE_HEADER_INFO;
    } else {
      baseHeaderInfo = Define.SPREADSHEET_ASSIGNMENT_SCJ_BASE_HEADER_INFO;
    }

    // ベース情報追加
    const headerList: string[] = [];
    Object.keys(baseHeaderInfo).forEach((key) =>
      headerList.push(baseHeaderInfo[key])
    );

    // 種目ラウンドグループ名追加
    const competitorKeys: string[] = Object.keys(
      Object.entries(competitorData)[0][1]
    );

    for (const key of competitorKeys) {
      if (eventRoundIds.includes(key)) {
        const info: string[] = key.split("_");
        const eventId: string = info[0];
        const roundId: string = info[1];
        const eventHeaderText: string = eventId + roundData[roundId].group_name;

        headerList.push(eventHeaderText);
      }
    }

    let rowCount = 0;
    Object.values(competitorData).forEach((value) => {
      if (rowCount % Define.SPREADSHEET_ASSIGNMENT_SHEET_HEADER_ROW_NUM === 0) {
        if (assignmentSheet != null) {
          assignmentSheet.appendRow(headerList);
        }
      }

      const infos: string[] = [];
      for (const key of Object.keys(baseHeaderInfo)) {
        infos.push(value[key]);
      }

      for (const key of competitorKeys) {
        if (eventRoundIds.includes(key)) {
          infos.push(Service.getAssignmentName(value[key]));
        }
      }

      if (assignmentSheet != null) {
        assignmentSheet.appendRow(infos);
      }

      rowCount++;
    });

    // データ入力セルの中央揃え
    const range: GoogleAppsScript.Spreadsheet.Range =
      assignmentSheet.getDataRange();
    range.setHorizontalAlignment("center");
    range.setBorder(true, true, true, true, true, true);

    // 色設定
    const lastColumn: number = assignmentSheet.getLastColumn();
    const lastRow: number = assignmentSheet.getLastRow();
    for (let rowCount = 0; rowCount < lastRow; rowCount++) {
      if (
        rowCount % (Define.SPREADSHEET_ASSIGNMENT_SHEET_HEADER_ROW_NUM + 1) ===
        0
      ) {
        const range: GoogleAppsScript.Spreadsheet.Range =
          assignmentSheet.getRange(rowCount + 1, 1, 1, lastColumn);
        range.setBackground(Define.SPREADSHEET_ASSIGNMENT_HEADER_COLOR);
      }
      if (
        rowCount % (Define.SPREADSHEET_ASSIGNMENT_SHEET_HEADER_ROW_NUM + 1) ===
        1
      ) {
        let rowNumber: number =
          Define.SPREADSHEET_ASSIGNMENT_SHEET_HEADER_ROW_NUM;
        if (
          rowCount + 1 + Define.SPREADSHEET_ASSIGNMENT_SHEET_HEADER_ROW_NUM >
          lastRow
        ) {
          rowNumber = lastRow - rowCount;
        }
        const range: GoogleAppsScript.Spreadsheet.Range =
          assignmentSheet.getRange(rowCount + 1, 1, rowNumber, lastColumn);
        range.applyRowBanding(
          Define.SPREADSHEET_ASSIGNMENT_BANDING_THEME,
          false,
          false
        );
      }
    }

    // リサイズ
    let baseHeaderSizeInfo: { [key: string]: number } = {};
    if (isWCA) {
      baseHeaderSizeInfo =
        Define.SPREADSHEET_ASSIGNMENT_WCA_BASE_HEADER_SIZE_INFO;
    } else {
      baseHeaderSizeInfo =
        Define.SPREADSHEET_ASSIGNMENT_SCJ_BASE_HEADER_SIZE_INFO;
    }

    Object.keys(baseHeaderSizeInfo).forEach((key) => {
      const columnIndex: number = headerList.indexOf(key) + 1;
      if (assignmentSheet != null) {
        assignmentSheet.setColumnWidth(columnIndex, baseHeaderSizeInfo[key]);
      }
    });

    console.log(sheetName + " Complete.");
  }
}
