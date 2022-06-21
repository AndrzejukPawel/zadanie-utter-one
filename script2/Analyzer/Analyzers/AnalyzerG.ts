import { IAnalyzer } from "../IAnalyzer";
import { Database } from 'better-sqlite3'

export class AnalyzerG implements IAnalyzer{
    
    private readonly query = `
        select displayName 
        FROM Playlist;`;

    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    getResult(): object[] {
        var statement = this.db.prepare(this.query);
        var dataRows:object[] = [];

        for(var row of statement.iterate()){
            dataRows.push(row);
        }

        var regExp = new RegExp(`((\\d\\d\\d\\d)|(\\d\\d(('s)|(s))))`);
        return [{numberOfPlaylistsWithYearOrDecade: dataRows.filter(dataRow => {
            return regExp.test((dataRow as {displayName:string}).displayName)
        }).length}];
    }

}