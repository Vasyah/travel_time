import moment from "moment/moment";

export const getDateFromUnix = (unix: number) => {
    return moment.unix(unix)
}
