import { IgnoreUseFor, StatusObject, TikTokAccount, TikTokAd, WrongTextUrlInfo } from "../types";
import { convertTimeToMs } from "../utils/ms";
import Timer from "../utils/timer";
import TikTokAPI from '../api/TikTok.api';
import BinomPublicApi from '../api/BinomPublic.api';
import env from "../utils/env";
import Telegram from '../services/Telegram';
import TelegramUserController from '../db/controllers/TelegramUser.controller';
import { UseFor } from "../db/entities/live/TelegramUser";
import IgnoreAccountController from "../db/controllers/IgnoreAccount.controller";
import { AccountType } from "../db/entities/live/IgnoreAccount";
import IgnoreDomainController from "../db/controllers/IgnoreDomain.controller";

const INTERVAL = convertTimeToMs({hours: 0, minutes: 30, seconds: 0});

/**This interval check tikTok url for different kind of mistakes. */
async function checkTtAdsInterval() {
    let isExecutionAvailable: StatusObject = {status: true};

    await checkTtAds(isExecutionAvailable);
    setInterval(async () => {
        if(isExecutionAvailable.status) {
            await checkTtAds(isExecutionAvailable);
        }
    }, INTERVAL);
}

async function checkTtAds(isExecutionAvailable: StatusObject) {
    const timer = new Timer();
    isExecutionAvailable.status = false;

    const tikTokApi = new TikTokAPI(env('TIK_TOK_ACCESS_TOKEN'));
    const accounts = await tikTokApi.getAllAccounts({
        app_id: env('TIK_TOK_APP_ID'),
        secret: env('TIK_TOK_APP_SECRET')
    })

    await checkAccountsAds(tikTokApi, accounts.list);

    timer.stop(`Finished execution of fuuntion ${checkTtAds.name}`);
    isExecutionAvailable.status = true;
}

async function checkAccountsAds(tikTokApi: TikTokAPI, accounts: TikTokAccount[]) {
    const errorTextParamInfos: WrongTextUrlInfo[] = [];

    const binomApi = new BinomPublicApi();
    const binomDomainsObj = await binomApi.getAllDomains({action: 'domain@get_all', api_key: env('BINOM_TOKEN_API')});
    const binomDomains: string[] = binomDomainsObj.map( obj => obj.name);

    const ttDomainsIgnoreAccounts = (await IgnoreAccountController.getAllIgnoreAccounts()).filter(account => account.accountType === AccountType.TT && account.useFor === IgnoreUseFor.DOMAIN_CHECKING).map(account => account.accountId);
    const ttIgnoredDomains = (await IgnoreDomainController.getAllIgnoreDomains()).filter(domain => domain.useFor === IgnoreUseFor.DOMAIN_CHECKING).map(domain => domain.domainName);

    for(let [id, account] of Object.entries(accounts)) {
        const ads = await tikTokApi.getAds({advertiser_id: account.advertiser_id});
    
        errorTextParamInfos.push(...checkAdUrlText(ads.list, account));

        //check if account ignore exist
        if(!ttDomainsIgnoreAccounts.includes(account.advertiser_id)) {
            errorTextParamInfos.push(...await checkAdDomain(ads.list, account, binomDomains, ttIgnoredDomains));
        }

        console.log(`${Number.parseInt(id) + 1}/${accounts.length} accounts resolved.`);
    }
    
    let wrongAdsStopped: boolean = true;
    try {
        const wrongs = errorTextParamInfos.filter(info => info.type === 'wrong');

        if(wrongs.length === 0) wrongAdsStopped = false;
        for(let [id,wrong] of Object.entries(wrongs)) {
            await tikTokApi.updateAdStatus({
                advertiser_id: wrong.account.advertiser_id,
                operation_status: 'DISABLE',
                ad_ids: [wrong.ad.ad_id]
            })

            console.log(`${Number.parseInt(id) + 1}/${wrongs.length} ads stopped.`);
        }
    } catch (e: any) {
        wrongAdsStopped = false;
    }

    if(errorTextParamInfos.length > 0) {
        const message = generateTelegramMessage(errorTextParamInfos, wrongAdsStopped);
    
        await Telegram.sendMessageToUsers(await TelegramUserController.getUsersByUseFor(UseFor.TT_ACC_CHECK), message);
    }
}

/**Check ad's url text params */
function checkAdUrlText(ads: TikTokAd[], account: TikTokAccount): WrongTextUrlInfo[] {
    const errorTextParamInfos: WrongTextUrlInfo[] = [];
    
    for(let ad of ads) {
        const wrongTextParameter = 'YYYYYYY';
        const url: URLSearchParams = new URLSearchParams(ad.landing_page_url);
        const textParamValue = url.get('text');
        if(textParamValue) {
            if(textParamValue === wrongTextParameter && ad.operation_status === 'ENABLE') {
                errorTextParamInfos.push({ account, ad , type: 'wrong'});
            }
        } 
        // else {
        //     errorTextParamInfos.push({ account, ad, type: 'notExist' });
        // }
    }

    return errorTextParamInfos;
}

async function checkAdDomain(ads: TikTokAd[], account: TikTokAccount, binomDomains: string[], ttIgnoredDomains: string[]): Promise<WrongTextUrlInfo[]> {
    const domainErrors: WrongTextUrlInfo[] = [];
    for(let ad of ads) {
        try {
            if(ad.landing_page_url) {
                const url = new URL(ad.landing_page_url);
                // if binom not include domain and ad still running and ignore domains not include the domain
                if(!binomDomains.includes(url.hostname) && ad.operation_status === 'ENABLE' && !ttIgnoredDomains.includes(url.hostname)) {
                    domainErrors.push({
                        account,
                        ad,
                        type: 'domainError',
                        domain: url.hostname
                    })
                }
            } else {
                domainErrors.push({
                    account,
                    ad,
                    type: 'domainError',
                    domain: 'NO LANDING PAGE!'
                })
            }
        } catch (e: any){
            console.log(e.message);
        }
    }

    return domainErrors;
}

function generateTelegramMessage(wrongTextParamInfos: WrongTextUrlInfo[], wrongAdsStopped: boolean) {
    const wrong = wrongTextParamInfos.filter( info => info.type === 'wrong');
    const domainError = wrongTextParamInfos.filter( info => info.type === 'domainError');

    return `|TT CHECK ADS REPORT|
${wrong.length > 0 ? `WRONG TEXT PARAMS REPORT:
${wrong.map(info => `- Account id: ${info.account.advertiser_id}. Ad id: ${info.ad.ad_id}`).join('\n')}
${wrongAdsStopped ? '\nADS WITH WRONG TEXT PARAMS STOPPED!!!': '\nONLY FEW OR NONE ADS WITH WRONG TEXT PARAMS WAS NOT STOPPED!!!'}` : ''}

${domainError.length > 0 ? `WRONG DOMAIN REPORTS:
${domainError.map(info => `- Account id: ${info.account.advertiser_id}. Ad id: ${info.ad.ad_id}. Domain: ${info.domain}.`).join('\n')}
`: ''}
`
}

export default checkTtAdsInterval;