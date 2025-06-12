const parseTransactionInternal = (balanceChange) => {
  const { change_type, change_amount, decimals, token_address } = balanceChange;
  const direction = change_type == "inc" ? "Buy" : "Sell";
  const amount = change_amount / 10 ** decimals;
  const token = token_address;
  return {
    token,
    amount,
    direction,
  };
};

export function parseTransactions(transactionDetails, ownersWallet) {
  const { data } = transactionDetails;
  const { token_bal_change } = data;
  const selectedBalanceChanges = token_bal_change.filter(
    (it) => it.post_owner == it.pre_owner && it.post_owner == ownersWallet,
  );
  const result = selectedBalanceChanges.map(parseTransactionInternal);
  console.info(selectedBalanceChanges, result);
}
