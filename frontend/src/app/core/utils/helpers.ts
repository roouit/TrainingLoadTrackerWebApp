const roundToDecimals = (num: number, decimals: number): string => {
  const numString = num as unknown as string;
  return +(
    Math.round(parseFloat(numString + `e+${decimals}`)) + `e-${decimals}`
  ) as unknown as string;
  }

export default {
  roundToDecimals: roundToDecimals  
}
