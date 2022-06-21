import axios from "axios";
import axiosThrottle from 'axios-request-throttle';
import axiosRetry from 'axios-retry';

axiosThrottle.use(axios, {requestsPerSecond: 5});

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    }
});

export class Fetch
{
    static async Get(url: string): Promise<any> {
        try{
            const {data, status} = await axios(url, {method: "GET"});
            return data;
        }catch(error){
            if(axios.isAxiosError(error)){
                console.log('Axios error: ', error.message, ' code: ', error.code)
                return error.message;
            }
            else{
                console.log('Unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
}
 