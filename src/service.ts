namespace Service { // eslint-disable-line
  export function getFileFromTopFiles(
    fileName: string,
    folderId: string
  ): GoogleAppsScript.Drive.File {
    const currentFolder: GoogleAppsScript.Drive.Folder =
      DriveApp.getFolderById(folderId);
    return getFileFromFolder(fileName, currentFolder);
  }

  export function getFolderFromTopFolders(
    folderName: string,
    folderId: string
  ): GoogleAppsScript.Drive.Folder {
    const currentFolder: GoogleAppsScript.Drive.Folder =
      DriveApp.getFolderById(folderId);
    const folders: GoogleAppsScript.Drive.FolderIterator =
      currentFolder.getFolders();
    return getFolderFromFolders(folderName, folders);
  }

  export function getFileFromFolder(
    fileName: string,
    folder: GoogleAppsScript.Drive.Folder
  ): GoogleAppsScript.Drive.File {
    const files: GoogleAppsScript.Drive.FileIterator = folder.getFiles();
    let file!: GoogleAppsScript.Drive.File;
    while (files.hasNext()) {
      const tmpFile: GoogleAppsScript.Drive.File = files.next();
      if (tmpFile.getName() === fileName) {
        file = tmpFile;
        break;
      }
    }
    return file;
  }

  export function getFolderFromFolders(
    folderName: string,
    folders: GoogleAppsScript.Drive.FolderIterator
  ): GoogleAppsScript.Drive.Folder {
    let folder!: GoogleAppsScript.Drive.Folder;
    while (folders.hasNext()) {
      const tmpFolder: GoogleAppsScript.Drive.Folder = folders.next();
      if (tmpFolder.getName() === folderName) {
        folder = tmpFolder;
        break;
      }
    }
    return folder;
  }

  export function createFolder(
    folderName: string
  ): GoogleAppsScript.Drive.Folder {
    const currentFolder: GoogleAppsScript.Drive.Folder = DriveApp.getFolderById(
      Define.DEFAULT_FOLDER_ID
    );
    return currentFolder.createFolder(folderName);
  }

  export function copyFolder(
    folder: GoogleAppsScript.Drive.Folder,
    originFolder: GoogleAppsScript.Drive.Folder
  ): void {
    const originFiles: GoogleAppsScript.Drive.FileIterator =
      originFolder.getFiles();
    while (originFiles.hasNext()) {
      const originFile: GoogleAppsScript.Drive.File = originFiles.next();
      if (originFile.getMimeType() !== MimeType.GOOGLE_APPS_SCRIPT) {
        originFile.makeCopy(originFile.getName(), folder);
      }
    }

    const originFolders: GoogleAppsScript.Drive.FolderIterator =
      originFolder.getFolders();

    while (originFolders.hasNext()) {
      const originFolder: GoogleAppsScript.Drive.Folder = originFolders.next();
      const targetFolder: GoogleAppsScript.Drive.Folder = folder.createFolder(
        originFolder.getName()
      );
      copyFolder(targetFolder, originFolder);
    }
  }

  export function getCompetitorData(
    id: string,
    day: number
  ): { [key: string]: { [key: string]: string } } {
    const COMPETITOR_ID_RAW_INDEX = 0;

    const sheet = SpreadsheetApp.openById(id).getSheetByName(
      Define.SPREADSHEET_COMPETITOR_NAME + "_day" + day
    );
    if (sheet == null) {
      return {};
    }
    // 書式なしテキスト
    sheet.getDataRange().setNumberFormat("@");

    const rows: string[][] = sheet.getDataRange().getValues();
    const keys: string[] = rows.splice(0, 1)[0];

    const obj: { [key: string]: { [key: string]: string } } = {};
    for (const row of rows) {
      obj[row[COMPETITOR_ID_RAW_INDEX]] = {};
      Object.entries(row).forEach(([key, value]) => {
        obj[row[COMPETITOR_ID_RAW_INDEX]][keys[Number(key)]] = value;
      });
    }
    return obj;
  }

  export function getEventData(id: string): {
    [key: string]: { [key: string]: string };
  } {
    const EVENT_EVENT_ID_RAW_INDEX = 0;
    const EVENT_IS_HELD_RAW_INDEX = 3;

    const sheet = SpreadsheetApp.openById(id).getSheetByName(
      Define.SPREADSHEET_EVENT_NAME
    );
    if (sheet == null) {
      return {};
    }
    sheet.getDataRange().setNumberFormat("@");

    const rows: string[][] = sheet.getDataRange().getValues();
    const keys: string[] = rows.splice(0, 1)[0];

    const obj: { [key: string]: { [key: string]: string } } = {};
    for (const row of rows) {
      // 開催可否チェック
      if (row[EVENT_IS_HELD_RAW_INDEX] === "true") {
        // イベントIDをキーに情報格納
        obj[row[EVENT_EVENT_ID_RAW_INDEX]] = {};
        Object.entries(row).forEach(([key, value]) => {
          obj[row[EVENT_EVENT_ID_RAW_INDEX]][keys[Number(key)]] = value;
        });
      }
    }
    return obj;
  }

  export function getResultData(id: string): { [key: string]: string }[] {
    const sheet = SpreadsheetApp.openById(id).getSheetByName(
      Define.SPREADSHEET_RESULT_NAME
    );
    if (sheet == null) {
      return [];
    }
    sheet.getDataRange().setNumberFormat("@");

    const rows: string[][] = sheet.getDataRange().getValues();
    const keys: string[] = rows.splice(0, 1)[0];

    const obj: { [key: string]: string }[] = [];
    for (const row of rows) {
      const data: { [key: string]: string } = {};
      Object.entries(row).forEach(([key, value]) => {
        const column: string = keys[Number(key)];
        data[column] = value;
      });
      obj.push(data);
    }
    return obj;
  }

  export function getResultAttemptCount(id: string): number {
    const sheet = SpreadsheetApp.openById(id).getSheetByName(
      Define.SPREADSHEET_RESULT_NAME
    );
    if (sheet == null) {
      return 0;
    }
    sheet.getDataRange().setNumberFormat("@");

    const rows: string[][] = sheet.getDataRange().getValues();
    const keys: string[] = rows.splice(0, 1)[0];

    const attemptNumbers: number[] = keys.map(parseInt).filter(function (x) {
      return !isNaN(x);
    });

    if (attemptNumbers.length <= 0) {
      return 0;
    }
    const arrayMax = function (x: number, y: number) {
      return Math.max(x, y);
    };

    return attemptNumbers.reduce(arrayMax);
  }

  export function getRoundData(id: string): {
    [key: string]: { [key: string]: string };
  } {
    const ROUND_ID_RAW_INDEX = 0;

    const sheet = SpreadsheetApp.openById(id).getSheetByName(
      Define.SPREADSHEET_ROUND_NAME
    );
    if (sheet == null) {
      return {};
    }
    sheet.getDataRange().setNumberFormat("@");

    const rows: string[][] = sheet.getDataRange().getValues();
    const keys: string[] = rows.splice(0, 1)[0];

    const obj: { [key: string]: { [key: string]: string } } = {};
    for (const row of rows) {
      // ラウンドIDをキーに情報展開
      obj[row[ROUND_ID_RAW_INDEX]] = {};
      Object.entries(row).forEach(([key, value]) => {
        obj[row[ROUND_ID_RAW_INDEX]][keys[Number(key)]] = value;
      });
    }
    return obj;
  }

  // 存在しうるevent_id + _ + round_idのキーを返却する
  export function getEventRoundIds(
    eventIds: string[],
    roundIds: string[]
  ): string[] {
    const eventRoundIds: string[] = [];
    for (const eventId of eventIds) {
      for (const roundId of roundIds) {
        eventRoundIds.push(eventId + "_" + roundId);
      }
    }
    return eventRoundIds;
  }

  // 各ラウンド数の合計数を算出する
  export function getEventRoundSumData(
    eventRoundIds: string[],
    competitorData: { [key: string]: { [key: string]: string } }
  ): { [key: string]: number } {
    const sum: { [key: string]: number } = {};
    for (const eventRoundId of eventRoundIds) {
      Object.values(competitorData).forEach((value) => {
        if (!(eventRoundId in value)) {
          return;
        }
        if (value[eventRoundId] !== String(Define.ENTRY_STRING)) {
          return;
        }
        if (eventRoundId in sum) {
          sum[eventRoundId] += Define.ENTRY_STRING;
        } else {
          sum[eventRoundId] = Define.ENTRY_STRING;
        }
      });
    }
    return sum;
  }

  export function getCompetitorInfoData(
    eventRoundIds: string[],
    roundData: {
      [key: string]: { [key: string]: string };
    },
    competitorData: {
      [key: string]: string;
    }
  ) {
    const info: { [key: string]: string } = {};
    for (const eventRoundId of eventRoundIds) {
      if (eventRoundId in competitorData) {
        info[eventRoundId] = "";
        const assignmentName: string = getAssignmentName(
          competitorData[eventRoundId]
        );
        if (assignmentName !== "") {
          const roundId: string = eventRoundId.split("_")[1];
          info[eventRoundId] =
            roundData[roundId].group_name + "_" + assignmentName;
        }
      }
    }
    return info;
  }

  export function getAssignmentName(assignmentText: string): string {
    let assignmentName = "";
    if (assignmentText === String(Define.ENTRY_STRING)) {
      assignmentName = Define.COMPETITOR_TEXT;
    } else if (Define.JUDGE_STRINGS.includes(assignmentText)) {
      assignmentName = Define.JUDGE_TEXT;
    } else if (Define.SCRAMBLER_STRINGS.includes(assignmentText)) {
      assignmentName = Define.SCRAMBLER_TEXT;
    }
    return assignmentName;
  }

  export function isWCACompetition(competitorData: {
    [key: string]: { [key: string]: string };
  }): boolean {
    let isWca = false;
    Object.values(competitorData).forEach((value) => {
      if ("wca_id" in value) {
        isWca = true;
      }
    });
    return isWca;
  }

  export function getWcaLiveFinalResults() {
    const results = queryGQL(Query.RESULT, {
      id: Define.WCA_LIVE_COMPETITION_ID,
    });

    if (results.data.competition === null) {
      return undefined;
    }

    const competitionEvents = results.data.competition.competitionEvents;
    const eventResults: { [name: string]: any } = {}; // eslint-disable-line
    for (const competitionEvent of competitionEvents) {
      for (const competitionRound of competitionEvent.rounds) {
        if (competitionRound.name === "Final") {
          eventResults[competitionEvent.event.id] = competitionRound.results;
        }
      }
    }

    return eventResults;
  }

  export function convertRecord(eventId: string, record: number): string {
    if (record === 0) {
      return "";
    }
    if (record === -1) {
      return "DNF";
    }
    if (record === -2) {
      return "DNS";
    }

    // MBLD, FMC, その他で切り分ける
    const recordString = String(record);

    if (eventId === "333mbf") {
      const missed = record % 100;
      const points = 99 - (Math.floor(record / 1e7) % 100);
      const solved = points + missed;
      const attempted = solved + missed;
      const allSeconds = Math.floor(record / 100) % 1e5;
      const minutes = Math.floor(allSeconds / 60);
      const seconds = allSeconds - minutes * 60;

      return (
        solved +
        "/" +
        attempted +
        " " +
        minutes +
        ":" +
        String(seconds).padStart(2, "0")
      );
    }

    // FMCは100手以上はないと信じたいがあると困るのでeventIdで判定する
    if (eventId === "333fm" && recordString.length <= 3) {
      return recordString;
    }

    const decimal = recordString.slice(-2);
    const integer = recordString.slice(0, recordString.length - 2);
    let seconds = Number(integer);
    if (Number(integer) > 60) {
      const minutes = Math.floor(Number(integer) / 60);
      seconds = Number(integer) - minutes * 60;
      return (
        String(minutes) + ":" + String(seconds).padStart(2, "0") + "." + decimal
      );
    }

    return seconds + "." + decimal;
  }

  export function queryGQL(
    graphql: string,
    variables: { [name: string]: number }
  ) {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        query: graphql,
        variables,
      }),
    };

    const response = UrlFetchApp.fetch(Define.WCA_LIVE_ENDPOINT_URL, options);
    const json = JSON.parse(response.getContentText());
    return json;
  }
}
