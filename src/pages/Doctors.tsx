import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import DoctorCard from "@/components/DoctorCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";

type Doctor = {
  id: number;
  name: string;
  image: string;
  specialization: string;
  Rate: string;
  rating: number;
  location: string;
  experience: number;
  availability: string;
  totalRatings: number;
  totalRatingValue: number;
};

const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Saurabh Sen",
    image: "/doctor1.avif", 
      // "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    specialization: "Cardiologist",
    rating: 0,
    location: "Kolkata",
    Rate: "4.7",
    experience: 4,
    availability: "Mon, Wed, Fri",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },
  {
    id: 2,
    name: "Dr. Smaranya Mukherjee",
    image:"/doctor2.jpg" ,
      // "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    specialization: "Cardiac Surgeon",
    rating: 0,
    location: "Kolkata",
    Rate: "3.9",
    experience: 5,
    availability: "Tue, Thu, Sat",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },
  {
    id: 3,
    name: "Dr. Aradhya Samui",
    image: "/doctor3.jpg",
      // "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop",
    specialization: "Electrophysiologist",
    rating: 0,
    location: "Durgapur",
    Rate: "3.5",
    experience: 2.1,
    availability: "Mon-Fri",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },
  {
    id: 4,
    name: "Dr. Sofia Quadri",
    image: "/doctor4.jpg",
      // "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop",
    specialization: "Interventional Cardiologist",
    rating: 0,
    location: "Siliguri",
    Rate: "4.1",
    experience: 4,
    availability: "Wed-Sun",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },
  {
    id: 5,
    name: "Dr. Samrat Sen",
    image: "/doctor5.avif",
      // "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop",
    specialization: "Heart Failure Specialist",
    rating: 0,
    location: "Arambagh",
    Rate: "4.9",
    experience: 9,
    availability: "Fri-Sun",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },

  {
    id: 6,
    name: "Indra Bahadur Rai",
    image: "/doctor6.avif",
    // "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=2864&auto=format&fit=crop",
    specialization: "Interventional Cardiologist",
    rating: 0,
    location: "Kolkata",
    Rate: "4.1",
    experience: 14,
    availability: "Thu-Fri",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },

  {
    id: 7,
    name: "Dr. Anisha Gurung",
    image: "/doctor7.jpg",
    //  "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2864&auto=format&fit=crop",
    specialization: "Electrophysiologist",
    rating: 0,
    location: "Darjeeling",
    Rate: "4.5",
    experience: 3.5,
    availability: "Mon-Wed",
    totalRatings: 2,
    totalRatingValue: 9.0
  },
  {
    id: 8,
    name: "Dr. Rajesh Pradhan",
    image: "/doctor8.avif",
    //  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2864&auto=format&fit=crop",
    specialization: "Cardiothoracic Surgeon",
    rating: 0,
    location: "Barasat",
    Rate: "3.3",
    experience: 18,
    availability: "Tue-Sat",
    totalRatings: 4,
    totalRatingValue: 9
  },
  {
    id: 9,
    name: "Dr. Priya Tamang",
    image: "/doctor9.jpg",
    // "https://images.unsplash.com/photo-1595433707802-0c1fbd6c0bc8?q=80&w=2864&auto=format&fit=crop",
    specialization: "Interventional Cardiologist",
    rating: 0,
    location: "Mirik",
    Rate: "4.7",
    experience: 1.7,
    availability: "Wed-Sun",
    totalRatings: 10,
    totalRatingValue: 9
  },
  {
    id: 10,
    name: "Dr. Pranay Koley",
    image: "/doctor10.avif",
    // "https://unsplash.com/photos/doctor-holding-red-stethoscope-hIgeoQjS_iE",
    specialization: "Cardiologist",
    rating: 0,
    location: "Kharagpur",
    Rate: "4.2",
    experience: 6,
    availability: "Mon-Fri",
    totalRatings: 12,
    totalRatingValue: 11
  },

  
];

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [location, setLocation] = useState("all");
  const [rating, setRating] = useState("all");

  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [filteredDoctors, setFilteredDoctors] =
    useState<Doctor[]>(initialDoctors);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const applyFilters = () => {
    const filtered = doctors.filter((doc) => {
      const matchesSearch =
        searchTerm === "" ||
        normalize(doc.name).includes(normalize(searchTerm)) ||
        normalize(doc.specialization).includes(normalize(searchTerm));

      const matchesSpecialization =
        specialization === "all" ||
        normalize(doc.specialization).includes(normalize(specialization));

      const matchesLocation =
        location === "all" ||
        normalize(doc.location).includes(normalize(location));

      const matchesRating = rating === "all" || doc.Rate ;

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesLocation &&
        matchesRating
      );
    });

    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, specialization, location, rating]);

  function handleRateDoctor(id: number, newRating: number): void {
    setDoctors((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor.id === id
          ? {
              ...doctor,
              totalRatings: doctor.totalRatings + 1,
              totalRatingValue: doctor.totalRatingValue + newRating,
              Rate:
                (
                  (doctor.totalRatingValue + newRating) /
                  (doctor.totalRatings + 1)
                ).toFixed(1),
            }
          : doctor
      )
    );
  }

  

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-2 ">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Find Cardiac Specialists
        </h1>
        <p className="text-muted-foreground mt-1 mb-4">
          Connect with experts in cardiac care based on your health needs
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {/* Filter Section */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky top-24 animate-float-up">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={18} />
                    Find Your Specialist
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Based on your health metrics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Doctor name or specialty"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Select defaultValue="all" onValueChange={setSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="cardiac-surgeon">
                      Cardiac Surgeon
                    </SelectItem>
                    <SelectItem value="electrophysiologist">
                      Electrophysiologist
                    </SelectItem>
                    <SelectItem value="interventional">
                      Interventional Cardiologist
                    </SelectItem>
                    <SelectItem value="cardiologist">
                      Cardiologist
                    </SelectItem>
                    <SelectItem value="heart failure specialist">
                      Heart Failure Specialist
                    </SelectItem>
                    <SelectItem value="cardiothoracic surgeon">
                      Cardiothoracic Surgeon
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Durgapur">Durgapur</SelectItem>
                    <SelectItem value="Siliguri">Siliguri</SelectItem>
                    <SelectItem value="Arambagh">Arambagh</SelectItem>
                    <SelectItem value="Darjeeling">Darjeeling</SelectItem>
                    <SelectItem value="Barasat">Barasat</SelectItem>
                    <SelectItem value="Mirik">Mirik</SelectItem>
                    <SelectItem value="Kharagpur">Kharagpur</SelectItem>

                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <Select defaultValue="all" onValueChange={setRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                    <SelectItem value="2.0">2.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <Button className="w-full mt-2" onClick={applyFilters}>
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Doctor List Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="animate-float-up">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={18} />
                    Recommended Specialists
                  </CardTitle>
                  <CardDescription className="mb-2 mt-1">
                    Based on your health metrics
                  </CardDescription>
                </div>
                {/* <Badge
                  variant="outline"
                  className="flex text-[8px] md:text-[12px] items-center gap-1 bg-white cursor-pointer w-fit mt-2 md:mt-0"
                >
                  <MapPin size={12} className="text-green-500" />
                  Near You
                </Badge> */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                {filteredDoctors.length === 0 ? (
                  <div>No doctors match your criteria</div>
                ) : (
                  filteredDoctors.map((doctor, index) => (
                    <DoctorCard
                      key={doctor.id}
                      id={doctor.id}
                      name={doctor.name}
                      image={doctor.image}
                      specialization={doctor.specialization}
                      Rate={doctor.Rate}
                      rating={doctor.rating}
                      location={doctor.location}
                      experience={doctor.experience}
                      availability={doctor.availability}
                      onRateDoctor={handleRateDoctor}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Doctors;