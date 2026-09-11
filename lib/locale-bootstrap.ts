/**
 * Inline skript v <head>, který srovná `document.documentElement.lang` dřív,
 * než se stránka vykreslí. Žije v samostatném modulu, aby se dal v testu
 * přímo naparsovat — jednou už se sem dostala neplatná syntaxe, která shodila
 * skript na každé stránce webu a nikdo si toho měsíc nevšiml.
 */
// Pozor na escapování: tohle je template literal, takže `\/` se vyhodnotí
// jako `/` a zpětné lomítko se do HTML nedostane. Regulární výraz pro useknutí
// koncového lomítka se proto musí psát `/\\/$/` — jinak se do stránky vypíše
// `replace(//$/,"")`, kde `//` začne řádkový komentář, výraz zůstane neuzavřený
// a celý skript spadne na „Unexpected end of input“ na každé stránce webu.
export const LOCALE_BOOTSTRAP_SCRIPT = `(()=>{try{const p=location.pathname.replace(/\\/$/,"")||"/";const s=p.split("/")[1]||"";let l=s==="ua"?"uk":s==="en"?"en":"cs";if(p.startsWith("/blog/expat/")){l=p.endsWith("-ua")?"uk":p.endsWith("-en")?"en":l}if(l==="cs"&&new Set(["/najem","/podnajem","/pracovni","/dpp","/plna-moc","/auto"]).has(p)){const q=new URLSearchParams(location.search).get("lang");l=q==="ua"||q==="uk"||q==="ukr"?"uk":q==="en"?"en":"cs"}document.documentElement.lang=l}catch{}})()`;
