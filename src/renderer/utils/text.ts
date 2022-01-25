export function plural(
  count: number,
  singularWord: string,
  pluralWord: string = `${singularWord}s`
) {
  return count === 1 ? singularWord : pluralWord;
}

export function countString(
  count: number,
  singularWord: string,
  pluralWord: string = `${singularWord}s`
) {
  return `${count} ${plural(count, singularWord, pluralWord)}`;
}

export function padNumberStart(value: number | string, length: number): string {
  const [integerPart, decimalPart] = String(value).split(".");
  let paddedIntegerPart = integerPart;
  if (paddedIntegerPart.length < length) {
    for (let i = paddedIntegerPart.length; i < length; i++) {
      paddedIntegerPart = `0${paddedIntegerPart}`;
    }
  }
  if (decimalPart) return `${paddedIntegerPart}.${decimalPart}`;
  return paddedIntegerPart;
}
