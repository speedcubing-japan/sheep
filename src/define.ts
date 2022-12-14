namespace Define { // eslint-disable-line
  // 以下は変更必要です
  // フォルダID
  export const DEFAULT_FOLDER_ID = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  // 大会名
  export const COMPETITION_NAME = "XXX";
  // 開催日数
  export const HOLDING_DAYS = 1;

  // 以下は基本変更不要です
  export const NAME = "sheep";
  export const ORIGIN_FOLDER_ID = "19HVEGwLgpsHNL2Wxbd43JU61jhMAYHde";

  export const SPREADSHEET_FILE_NAME = "competition";
  export const SCORESHEET_FOLDER_NAME = "scoresheet";
  export const SCORESHEET_OUTPUT_FOLDER_NAME = "output_scoresheet";

  export const NAMESHEET_FOLDER_NAME = "namesheet";
  export const NAMESHEET_OUTPUT_FOLDER_NAME = "output_namesheet";
  export const NAMESHEET_FILE_NAME = "namesheet";

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

  export const SPREADSHEET_COMPETITOR_NAME = "competitor";
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
}
