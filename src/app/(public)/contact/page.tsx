import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Mana Indur News for inquiries, news tips, and advertising opportunities.',
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We value your feedback, news tips, and inquiries. Reach out to our editorial team using the contact information below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Mail size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email Us</h2>
              <p className="text-gray-500 mb-4 text-sm">For general inquiries, news tips, and press releases.</p>
              <a href="mailto:Rameshoxford0623@gmail.com" className="text-red-600 font-bold hover:underline text-lg">
                Rameshoxford0623@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Phone size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Call Us</h2>
              <p className="text-gray-500 mb-4 text-sm">For urgent inquiries and advertising opportunities.</p>
              <a href="tel:9959640885" className="text-red-600 font-bold hover:underline text-lg">
                +91 99596 40885
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <MapPin className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Editorial Office</h2>
          <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
            <strong>Mana Indur News</strong><br />
            Chief Editor: KARKA RAMESH<br />
            Telangana, India
          </p>
        </div>
      </div>
    </div>
  );
}
