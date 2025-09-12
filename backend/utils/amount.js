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

/**
 * Convert a decimal token amount (string|number) to base units (smallest integer units).
 * Example: toBaseUnits("1", 18) -> "1000000000000000000"
 *
 * @param {string|number} amount - Decimal amount, e.g. "1", 0.5, "0.1234"
 * @param {number} [decimals=18] - Number of decimals (default 18)
 * @throws {Error} if input is invalid or has more decimal places than `decimals`
 * @returns {string} integer string representing smallest units
 */
export const toBaseUnits = (amount, decimals = 18) => {
  if (typeof amount === "number") {
    // convert number to string but avoid scientific notation for large/small numbers
    amount = amount.toString();
  }
  if (typeof amount !== "string")
    throw new Error("amount must be a string or number");

  amount = amount.trim();
  if (!/^-?\d+(\.\d+)?$/.test(amount)) {
    throw new Error("Invalid amount format");
  }

  const negative = amount.startsWith("-");
  if (negative) amount = amount.slice(1);

  const [intPart, fracPart = ""] = amount.split(".");

  if (fracPart.length > decimals) {
    throw new Error(
      `Too many decimal places (got ${fracPart.length}, max ${decimals})`
    );
  }

  const fracPadded = fracPart.padEnd(decimals, "0"); // pad to decimals
  const combined = (intPart === "" ? "0" : intPart) + fracPadded; // integer string

  // remove leading zeros but keep at least one zero
  const cleaned = combined.replace(/^0+(?!$)/, "");

  const big = BigInt(cleaned || "0");
  return (negative ? "-" : "") + big.toString();
}

/**
 * Convert smallest-unit integer string (or BigInt/number) back to human-readable decimal string.
 * Example: fromBaseUnits("1000000000000000000", 18) -> "1"
 *
 * @param {string|number|bigint} baseAmount - integer amount in smallest units
 * @param {number} [decimals=18]
 * @returns {string} human-friendly decimal string (no trailing zeros after decimal)
 */
export const fromBaseUnits = (baseAmount, decimals = 18) => {
  let s;
  if (typeof baseAmount === "bigint") {
    s = baseAmount.toString();
  } else if (typeof baseAmount === "number") {
    // number might lose precision if huge; prefer passing string or BigInt
    s = Math.trunc(baseAmount).toString();
  } else if (typeof baseAmount === "string") {
    s = baseAmount.trim();
    if (!/^-?\d+$/.test(s))
      throw new Error("baseAmount must be an integer string");
  } else {
    throw new Error("baseAmount must be string, number or BigInt");
  }

  const negative = s.startsWith("-");
  if (negative) s = s.slice(1);

  // ensure at least decimals+1 length so slicing works
  s = s.padStart(decimals + 1, "0");

  const intPart = s.slice(0, -decimals) || "0";
  let fracPart = s.slice(-decimals);

  // strip trailing zeros from fractional part
  fracPart = fracPart.replace(/0+$/, "");

  const result = fracPart.length === 0 ? intPart : `${intPart}.${fracPart}`;
  return (negative ? "-" : "") + result;
}
