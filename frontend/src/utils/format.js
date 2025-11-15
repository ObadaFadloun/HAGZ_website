export default function formatRating(value) {
  if (value === null || value === undefined || isNaN(value)) return "0.00";
  return Number(value).toFixed(1);
}

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
