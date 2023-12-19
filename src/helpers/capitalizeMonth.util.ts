export const capitalizeMonth = string => {
  const arr = string.split(' ');
  arr[1] = arr[1].charAt(0).toUpperCase() + arr[1].slice(1);

  return arr.join(' ');
};
