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
  export const SCORESHEET_SOURCE_STRING_COMPETITOR_ID = "val_competitor_id";
  export const SCORESHEET_SOURCE_STRING_SPECIFIC_ID = "val_specific_id";
  export const SCORESHEET_SOURCE_STRING_ROUND = "val_round";
  export const SCORESHEET_SOURCE_STRING_GROUP = "val_group";
  export const SCORESHEET_SOURCE_STRING_EVENT_NAME = "val_event_name";
  export const SCORESHEET_SOURCE_STRING_WCA_NAME = "val_wca_name";
  export const SCORESHEET_SOURCE_STRING_ROME_NAME = "val_rome_name";
  export const SCORESHEET_SOURCE_STRING_FULL_NAME = "val_full_name";
  export const SCORESHEET_SOURCE_STRING_KANA_NAME = "val_kana_name";
  export const SCORESHEET_SOURCE_STRING_SEQUENCE = "val_sequence";
  export const SCORESHEET_SOURCE_STRING_COMPETITION_NAME =
    "val_competition_name";
  export const SCORESHEET_SOURCE_STRING_CUTOFF_TIME = "val_cutoff_time";
  export const SCORESHEET_SOURCE_STRING_LIMIT_TIME = "val_limit_time";

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

  export const ENTRY_STRING = 1;
  export const JUDGE_STRINGS: string[] = ["j", "J", Define.JUDGE_TEXT];
  export const SCRAMBLER_STRINGS: string[] = [
    "s",
    "S",
    Define.SCRAMBLER_TEXT,
    "スクランブラ",
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
  export const SPREADSHEET_ASSIGNMENT_SHEET_INDEX = 99; // 基本最後に追加されるように
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
  export const SPREADSHEET_RECEPTION_SHEET_INDEX = 999; // 基本最後に追加されるように
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
}
