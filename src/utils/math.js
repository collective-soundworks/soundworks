export function linearToDecibel(val) {
  return 8.685889638065035 * Math.log(val); // 20 * log10(val)
};

export function decibelTolinear(val) {
  return Math.exp(0.11512925464970229 * val); // pow(10, val / 20)
};

export function powerToDecibel(val) {
  return 4.3429448190325175 * Math.log(val); // 10 * log10(val)
};

export function decibelToPower(val) {
  return Math.exp(0.23025850929940458 * val); // pow(10, val / 10)
};

export function linearToCent(val) {
  return 1731.23404906675611 * Math.log(val); // 1200 * log2(val)
};

export function centTolinear(val) {
  return Math.exp(0.0005776226504666211 * val); // pow(2, val / 1200)
};

export function getScaler(minIn, maxIn, minOut, maxOut) {
  const a = (maxOut - minOut) / (maxIn - minIn);
  const b = minOut - a * minIn;
  return x => a * x + b;
};
