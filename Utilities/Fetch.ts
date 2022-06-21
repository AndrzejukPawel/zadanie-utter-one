import axios, { AxiosRequestHeaders } from "axios";
import axiosThrottle from 'axios-request-throttle';
import axiosRetry from 'axios-retry';


axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    }
});

export class Fetch
{
    static setThrottle(requestsPerSecond: number){
        axiosThrottle.use(axios, {requestsPerSecond: requestsPerSecond});
    }

    static async Get(url: string, headers?: AxiosRequestHeaders): Promise<any> {
        try{
            const {data, status} = await axios({ url: url, method: "GET", headers: headers});
            return data;
        }catch(error){
            if(axios.isAxiosError(error)){
                console.log('Axios error: ', error.message, ' code: ', error.code, error.response)
                return error.message;
            }
            else{
                console.log('Unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }

    static async Post(url: string, body: any, headers?: AxiosRequestHeaders): Promise<any> {
        try{
            const {data, status} = await axios({ url: url, method: "POST", headers: headers, data: body});
            return data;
        }catch(error){
            if(axios.isAxiosError(error)){
                console.log('Axios error: ', error.message, ' code: ', error.code, error.response)
                return error.message;
            }
            else{
                console.log('Unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
}
 