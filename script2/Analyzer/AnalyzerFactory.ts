import { IAnalyzer } from "./IAnalyzer";
import { AnalyzerA } from "./Analyzers/AnalyzerA";
import { AnalyzerB } from "./Analyzers/AnalyzerB";
import { AnalyzerC } from "./Analyzers/AnalyzerC";
import { AnalyzerD } from "./Analyzers/AnalyzerD";
import { AnalyzerE } from "./Analyzers/AnalyzerE";
import { AnalyzerF } from "./Analyzers/AnalyzerF";
import { AnalyzerG } from "./Analyzers/AnalyzerG";
import { Database } from 'better-sqlite3'

export class AnalyzerFactory{

    private db:Database;

    constructor(db: Database){
        this.db = db;
    }

    getAnalyzer(type: string): IAnalyzer{
        switch(type){
            case 'a': {
                return new AnalyzerA(this.db);
            }
            case 'b': {
                return new AnalyzerB(this.db);
            }
            case 'c': {
                return new AnalyzerC(this.db);
            }
            case 'd': {
                return new AnalyzerD(this.db);
            }
            case 'e': {
                return new AnalyzerE(this.db);
            }
            case 'f': {
                return new AnalyzerF(this.db);
            }
            case 'g': {
                return new AnalyzerG(this.db);
            }
        }
        throw new Error(`Unknown analyzer ${type}`);
    }
}