"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerB = void 0;
class AnalyzerB {
    constructor(db) {
        this.query = `
        select s.songId, count(psl.songId) as numberOfPLaylists
        from (select songId from Song s group by songId) s 
        left join PlaylistSongList psl on s.songId = psl.songId 
        group by s.songId;`;
        this.db = db;
    }
    getResult() {
        var statement = this.db.prepare(this.query);
        var result = [];
        for (var row of statement.iterate()) {
            result.push(row);
        }
        return result;
    }
}
exports.AnalyzerB = AnalyzerB;
