/* eslint-disable */
namespace Query {
  export const RESULT_PERSON = "query Competition($id: ID!) {\
    competition(id: $id) {\
      id\
      name\
      competitionEvents {\
        event {\
          id\
          name\
        }\
        rounds {\
          name\
          results {\
            id\
            person {\
              id\
              wcaUserId\
              wcaId\
              name\
            }\
          }\
        }\
      }\
    }\
  }";

  export const RESULT_RECORD = "query Competition($id: ID!) {\
    competition(id: $id) {\
      id\
      name\
      competitionEvents {\
        event {\
          id\
          name\
        }\
        rounds {\
          name\
          results {\
            id\
            ranking\
            best\
            average\
            attempts {\
              result\
            }\
          }\
        }\
      }\
    }\
  }";
}
