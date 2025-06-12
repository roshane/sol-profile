import { API_BASE, HTTP_HEADERS } from "./settings.js";

export async function getBalanceChange(
  address,
  token,
  page = 1,
  pageSize = 100,
) {
  const balanceChangeUrl = `${API_BASE}/account/balance_change?address=${address}&page_size=${pageSize}&page=${page}&token=${token}`;
  const result = fetch(balanceChangeUrl, {
    method: "GET",
    headers: HTTP_HEADERS,
  }).then((response) => response.json());

  const getPrice = (tokenId, dateTime) => {
    const formattedDate = new Date(dateTime * 1000);
    const location = `https://api.coingecko.com/api/v3/coins/{tokenId}/history?date={formattedDate}`;
  };

  const parseTransaction = (data, priceAndName) => {
    let _data = {
      block_id: 343400338,
      block_time: 1748583743,
      trans_id:
        "4VYRmT6NEne1JbU5JLAR7PFF2gb9qnPnyfLt4s6N4y2LXUSduS16gyFi6oDsVgywkQQ9pSK4zHngtSzRCwtR6ycC",
      address: "2MR8VYNYcPQojVDp7VaXENnv4gPUr3fvNzLDFPYWZGL3",
      token_address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
      token_account: "HMQYJD2h2qQNTkoYVEbMiWYd9PabqaeXx6ERF1P7W3Zp",
      token_decimals: 6,
      amount: "4320817",
      pre_balance: 3656671,
      post_balance: 7977488,
      change_type: "inc",
      fee: 80001,
    };
    let time = new Date(data["block_time"] * 1000);
    let tokenAddress = data["token_address"];
    let decimals = Number(data["token_decimals"]);
    let amount = Number(data["amount"]) / 10 ** decimals;
    let { price, name } = priceAndName;
    let transactionValue = amount * price;
    let type = mapChangeType(data["change_type"]);
    let txId = data["trans_id"];
    return {
      time,
      txId,
      name,
      price,
      amount,
      type,
      transactionValue,
    };
  };

  const mapChangeType = (changeType) => (changeType === "inc" ? "Buy" : "Sell");

  const getPriceAndName = (metaData, tokenAddress) => {
    let tokens = metaData["tokens"];
    let token = tokens && tokens[tokenAddress];
    if (token) {
      let name = token["token_name"];
      let price = token["price_usdt"];
      return { name, price };
    }
    return false;
  };

  return await result.then((resp) => {
    const { success, data, metadata } = resp;
    if (success) {
      const processed = data.reverse().map((it) => {
        let address = it["token_address"];
        let priceAndName = getPriceAndName(metadata, address);
        return parseTransaction(it, priceAndName);
      });
      return processed;
    }
    throw new Error("operation failed!");
  });
}
