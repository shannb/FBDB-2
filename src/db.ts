



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
    COMMIT = "COMMIT"
}