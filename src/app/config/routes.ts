export enum PagesEnum {
    MAIN = 'MAIN',
    HOTELS = 'HOTELS',
    RESERVATION = 'RESERVATION',
}

export const routes = {
    [PagesEnum.MAIN]: '/',
    [PagesEnum.HOTELS]: '/hotel',
    [PagesEnum.RESERVATION]: '/reservation',
}
