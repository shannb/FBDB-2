

export interface DBCommand {
    command: string,
    key: string,
    value?: string | null
}

export enum DB_COMMAND {
    GET = "GET",
    SET = "SET",
    UNSET = "UNSET",
    NUMEQUALTO = "NUMEQUALTO",
    BEGIN = "BEGIN",
    COMMIT = "COMMIT"
}

export enum INPUT_VALUE_IDX {
    COMMAND = 0,
    KEY_OR_NUMEQUAL_VAL = 1,
    VALUE = 2
}