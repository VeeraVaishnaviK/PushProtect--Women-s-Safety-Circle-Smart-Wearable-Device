import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-ivory-warm py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-berry">Get in Touch</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
            Connect with Push Protect
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Questions regarding campus partnerships, institutional deployment, or research inquiries? We'd love to connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-border-subtle shadow-soft space-y-6">
            <h3 className="font-serif text-xl font-bold text-plum">Direct Channels</h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-text-secondary">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-berry flex-shrink-0" />
                <div>
                  <span className="font-bold text-plum block">General &amp; Research Inquiries</span>
                  <span>contact@pushprotect.org</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-berry flex-shrink-0" />
                <div>
                  <span className="font-bold text-plum block">Helpline &amp; Technical Support</span>
                  <span>+91 11 2345 6789</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-berry flex-shrink-0" />
                <div>
                  <span className="font-bold text-plum block">Innovation Hub</span>
                  <span>AICTE/MIC Innovation Complex, New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-border-subtle shadow-soft">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-status-success mx-auto" />
                <h3 className="font-serif text-xl font-bold text-plum">Message Dispatched</h3>
                <p className="text-xs text-text-secondary">
                  Thank you for reaching out. A team coordinator will review your inquiry within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Kavita Nair"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="kavita@university.edu.in"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your inquiry or deployment interest..."
                    className="w-full p-3 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-plum text-ivory-warm rounded-xl text-xs font-bold hover:bg-plum-800 transition-colors flex items-center justify-center space-x-2 shadow-elevated"
                >
                  <Send className="w-3.5 h-3.5 text-champagne" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
