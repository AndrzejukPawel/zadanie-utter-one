"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerFactory = void 0;
const AnalyzerA_1 = require("./Analyzers/AnalyzerA");
const AnalyzerB_1 = require("./Analyzers/AnalyzerB");
const AnalyzerC_1 = require("./Analyzers/AnalyzerC");
const AnalyzerD_1 = require("./Analyzers/AnalyzerD");
const AnalyzerE_1 = require("./Analyzers/AnalyzerE");
const AnalyzerF_1 = require("./Analyzers/AnalyzerF");
const AnalyzerG_1 = require("./Analyzers/AnalyzerG");
class AnalyzerFactory {
    constructor(db) {
        this.db = db;
    }
    getAnalyzer(type) {
        switch (type) {
            case 'a': {
                return new AnalyzerA_1.AnalyzerA(this.db);
            }
            case 'b': {
                return new AnalyzerB_1.AnalyzerB(this.db);
            }
            case 'c': {
                return new AnalyzerC_1.AnalyzerC(this.db);
            }
            case 'd': {
                return new AnalyzerD_1.AnalyzerD(this.db);
            }
            case 'e': {
                return new AnalyzerE_1.AnalyzerE(this.db);
            }
            case 'f': {
                return new AnalyzerF_1.AnalyzerF(this.db);
            }
            case 'g': {
                return new AnalyzerG_1.AnalyzerG(this.db);
            }
        }
        throw new Error(`Unknown analyzer ${type}`);
    }
}
exports.AnalyzerFactory = AnalyzerFactory;
