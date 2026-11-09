import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const BLOG_POSTS = [
  {
    id: 1,
    category: 'PACKING GUIDE',
    title: 'Packing Essentials for West Africa',
    excerpt: 'Packing for West Africa requires a balance between comfort and utility. We recommend lightweight fabrics and essential travel documents. Always carry a portable power bank for your devices.',
    author: 'Amara Okafor',
    date: '2026-11-02',
    body: 'When travelling from Owerri, the weather can vary significantly between coastal and inland regions. Our guide covers everything from clothing to medical essentials. Ensure your passport is valid for at least six months. \n\nRemember to pack universal adapters and local currency. CJ Travels provides complimentary travel kits for premium bookings.',
  },
  {
    id: 2,
    category: 'DESTINATION',
    title: 'Exploring Dubai: A Travel Note',
    excerpt: 'Dubai offers a unique blend of modern architecture and traditional heritage. From the Burj Khalifa to the historic souks, every corner tells a story. Plan your visit during the cooler months.',
    author: 'Chidi Nwafor',
    date: '2026-11-05',
    body: 'The flight from Owerri to Dubai connects through major hubs, offering seamless transit. Once there, the sanctuary suites provide a perfect retreat. \n\nDon’t miss the desert safari and the vibrant food scene in the downtown area. CJ Travels partners with local guides for an authentic experience.',
  },
  {
    id: 3,
    category: 'FINANCE TIP',
    title: 'Maximising 0% APR with FNPL',
    excerpt: 'Our Fly Now Pay Later scheme allows you to split payments without interest. Understand how to use the console effectively. Plan your budget for the next quarter.',
    author: 'Eberechi Nwosu',
    date: '2026-11-07',
    body: 'The FNPL console lets you track your instalments and adjust payment dates. Interest-free periods apply to all flights departing from Owerri. \n\nConsult our finance team for bespoke corporate plans. Always review the terms before confirming your booking.',
  },
  {
    id: 4,
    category: 'AIRPORT GUIDE',
    title: 'Navigating MM2 Lagos',
    excerpt: 'Murtala Muhammed Airport Terminal 2 is a gateway for international travellers. Learn about check-in procedures and lounge access. CJ Travels offers dedicated transfers.',
    author: 'Ifeoma Okeke',
    date: '2026-10-30',
    body: 'Arrival at MM2 can be seamless with our chauffeur services. Follow the signs for international departures and ensure your boarding pass is ready. \n\nOur lounge partners offer complimentary refreshments and Wi-Fi. Enjoy a stress-free journey from Owerri to the world.',
  },
  {
    id: 5,
    category: 'HOTEL REVIEW',
    title: 'Sanctuary Suites: Lagos Edition',
    excerpt: 'Verified properties in Lagos offer unparalleled comfort. From the rooftop pool to the fine dining, every detail is curated. Book your stay through CJ Travels.',
    author: 'Nnamdi Eze',
    date: '2026-11-01',
    body: 'The Lagos sanctuary suite features panoramic views of the Atlantic. Guests enjoy complimentary breakfast and airport transfers. \n\nOur rating system ensures only the best properties are featured. Read more about the amenities and special packages available this season.',
  },
  {
    id: 6,
    category: 'VISA TIP',
    title: 'UK Visa Process for Nigerians',
    excerpt: 'Understanding the UK visa requirements is crucial for a smooth journey. Our experts guide you through the application process. Start early to avoid delays.',
    author: 'Blessing Uche',
    date: '2026-11-08',
    body: 'The UK visa application now includes biometric registration in Owerri. Ensure all documents are verified before submission. \n\nCJ Travels provides consultation services for complex cases. Contact our support team for personalised assistance.',
  },
];

export const BlogView: React.FC = () => {
  const { setActiveRoute } = useAppStore();
  const [filter, setFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState<typeof BLOG_POSTS[0] | null>(null);

  const filteredPosts = filter === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === filter);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center gap-10 py-16">
      {/* Page Header */}
      <div className="max-w-4xl w-full">
        <span className="text-[10px] font-mono tracking-[.28em] uppercase text-[#F2B632]">CJ Travels Journal</span>
        <h1 className="font-monument text-4xl sm:text-5xl normal-case tracking-tight text-[#0E2931] dark:text-[#EAEFEF] mt-2">Travel Tips & Guides</h1>
        <p className="max-w-2xl mx-auto text-sm leading-7 text-[#5A6B70] dark:text-[#849CA3] mt-4">
          Practical advice for journeys departing from Owerri and across West Africa
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 justify-center">
        {['All', 'PACKING GUIDE', 'DESTINATION', 'FINANCE TIP', 'AIRPORT GUIDE', 'HOTEL REVIEW', 'VISA TIP'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-[#F2B632] text-[#0E2931] border border-[#F2B632]'
                : 'bg-[#F4F6F5] dark:bg-[#09171C] border border-[#2B7574]/30 dark:border-[#2B7574]/50 text-[#0E2931] dark:text-[#EAEFEF] hover:border-[#F2B632]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-[#F4F6F5] dark:bg-[#09171C] rounded-xl border border-[#2B7574]/25 dark:border-[#2B7574]/40 shadow-sm overflow-hidden group cursor-pointer" onClick={() => setSelectedPost(post)}>
            {/* Placeholder Image Area */}
            <div className="h-40 bg-gradient-to-br from-[#2B7574] via-[#F2B632] to-[#0E2931] relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              <span className="absolute top-3 left-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F2B632] text-[#0E2931]">{post.category}</span>
            </div>
            <div className="p-6">
              <h3 className="font-monument text-xl font-bold text-[#0E2931] dark:text-[#EAEFEF]">{post.title}</h3>
              <p className="text-sm text-[#5A6B70] dark:text-[#849CA3] mt-2 leading-relaxed">{post.excerpt}</p>
              <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-[#2B7574] dark:text-[#A5D1E1]">
                <span>By {post.author}</span>
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Expanded View */}
      {selectedPost && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F4F6F5] dark:bg-[#09171C] w-full max-w-3xl rounded-2xl border border-[#2B7574]/30 dark:border-[#2B7574]/50 shadow-2xl p-8 relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#12484C] border border-[#2B7574] text-[#F2B632] flex items-center justify-center hover:scale-105 transition-all"
            >
              ✕
            </button>
            <span className="text-[10px] font-mono tracking-[.28em] uppercase text-[#F2B632]">{selectedPost.category}</span>
            <h1 className="font-monument text-3xl font-bold text-[#0E2931] dark:text-[#EAEFEF] mt-2">{selectedPost.title}</h1>
            <div className="flex justify-between items-center mt-3 text-[10px] font-mono text-[#2B7574] dark:text-[#A5D1E1]">
              <span>By {selectedPost.author}</span>
              <span>{selectedPost.date}</span>
            </div>
            <div className="mt-6 text-sm leading-8 text-[#5A6B70] dark:text-[#849CA3] space-y-4">
              {selectedPost.body.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <button
              onClick={() => setSelectedPost(null)}
              className="btn-gold mt-8 w-full py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200"
            >
              Close Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
