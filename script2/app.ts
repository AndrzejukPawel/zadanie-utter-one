import { ProgramArguments } from "./ProgramArguments";
import Database from 'better-sqlite3'
import { AnalyzerFactory } from './Analyzer/AnalyzerFactory'
import { CsvIO } from '../Utilities/CsvIO'

class App{

    private defineRegExpFunction(db: Database){
        db.function('regexp', { deterministic: true }, (regex, text) => {
            return new RegExp(regex).test(text) ? 1 : 0;
        });
    }

    constructor(args: string[]){
        var params = new ProgramArguments(args.slice(2));

        const db = new Database(params.databasePath);
        this.defineRegExpFunction(db);
        
        const analyzerFactory = new AnalyzerFactory(db);

        params.analyzerTypes.forEach((type) =>{
            const analyzer = analyzerFactory.getAnalyzer(type);
            var result = analyzer.getResult();
            var outputFileName = params.outputFolder + "/result_" + type + ".csv";
            CsvIO.Write(outputFileName, result);
        })
    }
}

new App(process.argv);

//node ./script2/app.js -databasePath D:/tmp/db.sqlite -analyzerTypes abcdefg -outputFolder D:/tmp