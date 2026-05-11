export function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 text-sm text-zinc-400 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-lg font-semibold text-white">Voxera.live</p>
          <p className="mt-2">The world, as it happens.</p>
        </div>
        <div>
          <p className="font-medium text-zinc-200">Global desks</p>
          <p className="mt-2">World · Politics · Technology · AI · Crypto · Business</p>
        </div>
        <div>
          <p className="font-medium text-zinc-200">Newsletter</p>
          <p className="mt-2">Daily intelligence briefing at 07:00 UTC.</p>
        </div>
      </div>
    </footer>
  );
}
