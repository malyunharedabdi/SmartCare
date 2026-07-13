import { Link } from 'react-router';
import { Stethoscope, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 dark:bg-black text-white transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="p-2 bg-primary rounded-lg">
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">SmartCare</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your health is our top priority. Providing world‑class healthcare with compassion and innovation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm">Home</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">About</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Services</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-primary transition-colors text-sm">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">Garissa, Kenya</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-gray-400 text-sm">+254 723 594 738</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-gray-400 text-sm">info@smartcare.so</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-3">
                            Subscribe for health tips and updates.
                        </p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                aria-label="Subscribe"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {currentYear} SmartCare. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;