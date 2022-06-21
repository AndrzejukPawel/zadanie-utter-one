export class ProgramArguments{
    action: string;
    actionParameter: string;
    oauthToken: string;
    databasePath: string;
    outputFolder: string;
    userId: string;

    constructor(args: string[]){
        for(let i = 0; i < args.length; i+=2){
            var arg = args[i];
            var argValue = args[i+1];
            switch(arg){
                case "-action":{
                    this.action = argValue;
                    break;
                }
                case "-actionParameter":{
                    this.actionParameter = argValue;
                    break;
                }
                case "-outputFolder":{
                    this.outputFolder = argValue;
                    break;
                }
                case "-oauthToken":{
                    this.oauthToken = argValue;
                    break;
                }
                case "-databasePath":{
                    this.databasePath = argValue;
                    break;
                }
                case "-userId":{
                    this.userId = argValue;
                    break;
                }
                default:{
                    console.log("Unknown argument specified!");
                    process.exit(9);
                }
            }
        }
    }
}