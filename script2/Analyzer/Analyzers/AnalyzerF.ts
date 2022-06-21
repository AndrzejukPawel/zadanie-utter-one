import { IAnalyzer } from "../IAnalyzer";
import { Database } from 'better-sqlite3'

export class AnalyzerF implements IAnalyzer{
    
    private readonly query = `
    select label, subLabel, count(*) as numberOfSongs
    from SongGrouped sg 
    group by label, subLabel
    order by label, subLabel;`;

    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    getResult(): object[] {
        var statement = this.db.prepare(this.query);
        var result:object[] = [];

        for(var row of statement.iterate()){
            result.push(row);
        }
        return result;
    }

}