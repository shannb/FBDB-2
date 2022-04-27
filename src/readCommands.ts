import * as readline from 'readline';
import { Database } from './fbdb';
import { DBCommand, DB_COMMAND } from './db'

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class CommandGenerator{

  command: string

  constructor(){
    this.command = ""
  }

  generateCommand(strCmd: string): DBCommand{
    let strCmdArr: string[] = strCmd.split(' ')

    let command = {
      command: strCmdArr[0],
      key: strCmdArr[1] || '',
      value: strCmdArr[2] || null
    }

    if(strCmdArr[0] === DB_COMMAND.NUMEQUALTO){
      command.value = strCmdArr[1]
      command.key = ''
    }

    return command
  }
}

let db: Database = new Database();

export function recursiveAsyncReadLine() {

  
  let cg: CommandGenerator = new CommandGenerator()

    rl.question('Enter DB Command > ', function (answer) {
        let command: string = answer.split(' ')[0]
        let generatedCommand = cg.generateCommand(answer)
        switch(command) {

            case "SET":
              db.set(generatedCommand)
            break;
            case 'GET':
              let value = db.get(generatedCommand)
              console.log(value)
            break;
            case 'UNSET':
              db.unset(generatedCommand)
            break;
            case 'NUMEQUALTO':
              let equalTo = db.numEqualTo(generatedCommand)
              console.log(equalTo)
                break;
            case 'BEGIN':
              break;
            case 'COMMIT':
              break;
            case 'END':
                break
                        
            default:
            console.log('Invalid Command!');
            break;
        }

        if(command === 'END')
            return rl.close()
  
      recursiveAsyncReadLine(); //Calling this function again to ask new question
    });
  };

  
