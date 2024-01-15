import axios, { AxiosInstance } from "axios";
import { BinomDomain, BinomGetAllDomainsParams } from '../types';

class BinomPublicApi {
    private base: AxiosInstance;

    constructor() {
        this.base = axios.create({
            baseURL: 'https://routexpanel.com/arm.php'
        })
    }

    public async getAllDomains(params: BinomGetAllDomainsParams): Promise<BinomDomain[]> {
        const response = await this.base.get('', {params});
        const data = response.data as BinomDomain[];

        if(Array.isArray(data)) {
            return data;
        } else throw new Error(`Unable to collect binom domains. Response data ${JSON.stringify(data)}`);
    }
}

export default BinomPublicApi;