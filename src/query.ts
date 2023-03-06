/* eslint-disable */
namespace Query {
  export const RESULT = "query Competition($id: ID!) {\
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
              wcaId\
              name\
            }\
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
