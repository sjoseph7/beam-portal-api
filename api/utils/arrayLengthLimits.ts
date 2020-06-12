export const arrayLengthLimits = (minItems: Number, maxItems?: Number) => (
  array: any[]
) => {
  if (!Array.isArray(array)) {
    return false;
  }

  if (minItems && array.length < minItems) {
    return false;
  }

  if (maxItems && array.length > maxItems) {
    return false;
  }
  return true;
};
