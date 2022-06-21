"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetch = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_request_throttle_1 = __importDefault(require("axios-request-throttle"));
const axios_retry_1 = __importDefault(require("axios-retry"));
(0, axios_retry_1.default)(axios_1.default, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    }
});
class Fetch {
    static setThrottle(requestsPerSecond) {
        axios_request_throttle_1.default.use(axios_1.default, { requestsPerSecond: requestsPerSecond });
    }
    static async Get(url, headers) {
        try {
            const { data, status } = await (0, axios_1.default)({ url: url, method: "GET", headers: headers });
            return data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.log('Axios error: ', error.message, ' code: ', error.code, error.response);
                return error.message;
            }
            else {
                console.log('Unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
    static async Post(url, body, headers) {
        try {
            const { data, status } = await (0, axios_1.default)({ url: url, method: "POST", headers: headers, data: body });
            return data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.log('Axios error: ', error.message, ' code: ', error.code, error.response);
                return error.message;
            }
            else {
                console.log('Unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
}
exports.Fetch = Fetch;
