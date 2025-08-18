import { format, parseISO } from "date-fns";

export const formatDateVN = (date) => {
  if (!date) {
    return null;
  }
  const formattedDate = format(parseISO(date), "dd/MM/yyyy");
  return formattedDate;
}


