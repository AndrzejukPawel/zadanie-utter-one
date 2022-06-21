import { IAnalyzer } from "../IAnalyzer";
import { Database } from 'better-sqlite3'

export class AnalyzerD implements IAnalyzer{
    
    private readonly query = `
        select locale, count(locale) as number_of_playlists 
        from Playlist p
        group by locale 
        order by locale;`;

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