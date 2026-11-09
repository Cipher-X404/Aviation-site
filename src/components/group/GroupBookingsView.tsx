import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const GroupBookingsView: React.FC = () => {
  const { setActiveRoute } = useAppStore();

  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    phone: '',
    passengers: 10,
    departure: 'Lagos',
    destination: '',
    dates: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.orgName.trim()) newErrors.orgName = 'Organisation name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.passengers < 10) newErrors.passengers = 'Minimum 10 passengers required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.dates.trim()) newErrors.dates = 'Preferred dates are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ orgName: '', contactPerson: '', email: '', phone: '', passengers: 10, departure: 'Lagos', destination: '', dates: '', notes: '' });
        setErrors({});
      }, 5000);
    }
  };

  const groupTypes = [
    { icon: '🏢', label: 'Corporate Delegation', benefit: 'Dedicated account manager', desc: 'Seamless air travel for business teams and conferences.' },
    { icon: '🎓', label: 'School / Youth Groups', benefit: 'Group discounts', desc: 'Safe and organised travel for educational trips and excursions.' },
    { icon: '🤝', label: 'NGO & Government Missions', benefit: 'Priority routing', desc: 'Specialised support for humanitarian and official missions.' },
    { icon: '👨‍👩‍👧‍👦', label: 'Family Reunions', benefit: 'Flexible seating', desc: 'Coordinated travel for large family gatherings and events.' },
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center gap-10 py-16">
      {/* Hero Section */}
      <div className="max-w-4xl w-full">
        <h1 className="font-monument text-4xl sm:text-5xl normal-case tracking-tight text-[#0E2931] dark:text-[#EAEFEF]">Group & Corporate Travel</h1>
        <p className="max-w-2xl mx-auto text-sm leading-7 text-[#5A6B70] dark:text-[#849CA3] mt-4">
          Seamless air travel for 10 or more passengers — corporate delegations, school trips, NGO missions, and family reunions
        </p>
      </div>

      {/* Group Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {groupTypes.map((gt, idx) => (
          <div key={idx} className="bg-[#F4F6F5] dark:bg-[#09171C] p-6 rounded-xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
            <div className="text-3xl mb-3">{gt.icon}</div>
            <h3 className="font-monument text-lg font-bold text-[#0E2931] dark:text-[#EAEFEF]">{gt.label}</h3>
            <p className="text-sm text-[#5A6B70] dark:text-[#849CA3] mt-1">{gt.desc}</p>
            <div className="mt-3 text-[10px] font-mono text-[#F2B632] tracking-widest font-bold">Benefit: {gt.benefit}</div>
          </div>
        ))}
      </div>

      {/* Enquiry Form */}
      <div className="w-full max-w-3xl bg-[#F4F6F5] dark:bg-[#09171C] p-8 rounded-2xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm">
        {success ? (
          <div className="bg-[#2B7574]/10 dark:bg-[#2B7574]/20 border border-[#2B7574]/30 text-[#2B7574] dark:text-[#A5D1E1] p-4 rounded-lg text-center">
            Your group booking enquiry has been received. A dedicated travel consultant will contact you within 4 business hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Organisation name</label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.orgName && <span className="text-red-500 text-[10px] mt-1 block">{errors.orgName}</span>}
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Contact person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.contactPerson && <span className="text-red-500 text-[10px] mt-1 block">{errors.contactPerson}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.email && <span className="text-red-500 text-[10px] mt-1 block">{errors.email}</span>}
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.phone && <span className="text-red-500 text-[10px] mt-1 block">{errors.phone}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Number of passengers (min 10)</label>
                <input
                  type="number"
                  min="10"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 10 })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                />
                {errors.passengers && <span className="text-red-500 text-[10px] mt-1 block">{errors.passengers}</span>}
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Departure city</label>
                <select
                  value={formData.departure}
                  onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                  className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Owerri">Owerri</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Destination</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
              />
              {errors.destination && <span className="text-red-500 text-[10px] mt-1 block">{errors.destination}</span>}
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Preferred travel dates</label>
              <input
                type="text"
                value={formData.dates}
                onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
                placeholder="e.g. 15 Dec 2026 – 22 Dec 2026"
              />
              {errors.dates && <span className="text-red-500 text-[10px] mt-1 block">{errors.dates}</span>}
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-[.25em] uppercase text-[#2B7574] dark:text-[#A5D1E1] mb-1">Additional notes</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#F4F6F5] dark:bg-[#08181D] border border-[#2B7574]/30 dark:border-[#2B7574]/50 rounded-lg px-4 py-2 text-sm text-[#0E2931] dark:text-[#EAEFEF] focus:outline-none focus:border-[#F2B632]"
              />
            </div>

            <button
              type="submit"
              className="btn-gold w-full py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            >
              Submit Enquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
