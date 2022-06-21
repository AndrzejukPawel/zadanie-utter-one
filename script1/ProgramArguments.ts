export class ProgramArguments{
    url:string;
    databasePath:string;

    constructor(args: string[]){
        for(let i = 0; i < args.length; i+=2){
            var argName = args[i];
            var argValue = args[i+1];
        
            switch(argName){
                case "-url":{
                    this.url = argValue;
                    break;
                }
                case "-databasePath":{
                    this.databasePath = argValue;
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