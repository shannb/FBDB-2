import * as readline from 'readline';
import { DB_COMMAND } from './db';
import { CommandProcessor } from './fbdb';


let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let cp = new CommandProcessor()

export function recursiveAsyncReadLine() {

    rl.question('Enter DB Command > ', function (answer) {
        let command: string = answer.split(' ')[0]

        if(command === 'END')
            return rl.close()
        else
          console.log(cp.processInput(answer) || '')
  
      recursiveAsyncReadLine();
    });
  };

  
