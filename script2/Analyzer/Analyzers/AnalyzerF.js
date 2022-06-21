"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerF = void 0;
class AnalyzerF {
    constructor(db) {
        this.query = `
    select label, subLabel, count(*) as numberOfSongs
    from SongGrouped sg 
    group by label, subLabel
    order by label, subLabel;`;
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
exports.AnalyzerF = AnalyzerF;
