"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramArguments_1 = require("./ProgramArguments");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const AnalyzerFactory_1 = require("./Analyzer/AnalyzerFactory");
const CsvIO_1 = require("../Utilities/CsvIO");
class App {
    constructor(args) {
        var params = new ProgramArguments_1.ProgramArguments(args.slice(2));
        const db = new better_sqlite3_1.default(params.databasePath);
        const analyzerFactory = new AnalyzerFactory_1.AnalyzerFactory(db);
        params.analyzerTypes.forEach((type) => {
            const analyzer = analyzerFactory.getAnalyzer(type);
            var result = analyzer.getResult();
            var outputFileName = params.outputFolder + "/result_" + type + ".csv";
            CsvIO_1.CsvIO.Write(outputFileName, result);
        });
    }
}
new App(process.argv);
//node ./script2/app.js -databasePath D:/tmp/db.sqlite -analyzerTypes abcdefg -outputFolder D:/tmp
