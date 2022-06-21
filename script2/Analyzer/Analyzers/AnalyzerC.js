"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerC = void 0;
class AnalyzerC {
    constructor(db) {
        this.query = `
        select categoryId, count(categoryId) as numberOfPlaylists 
        from Playlist p
        group by categoryId 
        order by categoryId;`;
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
exports.AnalyzerC = AnalyzerC;
