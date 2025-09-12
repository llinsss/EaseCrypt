export const toStarknetAmount = (amount) => {
  const decimals = 18n;
  const factor = 10n ** decimals;

  const [intPart, fracPart = ""] = String(amount).split(".");

  const paddedFrac = (fracPart + "0".repeat(Number(decimals))).slice(
    0,
    Number(decimals)
  );

  return BigInt(intPart + paddedFrac);
};
