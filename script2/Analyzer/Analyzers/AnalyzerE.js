"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerE = void 0;
class AnalyzerE {
    constructor(db) {
        this.query = `
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
exports.AnalyzerE = AnalyzerE;
