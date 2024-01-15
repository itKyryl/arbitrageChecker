import axios, { AxiosInstance } from "axios";
import { GetTtAccounts, GetTtAdsParams, TikTokAccounts, TikTokAds, TikTokResponse, UpdateTtAdStatus } from "../types";

class TikTokAPI {
    private base: AxiosInstance;

    constructor(accessToken: string) {
        this.base = axios.create({
            baseURL: 'https://business-api.tiktok.com/open_api/v1.3',
            headers: {
                'Access-Token': accessToken,
                'Content-Type': 'application/json'
            }
        })
    }

    public async getAds(params: GetTtAdsParams): Promise<TikTokAds> {
        const response = await this.base.get('/ad/get/', {params});

        const data = response.data as TikTokResponse<TikTokAds>;

        if(data.code === 0) return data.data;
        else throw new Error(`Error when trying to collect ads for advertiser ${params.advertiser_id}. Message: ${data.message}.`);
    }

    public async getAllAccounts(params: GetTtAccounts): Promise<TikTokAccounts> {
        const response = await this.base.get('/oauth2/advertiser/get', {params});

        const data = response.data as TikTokResponse<TikTokAccounts>;

        if(data.code === 0) return data.data;
        else throw new Error(`Error when trying to collect accounts. Message: ${data.message}.`);
    }

    public async updateAdStatus(params: UpdateTtAdStatus): Promise<void> {
        const response = await this.base.post('/ad/status/update/', params);

        const data = response.data as TikTokResponse<any>;
        if(data.code !== 0) {
            throw new Error(`Unable to change ads status to ${params.operation_status}. Message ${data.message}`);
        }
    }
}

export default TikTokAPI;