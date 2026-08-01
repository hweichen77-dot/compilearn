const DISPOSABLE_DOMAINS = new Set([
  "0-mail.com", "0clickemail.com", "10mail.org", "10minutemail.com", "10minutemail.net",
  "1secmail.com", "1secmail.net", "1secmail.org", "20minutemail.com", "2prong.com",
  "33mail.com", "4warding.com", "60minutemail.com",
  "anonbox.net", "anonymbox.com", "armyspy.com",
  "bccto.me", "binkmail.com", "bobmail.info", "bouncr.com", "brefmail.com",
  "burnermail.io", "byom.de",
  "cock.li", "correo.blogos.net", "cuvox.de",
  "dayrep.com", "deadaddress.com", "despam.it", "devnullmail.com", "discard.email",
  "discardmail.com", "discardmail.de", "disposableinbox.com", "dispostable.com",
  "dodgeit.com", "dodgit.com", "dontreg.com", "dropmail.me",
  "e4ward.com", "einrot.com", "email-fake.com", "emailfake.com", "emailondeck.com",
  "emailsensei.com", "emailtemporanea.net", "emltmp.com", "explodemail.com",
  "fakeinbox.com", "fakemail.net", "fakemailgenerator.com", "fastmailbox.net",
  "fexbox.org", "fexpost.com", "filzmail.com", "forgetmail.com",
  "get2mail.fr", "getairmail.com", "getnada.com", "grandmamail.com",
  "grr.la", "guerrillamail.biz", "guerrillamail.com", "guerrillamail.de",
  "guerrillamail.info", "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com",
  "harakirimail.com", "hidemail.de", "hmamail.com",
  "inbox.si", "inboxalias.com", "inboxbear.com", "inboxkitten.com", "incognitomail.org",
  "jetable.net", "jetable.org", "jourrapide.com",
  "kasmail.com", "killmail.com", "klzlk.com", "koszmail.pl",
  "letthemeatspam.com", "lroid.com", "luxusmail.org",
  "mail-temporaire.fr", "mail.tm", "mail7.io", "mailbidon.com", "mailcatch.com",
  "maildrop.cc", "maileater.com", "mailexpire.com", "mailfreeonline.com", "mailinator.com",
  "mailinator.net", "mailmetrash.com", "mailnesia.com", "mailnull.com", "mailpoof.com",
  "mailtemp.top", "mailto.plus", "mailtothis.com", "meltmail.com", "mintemail.com",
  "minuteinbox.com", "moakt.com", "mohmal.com", "mt2015.com", "mytrashmail.com",
  "nada.email", "nomail.xl.cx", "no-spam.ws", "nowmymail.com",
  "objectmail.com", "onewaymail.com", "owlpic.com",
  "pokemail.net", "proxymail.eu", "punkass.com", "putthisinyourspamdatabase.com",
  "quickinbox.com",
  "rcpt.at", "rhyta.com", "rover.info", "rtrtr.com",
  "safetymail.info", "sharklasers.com", "shitmail.me", "sneakemail.com", "sofimail.com",
  "sofort-mail.de", "spam4.me", "spamavert.com", "spambog.com", "spambox.us",
  "spamdecoy.net", "spamex.com", "spamfree24.org", "spamgourmet.com", "spamherelots.com",
  "spamhole.com", "spaml.com", "spamspot.com", "superrito.com",
  "teleworm.us", "temp-mail.io", "temp-mail.org", "tempail.com", "tempemail.net",
  "tempinbox.com", "tempmail.plus", "tempmailaddress.com", "tempmailo.com", "tempr.email",
  "throwawaymail.com", "tmail.ws", "tmailinator.com", "tmpeml.com", "tmpmail.net",
  "tmpmail.org", "trash-mail.com", "trashmail.com", "trashmail.de", "trashmail.me",
  "trashmail.net", "trbvm.com", "vomoto.com", "wegwerfmail.de", "wh4f.org", "willselfdestruct.com", "wuzup.net",
  "xoxy.net",
  "yepmail.net", "yopmail.com", "yopmail.fr", "yopmail.net",
  "zetmail.com", "zippymail.info",
]);

export function emailDomain(email: string): string {
  const at = String(email).toLowerCase().trim();
  const i = at.lastIndexOf("@");
  return i === -1 ? "" : at.slice(i + 1);
}

export function isDisposableEmail(email: string): boolean {
  const domain = emailDomain(email);
  if (!domain) return false;
  const parts = domain.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    if (DISPOSABLE_DOMAINS.has(parts.slice(i).join("."))) return true;
  }
  return false;
}

export const disposableDomainCount = DISPOSABLE_DOMAINS.size;
