"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvIO = void 0;
const fs_1 = __importDefault(require("fs"));
class CsvIO {
    static Write(filePath, data, separator = ';') {
        const stream = fs_1.default.createWriteStream(filePath);
        var headerRow = Object.keys(data[0]).join(separator);
        stream.write(headerRow);
        data.forEach(obj => {
            var dataRow = '\r\n' + Object.values(obj).map(value => {
                if (value instanceof String) {
                    return `"${value}"`;
                }
                else {
                    return `${value}`;
                }
            }).join(separator);
            stream.write(dataRow);
        });
        stream.close();
    }
}
exports.CsvIO = CsvIO;
