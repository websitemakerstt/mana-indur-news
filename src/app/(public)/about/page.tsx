import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Mana Indur News, your trusted source for the latest news from Andhra Pradesh, Telangana, India, and around the world.',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex flex-col items-center mb-10 border-b pb-10">
            <div className="relative w-48 h-16 mb-6">
              <Image
                src="/websiteLogo.jpeg"
                alt="Mana Indur News"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 text-center">About Mana Indur News</h1>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              Welcome to <strong>Mana Indur News</strong>, your premier destination for the most accurate, timely, and comprehensive news coverage from Andhra Pradesh, Telangana, India, and around the globe.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Our Mission</h2>
            <p>
              At Mana Indur News, our mission is to empower our readers with truthful, unbiased, and fast news reporting. We believe in the power of information and its ability to shape our communities for the better. We focus on politics, entertainment, sports, and technology, bringing you stories that matter most to your daily life.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">
              Our Chief Editor
            </h2>

            <div className="bg-gray-50 p-8 rounded-2xl my-8 border border-gray-100 text-center">
              {/* Centered Bigger Image */}
              <div className="not-prose relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-red-600 shadow-lg">
                <Image
                  src="/editorImage.jpeg"
                  alt="KARKA RAMESH"
                  fill
                  className="object-cover scale-110 -translate-y-5 -translate-x-1"
                />
              </div>

              {/* Name & Role */}
              <div className="mt-5">
                <h3 className="text-xl font-bold text-gray-900">
                  KARKA RAMESH
                </h3>

                <p className="text-sm text-red-600 font-semibold uppercase tracking-[0.2em] mt-1">
                  Chief Editor & Founder
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mt-6 max-w-2xl mx-auto">
                With years of dedicated experience in journalism, Karka Ramesh leads
                Mana Indur News with a commitment to integrity, transparency, and
                relentless pursuit of the truth. Under his guidance, our editorial team
                works around the clock to ensure you are always informed.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Why Choose Us?</h2>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✓</span>
                <span><strong>Real-time Updates:</strong> We bring you breaking news as it happens.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✓</span>
                <span><strong>Unbiased Reporting:</strong> Our commitment is to the facts, not to narratives.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold">✓</span>
                <span><strong>Local Focus, Global Reach:</strong> While our roots are deeply embedded in Telangana and AP, we bring you crucial updates from across the world.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
