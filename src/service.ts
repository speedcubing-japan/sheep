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
    // ????????????????????????
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
      // ????????????????????????
      if (row[EVENT_IS_HELD_RAW_INDEX] === "true") {
        // ????????????ID????????????????????????
        obj[row[EVENT_EVENT_ID_RAW_INDEX]] = {};
        Object.entries(row).forEach(([key, value]) => {
          obj[row[EVENT_EVENT_ID_RAW_INDEX]][keys[Number(key)]] = value;
        });
      }
    }
    return obj;
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
      // ????????????ID????????????????????????
      obj[row[ROUND_ID_RAW_INDEX]] = {};
      Object.entries(row).forEach(([key, value]) => {
        obj[row[ROUND_ID_RAW_INDEX]][keys[Number(key)]] = value;
      });
    }
    return obj;
  }

  // ???????????????event_id + _ + round_id????????????????????????
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

  // ?????????????????????????????????????????????
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
}
