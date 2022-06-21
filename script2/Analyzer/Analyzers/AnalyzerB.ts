import { IAnalyzer } from "../IAnalyzer";
import { Database } from 'better-sqlite3'

export class AnalyzerB implements IAnalyzer{
    
    private readonly query = `
        select s.songId, count(psl.songId) as numberOfPLaylists
        from (select songId from Song s group by songId) s 
        left join PlaylistSongList psl on s.songId = psl.songId 
        group by s.songId;`;

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