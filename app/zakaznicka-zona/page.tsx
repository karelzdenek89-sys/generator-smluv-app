'use client';

export default function CustomerZone() {
  return (
    <main className="min-h-screen bg-[#05080f] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-10 bg-[#0c1426] border border-slate-800 rounded-[40px] shadow-2xl">
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">🔒</div>
        <h1 className="text-3xl font-black text-white uppercase italic mb-4 tracking-tighter">Zákaznická zóna</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Pracujeme na bezpečném úložišti pro vaše smlouvy. <br/> 
          <strong>Brzy zde najdete historii svých dokumentů.</strong>
        </p>
        <button onClick={() => window.location.href = '/'} className="w-full py-4 bg-white text-black font-black uppercase text-xs rounded-2xl hover:bg-amber-500 transition shadow-xl">
          Zpět na úvod
        </button>
      </div>
    </main>
  );
}