import { DBCommand, DB_COMMAND, INPUT_VALUE_IDX } from "./db";

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

export class CommandProcessor{

    command: string
    transMgr: TransactionMgr
    db: Database
    transactionInProgress: boolean
  
    constructor(){
      this.command = ""
      this.transMgr = new TransactionMgr()
      this.db = new Database()
      this.transactionInProgress = false
    }
  
    generateCommand(strCmd: string): DBCommand{
      let strCmdArr: string[] = strCmd.split(' ')
  
      let command = {
        command: strCmdArr[INPUT_VALUE_IDX.COMMAND],
        key: strCmdArr[INPUT_VALUE_IDX.KEY_OR_NUMEQUAL_VAL] || '',
        value: strCmdArr[INPUT_VALUE_IDX.VALUE] || null
      }
  
      if(strCmdArr[INPUT_VALUE_IDX.COMMAND] === DB_COMMAND.NUMEQUALTO){
        command.value = strCmdArr[INPUT_VALUE_IDX.KEY_OR_NUMEQUAL_VAL]
        command.key = ''
      }
  
      return command
    }

    processInput(cmdStr: string): string | null | undefined{
        let inputCmd = this.generateCommand(cmdStr)

        this.transactionInProgress = inputCmd.command === DB_COMMAND.BEGIN

        if(this.transactionInProgress){
            this.transMgr.processCommand(inputCmd)

            if(inputCmd.command === DB_COMMAND.COMMIT){
                this.transactionInProgress = false
            }
        }else{
            switch(inputCmd.command) {

                case "SET":
                  this.db.set(inputCmd)
                break;
                case 'GET':
                  return this.db.get(inputCmd)
                case 'UNSET':
                  this.db.unset(inputCmd)
                break;
                case 'NUMEQUALTO':
                   return this.db.numEqualTo(inputCmd) + ''
                            
                default:
                    return 'Invalid Command!'
                break;
            }
        }
    }
  }

class TransactionMgr {
    commands: DBCommand[]
 
    constructor(){
     this.commands = new Array<DBCommand>()
    }
 
    processCommand(cmd: DBCommand){
        this.commands.push(cmd)
    }
 }

