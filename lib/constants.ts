export const PHONE_DISPLAY = '(645) 248-8292'
export const PHONE_HREF = 'tel:+16452488292'
export const EMAIL_DISPLAY = 'info@tealdetailing.com'
export const EMAIL_HREF = 'mailto:info@tealdetailing.com'

const SMS_BODY = "Hi Teal Detailing, I'd like a quote for my vehicle."
// The "?&" combo (rather than a plain "?") is a widely-used cross-platform
// quirk that reliably pre-fills the body on both iOS and Android.
export const SMS_HREF = `sms:+16452488292?&body=${encodeURIComponent(SMS_BODY)}`
