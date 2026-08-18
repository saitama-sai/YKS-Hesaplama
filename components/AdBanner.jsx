export default function AdBanner() {
  return (
    <div className="w-full flex justify-center my-6">
      <div className="bg-[#1a1f35] border border-white/10 rounded-xl w-full max-w-4xl h-24 flex items-center justify-center text-white/50 text-sm overflow-hidden relative group">
        <span className="z-10 bg-[#0B0F19] px-4 py-1 rounded-full border border-white/5">Sponsorlu Reklam Alanı</span>
        
        {/* İleride AdSense kodunuzu buraya ekleyebilirsiniz */}
        {/* <ins className="adsbygoogle"
             style={{ display: "block" }}
             data-ad-client="ca-pub-4546672067852912"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script> */}
        
        {/* Görsel placeholder efekti */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  );
}
