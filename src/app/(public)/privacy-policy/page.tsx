import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Mana Indur News.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 pb-8 border-b">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <p>
              At <strong>Mana Indur News</strong>, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Mana Indur News and how we use it.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <p>
              If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
              <li>Find and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Log Files</h2>
            <p>
              Mana Indur News follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Cookies and Web Beacons</h2>
            <p>
              Like any other website, Mana Indur News uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8">Contact Us</h2>
            <p>
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <strong>Rameshoxford0623@gmail.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
