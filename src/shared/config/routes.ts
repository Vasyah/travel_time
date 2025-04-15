export enum PagesEnum {
  MAIN = "MAIN",
  HOTELS = "HOTELS",
  RESERVATION = "RESERVATION",
  LOGIN = "LOGIN",
}

export const routes = {
  [PagesEnum.MAIN]: "/main",
  [PagesEnum.HOTELS]: "/main/hotels",
  [PagesEnum.RESERVATION]: "/main/reservation",
  [PagesEnum.LOGIN]: "/login",
};
