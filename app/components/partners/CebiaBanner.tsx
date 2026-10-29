import Image from 'next/image';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import { CEBIA_AFFILIATE_URL } from '@/lib/partners/cebia';

export default function CebiaBanner({ sourcePage }: { sourcePage: 'auto' | 'prodej-vozidla' }) {
  return (
    <aside aria-label="Prověření vozidla u Cebia" className="my-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[#f2e7c8]">Před koupí si prověřte historii auta</h2>
        <span className="text-xs text-slate-400">Partnerská reklama · Cebia</span>
      </div>
      <TrackedLink
        href={CEBIA_AFFILIATE_URL}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        prefetch={false}
        eventName="partner_offer_clicked"
        eventParams={{ source: sourcePage, source_page: sourcePage, surface: 'vehicle_banner', offer_type: 'partner', product_id: 'cebia_vehicle_history', partner_id: 'cebia', provider: 'Cebia', offer_category: 'vehicle_history', contract_type: 'car_sale', locale: 'cs' }}
        className="mx-auto block max-w-[728px] overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
      >
        <Image
          src="/images/partners/cebia-728x100.png"
          width={728}
          height={100}
          sizes="(max-width: 728px) 100vw, 728px"
          alt="Cebia AUTOTRACER – prověřit historii vozidla před koupí (otevře se v nové kartě)"
          className="h-auto w-full"
        />
      </TrackedLink>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        Při nákupu přes tento odkaz můžeme získat provizi. Rozsah prověření závisí na dostupných záznamech.
        VIN zadáte až na webu Cebia; údaje ze smlouvy se automaticky nepřenášejí.
      </p>
    </aside>
  );
}
