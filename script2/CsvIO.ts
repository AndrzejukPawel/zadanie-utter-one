import fs from 'fs';

export abstract class CsvIO{
    static Write(filePath: string, data: object[], separator: string = ';'){
        const stream = fs.createWriteStream(filePath);
        var headerRow = Object.keys(data[0]).join(separator);

        stream.write(headerRow);

        data.forEach(obj => {
            var dataRow = '\r\n' + Object.values(obj).map(value =>{
                if(value instanceof String){
                    return `"${value}"`;
                }
                else{
                    return `${value}`;
                }
            }).join(separator);
            stream.write(dataRow);
        })
        stream.close();
    }
}