"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramArguments_1 = require("./ProgramArguments");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const AnalyzerFactory_1 = require("./Analyzer/AnalyzerFactory");
const CsvIO_1 = require("./CsvIO");
class App {
    defineRegExpFunction(db) {
        db.function('regexp', { deterministic: true }, (regex, text) => {
            return new RegExp(regex).test(text) ? 1 : 0;
        });
    }
    main(args) {
        var params = new ProgramArguments_1.ProgramArguments(args.slice(2));
        const db = new better_sqlite3_1.default(params.databasePath);
        this.defineRegExpFunction(db);
        const analyzerFactory = new AnalyzerFactory_1.AnalyzerFactory(db);
        params.analyzerTypes.forEach((type) => {
            const analyzer = analyzerFactory.getAnalyzer(type);
            var result = analyzer.getResult();
            var outputFileName = params.outputFolder + "/result_" + type + ".csv";
            CsvIO_1.CsvIO.Write(outputFileName, result);
        });
    }
}
new App().main(process.argv);
//node ./script2/app.js -databasePath D:/tmp/db.sqlite -analyzerTypes a -outputFolder D:/tmp
/*****
analizator danych lokalnych, który ma następujące
możliwości (parametr w linii poleceń powinien wybrać typ analizy):
A    - określanie najpopularniejszych słów o minimum 3 znakach w nazwie playlisty (displayName) + wyświetlenie ich w kolejności od najpopularniejszego, przy czym nie wyświetlamy słów występujących tylko raz
B    - określenie w ilu playlistach jest używana każda z piosenek
C    - określenie ile jest playlist w każdej z kategorii (categoryId)
D    - określenie ile jest playlist w każdej "lokalizacji" (locale)
E    - wyświetlenie playlist nie mających nazwy lub opisu (wymienić które nie mają z ich ID)
F    - zliczenie ilości piosenek per wydawca/wytwórnia (label z rozbiciem na sublabel)
G    - określenie ile playlist zawiera w nazwie rok (1984, 2012, etc.) lub dekadę (80's, 80s, etc.)
*    - jeśli coś przyjdzie Ci do głowy jeszcze to zawsze będzie na plus :)
*****/ 
