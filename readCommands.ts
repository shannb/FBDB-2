import * as readline from 'readline';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/*rl.question('Please Enter Your DB Command?', (answer) => {

  let command  = answer.split(' ')
  switch(command[0]) {
    case "SET":
      console.log('You wish to perform SET');
      break;
    case 'GET':
      console.log('Sorry! :(');
      break;
    case 'UNSET':
      console.log()
      break;
    case 'NUMEQUALTO':
        break;
    case 'END':
        r1.close()
    default:
      console.log('Invalid answer!');
      break;
  }
  //rl.close();
});*/

function recursiveAsyncReadLine() {
    rl.question('Enter DB Command > ', function (answer) {
        let command: string = answer.split('')[0]
        console.log(command)
        switch(command) {
            case "SET":
            break;
            case 'GET':
            console.log('Sorry! :(');
            break;
            case 'UNSET':
            console.log()
            break;
            case 'NUMEQUALTO':
                break;
            case 'END':
                break            
            default:
            console.log('Invalid answer!');
            break;
        }

        if(command === 'END')
            return rl.close()
      /*if (answer == 'exit') //we need some base case, for recursion
        return rl.close(); //closing RL and returning from function.
      console.log('Got it! Your answer was: "', answer, '"');*/
      recursiveAsyncReadLine(); //Calling this function again to ask new question
    });
  };

  recursiveAsyncReadLine()
  
/*function commandPrompt(){
    let runPrompt = true
    while(runPrompt){
        rl.question('Please Enter Your DB Command?', (answer) => {
            let command = answer.split(' ')
            
        })

        if(!runPrompt)
            rl.close()
    }
    
}

commandPrompt()*/