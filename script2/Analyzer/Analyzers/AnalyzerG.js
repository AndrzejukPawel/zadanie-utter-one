"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerG = void 0;
class AnalyzerG {
    constructor(db) {
        this.query = `
        select displayName 
        FROM Playlist;`;
        this.db = db;
    }
    getResult() {
        var statement = this.db.prepare(this.query);
        var dataRows = [];
        for (var row of statement.iterate()) {
            dataRows.push(row);
        }
        var regExp = new RegExp(`((\\d\\d\\d\\d)|(\\d\\d(('s)|(s))))`);
        return [{ numberOfPlaylistsWithYearOrDecade: dataRows.filter(dataRow => {
                    return regExp.test(dataRow.displayName);
                }).length }];
    }
}
exports.AnalyzerG = AnalyzerG;
