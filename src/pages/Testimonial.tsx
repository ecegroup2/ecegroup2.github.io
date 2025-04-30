import MainLayout from "@/layouts/MainLayout";
import React, { useState } from "react";
import { GraduationCap, Briefcase, Users, ChevronRight, ChevronLeft } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  photo: string | null;
  role: string;
  intro: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Mrs. Sumani Mukherjee",
    photo: "/SMC.jpg",
    role: "Project Mentor",
    intro: `Assistant Professor || Electronics & Communication Engineering Department`,
  },
  {
    id: 2,
    name: "Soumik Pal",
    photo: null,
    role: "Project Leader",
    intro: "Student of Electronics & Communication Engineering Department",
  },
  {
    id: 3,
    name: "Premanshu Ray",
    photo: "/premanshuray.jpg",
    role: "Project Member",
    intro: "Student of Electronics & Communication Engineering Department",
  },
  {
    id: 4,
    name: "Ali Hossain Munshi",
    photo: "/alihossainmunshi.jpg",
    role: "Project Member",
    intro: "Student of Electronics & Communication Engineering Department",
  },
  {
    id: 5,
    name: "Tushar Koley",
    photo: "/tusharkoley.png",
    role: "Project Member",
    intro: "Student of Electronics & Communication Engineering Department",
  },
];

const Testimonial: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<'grid' | 'carousel'>('grid');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleIcon = (role: string) => {
    if (role.includes("Mentor")) return <GraduationCap className="mr-1" size={16} />;
    if (role.includes("Leader")) return <Briefcase className="mr-1" size={16} />;
    return <Users className="mr-1" size={16} />;
  };

  const handlePrev = () => {
    setActiveIndex(current => {
      if (current === null) return teamMembers.length - 1;
      return current === 0 ? teamMembers.length - 1 : current - 1;
    });
  };

  const handleNext = () => {
    setActiveIndex(current => {
      if (current === null) return 0;
      return (current + 1) % teamMembers.length;
    });
  };

  // Card component for both grid and carousel
  const TeamCard: React.FC<{ member: TeamMember; big?: boolean }> = ({ member, big }) => (
    <div
      className={`group relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 
        bg-white/80 backdrop-blur-sm transition-transform duration-500 hover:scale-105 hover:shadow-xl
        flex flex-col items-center p-8 ${big ? "w-full max-w-xl mx-auto" : ""}`}
    >
      {/* Animated Gradient Border */}
      <div className="relative mb-6">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-teal-400 via-blue-600 to-cyan-500 blur-lg opacity-70 group-hover:opacity-100 animate-spin-slow"></div>
        {member.photo ? (
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md border-4 border-white/50">
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-teal-400 via-blue-600 to-cyan-500 flex items-center justify-center text-white text-4xl font-extrabold shadow-md border-4 border-white/50">
            {getInitials(member.name)}
          </div>
        )}
      </div>
      {/* Name and Role */}
      <h3 className="text-2xl font-semibold text-slate-900 mb-1 text-center">{member.name}</h3>
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-600/80 text-white text-sm mb-3">
        {getRoleIcon(member.role)}
        {member.role}
      </span>
      {/* Intro */}
      <p className="text-center text-slate-700 text-base">{member.intro}</p>
    </div>
  );

  // Carousel view
  const renderCarousel = () => {
    const current = activeIndex === null ? 0 : activeIndex;
    const member = teamMembers[current];

    return (
      <div className="relative max-w-xl mx-auto px-4 py-12">
        <TeamCard member={member} big />
        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-6">
          <button
            onClick={handlePrev}
            className="bg-teal-400/40 hover:bg-teal-400/70 text-white rounded-full p-2 shadow-md transition duration-300"
            aria-label="Previous team member"
          >
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-6">
          <button
            onClick={handleNext}
            className="bg-teal-400/40 hover:bg-teal-400/70 text-white rounded-full p-2 shadow-md transition duration-300"
            aria-label="Next team member"
          >
            <ChevronRight size={28} />
          </button>
        </div>
        {/* Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 mt-6">
          {teamMembers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current
                  ? "bg-cyan-600 w-6"
                  : "bg-teal-400/50 w-2 hover:bg-cyan-600"
              }`}
              aria-label={`Go to team member ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Grid view
  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {teamMembers.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className="bg-[#282829] text-slate-900 py-4 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-9">
            <h1 className="inline-block text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-600 to-cyan-500 animate-text">
              Meet Our Caring Team
            </h1>
            <p className="max-w-2xl mx-auto text-slate-700">
              The dedicated professionals behind our healthcare project
            </p>
          </div>
          {/* View toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setSelectedView('grid')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  selectedView === 'grid'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-teal-700 hover:bg-gray-200'
                } transition-colors duration-300`}
              >
                Grid View
              </button>
              <button
                onClick={() => setSelectedView('carousel')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  selectedView === 'carousel'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-teal-700 hover:bg-gray-200'
                } transition-colors duration-300`}
              >
                Carousel View
              </button>
            </div>
          </div>
          {/* Content */}
          {selectedView === 'grid' ? renderGrid() : renderCarousel()}
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes text-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-text {
          background-size: 200% 200%;
          animation: text-gradient 6s ease infinite;
        }
        .animate-spin-slow {
          animation: slow-spin 10s linear infinite;
        }
      `}</style>
    </MainLayout>
  );
};

export default Testimonial;
