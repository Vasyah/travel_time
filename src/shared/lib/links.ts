export const createWhatsappLink = (phone: number | string, text?: string) => {
    let link = `https://api.whatsapp.com/send/?phone=${phone}`

    if (text) {
        link += `&text=${text}`
    }
    return link
}

export const createTelegramLink = (user: number | string) => {
    return `https://t.me/${user}`
}
