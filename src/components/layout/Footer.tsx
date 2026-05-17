import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="w-full pl-2 pr-4 md:pl-4 md:pr-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block relative h-12 w-48 bg-white p-1.5 rounded-lg shadow-sm">
              <Image 
                src="/websiteLogo.jpeg" 
                alt="Mana Indur News" 
                fill 
                className="object-contain object-left p-0.5"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              మన ఇందూరు న్యూస్ ఆంధ్రప్రదేశ్, తెలంగాణ, భారతదేశం మరియు ప్రపంచవ్యాప్తంగా ఉన్న తాజా వార్తలను అందిస్తుంది. మేము రాజకీయాలు, వినోదం, క్రీడలు మరియు సాంకేతికతపై దృష్టి పెడతాము.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-l-4 border-red-600 pl-3 uppercase">త్వరిత లింక్‌లు</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-red-500 transition-colors">మా గురించి</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 transition-colors">సంప్రదించండి</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-red-500 transition-colors">గోప్యతా విధానం</Link></li>
              <li><Link href="/admin/login" className="hover:text-red-500 transition-colors">స్టాఫ్ లాగిన్</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-l-4 border-red-600 pl-3 uppercase">కేటగిరీలు</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/category/andhra-pradesh" className="hover:text-red-500 transition-colors uppercase">ఆంధ్రప్రదేశ్</Link></li>
              <li><Link href="/category/telangana" className="hover:text-red-500 transition-colors uppercase">తెలంగాణ</Link></li>
              <li><Link href="/category/politics" className="hover:text-red-500 transition-colors uppercase">రాజకీయం</Link></li>
              <li><Link href="/category/sports" className="hover:text-red-500 transition-colors uppercase">క్రీడలు</Link></li>
              <li><Link href="/category/entertainment" className="hover:text-red-500 transition-colors uppercase">వినోదం</Link></li>
              <li><Link href="/category/technology" className="hover:text-red-500 transition-colors uppercase">సాంకేతికం</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-l-4 border-red-600 pl-3 uppercase">సంప్రదించండి</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-red-600" />
                <span>Rameshoxford0623@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-red-600" />
                <span>9959640885</span>
              </li>
              {/* Social media icons will go here once available */}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col items-center justify-center text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Mana Indur News. అన్ని హక్కులూ ప్రత్యేకించుకోబడినవి.</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-red-600">
              <Image 
                src="/editorImage.jpeg" 
                alt="KARKA RAMESH" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-300">KARKA RAMESH</p>
              <p className="text-[10px]">చీఫ్ ఎడిటర్</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
