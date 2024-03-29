namespace Define { // eslint-disable-line
  // 以下は変更必要です
  // フォルダID
  export const DEFAULT_FOLDER_ID = "XXXXXXXXXXXXXXXXXXXXXXXXX";
  // 大会名
  export const COMPETITION_NAME = "XXX";
  // 開催日数
  export const HOLDING_DAYS = 1;

  // 以下は記録証書を作るときに変更が必要です。
  // WCA LIVE 大会ID
  export const WCA_LIVE_COMPETITION_ID = 0;
  // 記録証出力種目
  export const CERTIFICATE_EVENT_ID = "333";
  // 記録証出力グループ。""と空だと全て出力
  // 指定されたcompetitor_dayXのグループを参照
  export const CERTIFICATE_ROUND_ID = "";

  // 以下は基本変更不要です
  export const NAME = "sheep";
  export const ORIGIN_FOLDER_ID = "19HVEGwLgpsHNL2Wxbd43JU61jhMAYHde";
  export const WCA_LIVE_ENDPOINT_URL =
    "https://live.worldcubeassociation.org/api";

  export const SPREADSHEET_FILE_NAME = "competition";
  export const SCORESHEET_FOLDER_NAME = "scoresheet";
  export const SCORESHEET_OUTPUT_FOLDER_NAME = "output_scoresheet";

  export const NAMESHEET_FILE_NAME = "namesheet";
  export const NAMESHEET_FOLDER_NAME = "namesheet";
  export const NAMESHEET_OUTPUT_FOLDER_NAME = "output_namesheet";

  export const CERTIFICATE_FOLDER_NAME = "certificate";
  export const CERTIFICATE_OUTPUT_FOLDER_NAME = "output_certificate";
  export const SCORE_CERTIFICATE_FILE_NAME = "score_certificate";
  export const SCORE_CERTIFICATE_SOURCE_STRING_NAME = "val_name";
  export const SCORE_CERTIFICATE_SOURCE_STRING_EVENT = "val_event";
  export const SCORE_CERTIFICATE_SOURCE_STRING_COMPETITION_NAME =
    "val_competition_name";
  export const SCORE_CERTIFICATE_SOURCE_STRING_SOLVE = "val_solve_";
  export const SCORE_CERTIFICATE_SOURCE_STRING_AVERAGE = "val_average";
  export const SCORE_CERTIFICATE_SOURCE_STRING_BEST = "val_best";
  export const SCORE_CERTIFICATE_SOURCE_STRING_MEAN = "val_mean";

  export const CERTIFICATE_FILE_NAME = "certificate";
  export const CERTIFICATE_SOURCE_STRING_NAME = "val_name";
  export const CERTIFICATE_SOURCE_STRING_EVENT = "val_event";
  export const CERTIFICATE_SOURCE_STRING_RANK = "val_rank";
  export const CERTIFICATE_SOURCE_STRING_COMPETITION_NAME =
    "val_competition_name";

  export const PDF_OUTPUT_FOLDER_NAME = "output_pdf";

  export const COMPETITOR_TEXT = "競技";
  export const JUDGE_TEXT = "ジャッジ";
  export const SCRAMBLER_TEXT = "スクランブラー";
  export const RUNNER_TEXT = "ランナー";

  export const ENTRY_STRING = 1;
  export const JUDGE_STRINGS: string[] = ["j", "J", Define.JUDGE_TEXT];
  export const SCRAMBLER_STRINGS: string[] = [
    "s",
    "S",
    Define.SCRAMBLER_TEXT,
    "スクランブラ",
  ];
  export const RUNNER_STRINGS: string[] = [
    "r",
    "R",
    Define.RUNNER_TEXT,
    "ランナ",
  ];

  export const AVERAGE_OF_5_ATTEMPT_COUNT = 5;
  export const MEAN_OF_3_ATTEMPT_COUNT = 3;
  export const BEST_OF_3_ATTEMPT_COUNT = 3;
  export const BEST_OF_1_ATTEMPT_COUNT = 1;

  export const SPREADSHEET_COMPETITOR_NAME = "competitor";
  export const SPREADSHEET_RESULT_NAME = "result";
  export const SPREADSHEET_EVENT_NAME = "event";
  export const SPREADSHEET_ROUND_NAME = "round";

  export const SPREADSHEET_ASSIGNMENT_SHEET_NAME = "assignment";
  export const SPREADSHEET_ASSIGNMENT_SHEET_INDEX = 999; // 基本最後に追加されるように
  export const SPREADSHEET_ASSIGNMENT_SHEET_HEADER_ROW_NUM = 10;
  export const SPREADSHEET_ASSIGNMENT_WCA_BASE_HEADER_INFO: {
    [key: string]: string;
  } = {
    id: "番号",
    wca_id: "WCAID",
    name: "名前",
  };
  export const SPREADSHEET_ASSIGNMENT_SCJ_BASE_HEADER_INFO: {
    [key: string]: string;
  } = {
    id: "番号",
    scj_id: "SCJID",
    name: "名前",
  };
  export const SPREADSHEET_ASSIGNMENT_WCA_BASE_HEADER_SIZE_INFO: {
    [key: string]: number;
  } = {
    番号: 100,
    WCAID: 100,
    名前: 250,
  };
  export const SPREADSHEET_ASSIGNMENT_SCJ_BASE_HEADER_SIZE_INFO: {
    [key: string]: number;
  } = {
    番号: 100,
    SCJID: 100,
    名前: 250,
  };
  export const SPREADSHEET_ASSIGNMENT_HEADER_COLOR = "#0099FF";
  export const SPREADSHEET_ASSIGNMENT_BANDING_THEME =
    SpreadsheetApp.BandingTheme.BLUE;

  export const SPREADSHEET_RECEPTION_SHEET_NAME = "reception";
  export const SPREADSHEET_RECEPTION_SHEET_INDEX = 9999; // 基本最後に追加されるように
  export const SPREADSHEET_RECEPTION_WCA_BASE_HEADER_INFO: {
    [key: string]: string;
  } = {
    id: "番号",
    wca_id: "WCAID",
    name: "名前",
    full_name_kana: "カナ",
    guest_count: "同伴者数",
  };
  export const SPREADSHEET_RECEPTION_SCJ_BASE_HEADER_INFO: {
    [key: string]: string;
  } = {
    id: "番号",
    scj_id: "SCJID",
    full_name: "名前",
    full_name_kana: "カナ",
    guest_count: "同伴者数",
  };
  export const SPREADSHEET_RECEPTION_HEADER_INFO: string[] = [
    "受付チェック",
    "備考",
  ];
  export const SPREADSHEET_RECEPTION_WCA_BASE_HEADER_SIZE: {
    [key: string]: number;
  } = {
    番号: 100,
    WCAID: 100,
    名前: 250,
    カナ: 200,
    同伴者数: 100,
    受付チェック: 200,
    備考: 200,
  };
  export const SPREADSHEET_RECEPTION_SCJ_BASE_HEADER_SIZE: {
    [key: string]: number;
  } = {
    番号: 100,
    SCJID: 100,
    名前: 250,
    カナ: 200,
    同伴者数: 100,
    受付チェック: 200,
    備考: 200,
  };
  export const SPREADSHEET_RECEPTION_BANDING_THEME =
    SpreadsheetApp.BandingTheme.BLUE;

  export const RESULT_SHEET_NAME = "result_";
  export const RESULT_SHEET_INDEX = 99;
  export const RESULT_SHEET_NAME_COLUMN_INDEX = 2;
  export const RESULT_SHEET_NAME_SIZE = 200;
  export const RESULT_BASE_HEADER_BACKGROUND_COLOR = "#000000";
  export const RESULT_BASE_HEADER_TEXT_COLOR = "#FFFFFF";
  export const RESULT_BASE_HEADER_INFO: {
    [attemptNumber: number]: {
      [key: string]: string;
    };
  } = {
    1: {
      id: "#",
      name: "name",
      wca_user_id: "wca_user_id",
      solve_1: "1",
      best: "best",
    },
    2: {
      id: "#",
      name: "name",
      wca_user_id: "wca_user_id",
      solve_1: "1",
      solve_2: "2",
      best: "best",
    },
    3: {
      id: "#",
      name: "name",
      wca_user_id: "wca_user_id",
      solve_1: "1",
      solve_2: "2",
      solve_3: "3",
      best: "best",
      mean: "mean",
    },
    5: {
      id: "#",
      name: "name",
      wca_user_id: "wca_user_id",
      solve_1: "1",
      solve_2: "2",
      solve_3: "3",
      solve_4: "4",
      solve_5: "5",
      best: "best",
      average: "average",
    },
  };

  export const CERTIFICATE_MIN_RANKING = 3;
  export const CERTIFICATE_RANK_INFO: { [key: string]: string } = {
    1: "優勝",
    2: "準優勝",
    3: "第3位",
  };

  export const EVENT_ID_NAME_INFO: { [key: string]: string } = {
    "333": "3x3x3キューブ",
    "222": "2x2x2キューブ",
    "444": "4x4x4キューブ",
    "555": "5x5x5キューブ",
    "666": "6x6x6キューブ",
    "777": "7x7x7キューブ",
    "333bf": "3x3x3目隠し",
    "333fm": "3x3x3最小手数",
    "333oh": "3x3x3片手",
    clock: "クロック",
    minx: "メガミンクス",
    pyram: "ピラミンクス",
    skewb: "スキューブ",
    sq1: "スクエア1",
    "444bf": "4x4x4目隠し",
    "555bf": "5x5x5目隠し",
    "333mbf": "3x3x3複数目隠し",
  };

  // 自由出力
  export const FREE_SHEET_NAME = "free";
  export const FREE_CERTIFICATE_FILE_NAME = "free_certificate";
  export const FREE_CERTIFICATE_CHECK_KEY = "CHECK";
  export const FREE_CERTIFICATE_IGNORE_KEYS: string[] = ["CHECK", "ID"];
}
