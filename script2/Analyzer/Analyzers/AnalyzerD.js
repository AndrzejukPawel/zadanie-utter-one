"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerD = void 0;
class AnalyzerD {
    constructor(db) {
        this.query = `
        select locale, count(locale) as number_of_playlists 
        from Playlist p
        group by locale 
        order by locale;`;
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
exports.AnalyzerD = AnalyzerD;
