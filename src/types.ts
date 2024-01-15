import TelegramBot from "node-telegram-bot-api"
import { Mode, UseFor } from "./db/entities/live/TelegramUser"
import { AccountType, IgnoreAccountUseFor } from "./db/entities/live/IgnoreAccount"

export type ENV = {
    NODE_ENV: string
    TIK_TOK_ACCESS_TOKEN: string
    TIK_TOK_APP_ID: string
    TIK_TOK_APP_SECRET: string
    TELEGRAM_BOT_ARBITRAGE_TOKEN: string
    TELEGRAM_BOT_DEV_TOKEN: string
    POSTGRES_PASSWORD: string
    POSTGRES_HOST: string
    POSTGRES_USERNAME: string
    POSTGRES_PORT: string
    POSTGRES_DATABASE: string
    BINOM_TOKEN_API: string
}

export type GetTtAdsParams = {
    advertiser_id: string
}

export type GetTtAccounts = {
    app_id: string
    secret: string
}

const adStatusesArray = ['DELETE', 'DISABLE', 'ENABLE'] as const;
type AdStatus = typeof adStatusesArray[number]

export type UpdateTtAdStatus = {
    advertiser_id: string
    operation_status: AdStatus
    ad_ids: string[]
}

const reponseCodesArray = [0] as const;
type ResponseCode = typeof reponseCodesArray[number]

export interface TikTokResponse<DataType> {
    code: ResponseCode
    message: string
    request_id: string
    data: DataType
}

export type TikTokAds = {
    list: TikTokAd[]
}

export type TikTokAd = {
    landing_page_url: string,
    ad_id: string,
    operation_status: AdStatus
}

export type TikTokAccounts = {
    list: TikTokAccount[]
}

export type TikTokAccount = {
    advertiser_id: string
    advertiser_name: string
}

export type Time = {
    hours: number
    minutes: number
    seconds: number
}

export type StatusObject = {
    status: boolean
}

export type TelegramBotOnTextRules = {
    regex: RegExp,
    function: (msg: TelegramBot.Message) => void 
}

export type TtAdExplorerFunction = (ad: TikTokAd, account: TikTokAccount) => Promise<any>

export type WrongTextUrlInfo = {
    account: TikTokAccount,
    ad: TikTokAd,
    type: 'notExist' | 'wrong' | 'domainError',
    domain?: string
}

export type NewTelegramUser = {
    name: string,
    chatId: string,
    mode: Mode,
    useFor: UseFor
}

const binomActionsArray = ['domain@get_all'] as const;
export type BinomActions = typeof binomActionsArray[number];

export type BinomGetAllDomainsParams = {
    action: BinomActions,
    api_key: string
}

export type BinomDomain = {
    name: string
}

export type NewIgnoreAccount = {
    accountId: string;
    accountType: AccountType;
    useFor: IgnoreAccountUseFor;
}