import vi from "date-fns/locale/vi"
import { format, formatDistanceToNow } from "date-fns"

export const formatToNow = (data) => {
  return formatDistanceToNow(new Date(data), { locale: vi, includeSeconds: true, addSuffix: true })
}

export const formatDate = (data, fstring = "dd/MM/yyyy HH:mm") => {
  return format(new Date(data), fstring, { locale: vi })
}
