import { IAnalyzer } from "../IAnalyzer";
import { Database } from 'better-sqlite3'

export class AnalyzerC implements IAnalyzer{
    
    private readonly query = `
        select categoryId, count(categoryId) as numberOfPlaylists 
        from Playlist p
        group by categoryId 
        order by categoryId;`;

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