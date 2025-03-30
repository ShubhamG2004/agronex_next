'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BsTelephoneFill } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 mt-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-400">AgroNex</h3>
            <p className="text-gray-300">
              Empowering farmers with AI-driven plant disease detection and agricultural insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link href="/image-uploader" className="text-gray-300 hover:text-green-400 transition-colors">Disease Detection</Link></li>
              <li><Link href="/Blog-uploader" className="text-gray-300 hover:text-green-400 transition-colors">Create Blog</Link></li>
              <li><Link href="/blogs" className="text-gray-300 hover:text-green-400 transition-colors">Blogs</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/plant-diseases" className="text-gray-300 hover:text-green-400 transition-colors">Plant Diseases</Link></li>
              <li><Link href="/agriculture-tips" className="text-gray-300 hover:text-green-400 transition-colors">Agriculture Tips</Link></li>
              <li><Link href="/research-papers" className="text-gray-300 hover:text-green-400 transition-colors">Research Papers</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-green-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MdEmail className="text-green-400" />
                <span className="text-gray-300">contact@agronex.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <BsTelephoneFill className="text-green-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AgroNex. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;