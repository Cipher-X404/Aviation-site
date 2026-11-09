import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const ContactView: React.FC = () => {
  const { setActiveRoute } = useAppStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Simulate submit
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ fullName: '', email: '', subject: '', message: '' });
        setErrors({});
      }, 5000);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center gap-10 py-16">
      {/* Top Section */}
      <div className="max-w-4xl w-full">
        <span className="text-[10px] font-mono tracking-[.28em] uppercase text-[#F2B632]">Contact CJ Travels</span>
        <h1 className="font-monument text-4xl sm:text-5xl normal-case tracking-tight text-[#0E2931] dark:text-[#EAEFEF] mt-2">Get in touch</h1>
        <p className="max-w-2xl mx-auto text-sm leading-7 text-[#5A6B70] dark:text-[#849CA3] mt-4">
          Whether you are planning a flight, booking a sanctuary suite, or exploring our Fly Now Pay Later options, our Owerri team is ready to assist.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { icon: '📞', label: 'Phone', value: '+234 803 000 0001' },
          { icon: '✉️', label: 'Email', value: 'hello@cjtravels.ng' },
          { icon: '📍', label: 'Office Address', value: '12 Douglas Road, Owerri, Imo State, Nigeria' },
        ].map((card, idx) => (
          <div key={idx} className="bg-[#F4F6F5] dark:bg-[#09171C] p-6 rounded-xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
            <div className="text-2xl mb-3">{card.icon}</div>
            <h3 className="text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] font-bold">{card.label}</h3>
            <p className="text-sm text-[#0E2931] dark:text-[#EAEFEF] mt-1 font-medium">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="w-full max-w-2xl bg-[#F4F6F5] dark:bg-[#09171C] p-8 rounded-2xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
        {success ? (
          <div className="bg-[#2B7574]/10 dark:bg-[#2B7574]/20 border border-[#2B7574]/30 text-[#2B7574] dark:text-[#A5D1E1] p-4 rounded-lg text-center">
            Message received. We will respond within 24 hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Full name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.fullName && <span className="text-red-500 text-[10px] mt-1 block">{errors.fullName}</span>}
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.email && <span className="text-red-500 text-[10px] mt-1 block">{errors.email}</span>}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
              >
                <option value="">Select a subject...</option>
                <option value="Flight Enquiry">Flight Enquiry</option>
                <option value="Hotel Booking">Hotel Booking</option>
                <option value="Fly Now Pay Later">Fly Now Pay Later</option>
                <option value="Group Booking">Group Booking</option>
                <option value="General">General</option>
              </select>
              {errors.subject && <span className="text-red-500 text-[10px] mt-1 block">{errors.subject}</span>}
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Message</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
              />
              {errors.message && <span className="text-red-500 text-[10px] mt-1 block">{errors.message}</span>}
            </div>

            <button
              type="submit"
              className="btn-gold w-full py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
