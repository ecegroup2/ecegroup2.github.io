import MainLayout from "@/layouts/MainLayout";
import React from "react";

interface TeamMember {
  id: number;
  name: string;
  photo: string;
  role: string;
  intro: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Mrs. Sumani Mukherjee",
    photo: "/SMC.jpg",
    role: "Project Guider",
    intro: `Assistant Professor || Electronics & Communication Engineering Department`,
  },
  {
    id: 2,
    name: "Soumik Pal",
    photo: "https://via.placeholder.com/100",
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
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-gray-900 to-gray-700 text-white py-12 px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          Meet Our Brilliant Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 perspective">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-xl transform-style preserve-3d transition-transform duration-700 hover:rotate-y-12 hover:-rotate-x-6 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
              <div className="relative p-6 z-10">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500 shadow-md"
                />
                <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                <p className="text-sm text-center text-purple-300 italic mb-2">{member.role}</p>
                <p className="text-center text-gray-300 text-sm">{member.intro}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Testimonial;
