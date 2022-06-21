import { IAnalyzer } from "../IAnalyzer";
import { Database } from 'better-sqlite3'

export class AnalyzerE implements IAnalyzer{
    
    private readonly query = `
        select *
        from(
            select playlistId, 'missing name' as problem
            from Playlist p 
            where displayName = '' or displayName is null
            union
            select playlistId, 'missing description' as problem
            from Playlist p 
            where description  = '' or description is null
        )x 
        order by playlistId;`;

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