"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramArguments = void 0;
class ProgramArguments {
    constructor(args) {
        for (let i = 0; i < args.length; i += 2) {
            var arg = args[i];
            var argValue = args[i + 1];
            switch (arg) {
                case "-analyzerTypes": {
                    this.analyzerTypes = argValue.split('');
                    break;
                }
                case "-outputFolder": {
                    this.outputFolder = argValue;
                    break;
                }
                case "-databasePath": {
                    this.databasePath = argValue;
                    break;
                }
                default: {
                    console.log("Unknown argument specified!");
                    process.exit(9);
                }
            }
        }
    }
}
exports.ProgramArguments = ProgramArguments;
