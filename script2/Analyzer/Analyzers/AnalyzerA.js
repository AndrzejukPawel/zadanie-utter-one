"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerA = void 0;
class AnalyzerA {
    constructor(db) {
        this.query = `
        SELECT value as word, count(value) as number_of
        FROM(
            WITH rcte_split AS (
                -- initial seed query for the recursive CTE
                SELECT trim(displayName,' ')||' ' as remainder
                , ' ' as delim
                , 0 as lvl
                , '' as value
                FROM Playlist
            
                UNION ALL 
                
                -- repeat recursion till nothing remains
                SELECT
                substr(remainder, instr(remainder, delim)+1)
                , delim
                , lvl+1
                , substr(remainder, 0, instr(remainder, delim))
                FROM rcte_split 
                WHERE remainder != ''
            ) 
            SELECT row_number() over (order by lvl) rn, value
            FROM rcte_split 
            WHERE value != ''
        )x
        WHERE LENGTH(value) >= 3
        group by value
        order by count(value) DESC, value ASC;`;
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
exports.AnalyzerA = AnalyzerA;
