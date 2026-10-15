import Image from 'next/image';

/** Official Cebia banner assets, hosted locally to avoid third-party image requests. */
export default function CebiaBanner() {
  return (
    <span className="block w-full max-w-[728px] overflow-hidden rounded-lg">
      <Image
        src="/partners/cebia/autotracer-horizontal.png"
        width={728}
        height={100}
        alt="Cebia AUTOTRACER – Prověřte si auto ještě před koupí"
        className="hidden h-auto w-full sm:block"
        unoptimized
      />
      <Image
        src="/partners/cebia/autotracer-square.png"
        width={300}
        height={300}
        alt="Cebia AUTOTRACER – Prověřte si auto ještě před koupí"
        className="mx-auto block h-auto w-full max-w-[300px] sm:hidden"
        unoptimized
      />
    </span>
  );
}
