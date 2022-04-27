import { DBCommand, DB_COMMAND, INPUT_VALUE_IDX } from "./db";

export class Database {
    private static instance: Database;

    dataStore: Map<string, string>
    valueStore: Map<string, number>

    private constructor(){
        this.dataStore = new Map<string, string>()
        this.valueStore = new Map<string, number>()
    }

    public static getInstance(): Database {
        if(!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
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

    commit(commands: Array<DBCommand>){

        commands.forEach((dbCmd) => {
            switch(dbCmd.command){
                case "SET":
                    this.set(dbCmd)
                    break;
                case "GET":
                    this.get(dbCmd)
                    break;
                case "UNSET":
                    this.unset(dbCmd)
                    break;
                default:
                break;
            }
        })
    }
}

export class CommandProcessor{

    command: string
    transMgr: TransactionMgr
    transactionInProgress: boolean
  
    constructor(){
      this.command = ""
      this.transMgr = new TransactionMgr()
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
        
        if(inputCmd.command === DB_COMMAND.ROLLBACK &&
            this.transactionInProgress === false){
            return "NO TRANSACTION"
        }
        else if(this.transactionInProgress){
            this.transMgr.processCommand(inputCmd)

            if(inputCmd.command === DB_COMMAND.COMMIT){
                this.transactionInProgress = false
            }
        }else if(!this.transactionInProgress && 
                inputCmd.command === DB_COMMAND.BEGIN){
                this.transactionInProgress = true
                this.transMgr.processCommand(inputCmd)
        }
        else{
            let db = Database.getInstance()
            switch(inputCmd.command) {

                case "SET":
                  db.set(inputCmd)
                break;
                case 'GET':
                  return db.get(inputCmd)
                case 'UNSET':
                  db.unset(inputCmd)
                break;
                case 'NUMEQUALTO':
                   return db.numEqualTo(inputCmd) + ''
                            
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

        if(cmd.command === DB_COMMAND.ROLLBACK){
            let idx = this.commands.length - 1
            let mostRecentBeginExists = true
            while(mostRecentBeginExists){
                
                if(this.commands[idx].command === DB_COMMAND.BEGIN){
                    mostRecentBeginExists = false
                }
                this.commands.pop()
            }

            return
        }else if(cmd.command === DB_COMMAND.COMMIT){
             Database.getInstance().commit(this.commands)
             this.commands = []   
        }else{
            this.commands.push(cmd)
        }
    }
 }

