import {API_BASE, HTTP_HEADERS} from "./settings.js";

export async function getProfile(wallet) {
    console.info('profile: ', wallet)
    const url = `${API_BASE}/account/tokens?address=${wallet}`
    console.log('url ', url)
    const response = await fetch(url, {
        headers: HTTP_HEADERS,
        method: 'GET'
    })
    const currencyFormat = new Intl.NumberFormat("en-US", {
        style:"currency",
        currency: "USD"
    })
    const parseTokenProfile = tokenProfile => {
        const {tokenSymbol, amount, priceUsdt, decimals, balance, value, address} = tokenProfile
        return {
            tokenSymbol,
            balance,
            "value": currencyFormat.format(Math.round(Number(value))),
        }
    };
    const responseJson = await response.json()
    const {data, metadata} = responseJson
    const parsed = data.tokens
        .map(parseTokenProfile)
    const total = data.tokens
        .map(it => it.value)
        .reduce((a,b) => a+b)
    const totalRow = {
        'tokenSymbol': 'TOTAL',
        'balance':'n/a',
        'value': currencyFormat.format(Math.round(total)),
    }
    return [...parsed, totalRow]
}
