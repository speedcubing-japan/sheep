function createWcaLiveResults() { // eslint-disable-line
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

  const result = Service.getWcaLiveFinalResults();
  if (result === undefined) {
    console.log("大会が存在しないか、大会にその種目が存在しません。");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetFile.getId());

  Object.keys(result).forEach((key) => {
    const resultData = result[key];
    let sheetIndex = 0;

    const sheetName = Define.RESULT_SHEET_NAME + key;

    // 存在確認。あったら削除
    const oldSheet: GoogleAppsScript.Spreadsheet.Sheet | null =
      spreadsheet.getSheetByName(sheetName);
    if (oldSheet != null) {
      spreadsheet.deleteSheet(oldSheet);
    }

    // 生成
    const resultSheet = spreadsheet.insertSheet(
      sheetName,
      Define.RESULT_SHEET_INDEX + sheetIndex++
    );

    // ヘッダーの決定
    const maxAttempt = resultData[0].attempts.length;
    const headerInfo: { [key: string]: string } =
      Define.RESULT_BASE_HEADER_INFO[maxAttempt];

    if (key === "333mbf") {
      delete headerInfo.mean;
    }

    // ヘッダー追加
    resultSheet.appendRow(Object.values(headerInfo));

    Object.values(resultData).forEach((value: any) => { // eslint-disable-line

      const row: any[] = []; // eslint-disable-line
      row.push(value.ranking);
      row.push(value.person.name);
      row.push(value.person.wcaUserId);
      [...Array(maxAttempt)].forEach(function (_, i) {
        if (value.attempts[i]) {
          const record = Service.convertRecordForInput(
            key,
            value.attempts[i].result
          );
          row.push(record);
        } else {
          row.push("");
        }
      });
      row.push(Service.convertRecordForInput(key, value.best));
      if (key !== "333mbf") {
        row.push(Service.convertRecordForInput(key, value.average));
      }

      resultSheet.appendRow(row);
    });

    // データ入力セルの中央揃え
    const allRange: GoogleAppsScript.Spreadsheet.Range =
      resultSheet.getDataRange();
    allRange.setHorizontalAlignment("right");

    // データ行の桁数揃え
    if (key !== "333mbf") {
      const dataRange: GoogleAppsScript.Spreadsheet.Range =
        resultSheet.getRange(
          2,
          4,
          resultSheet.getLastRow() - 1,
          resultSheet.getLastColumn()
        );
      dataRange.setNumberFormat("0.00");
    }

    // 名前の行だけ幅を広げる
    resultSheet.setColumnWidth(
      Define.RESULT_SHEET_NAME_COLUMN_INDEX,
      Define.RESULT_SHEET_NAME_SIZE
    );

    console.log("result_" + key + " Complete.");
  });
}
