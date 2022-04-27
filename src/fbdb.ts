import { DBCommand, DB_COMMAND } from "./db";

export class Database {

    dataStore: Map<string, string>
    valueStore: Map<string, number>

    constructor(){
        this.dataStore = new Map<string, string>()
        this.valueStore = new Map<string, number>()
    }

    
    get(cmd: DBCommand): string {
        let value = this.dataStore.get(cmd.key) || ""
        return value
    } 

    set(cmd: DBCommand): boolean {
        
        if(!cmd.value)
            return false

        this.dataStore.set(cmd.key, cmd.value)

        let valFreq = this.valueStore.get(cmd.value)

        if(valFreq === undefined)
            this.valueStore.set(cmd.value, 1)
        else
            this.valueStore.set(cmd.value, valFreq + 1)
        
        return true
    }

    unset(cmd: DBCommand): boolean{

        let value = this.get(cmd)

        if(value != undefined){
            let valFreq = this.valueStore.get(value) || 0

            if(valFreq > 0)
                this.valueStore.set(value, valFreq - 1)
        }

        this.dataStore.delete(cmd.key)

        return true
    }

    numEqualTo(cmd: DBCommand): number{

        if(!cmd.value)
            throw Error("Error while executing NUMEQUALTO")

        let valFreq = this.valueStore.get(cmd.value) || 0

        return valFreq
    }

    /*commit(commands: Array<DBCommand>): boolean{

        commands.forEach((dbCmd) => {
            if(dbCmd.command === DB_COMMAND.GET){
                this.get(dbCmd.key)
            }
        })
    }*/
}

