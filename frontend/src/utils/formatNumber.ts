export const formatNumber = (value: number | string) => {
  return new Intl.NumberFormat("en-IN").format(Number(value));
};