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
  Rate: number;
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
    name: "Dr. Sarah Johnson",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    specialization: "Cardiologist",
    rating: 0,
    location: "New York",
    Rate: 4.7,
    experience: 15,
    availability: "Mon, Wed, Fri",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    specialization: "Cardiac Surgeon",
    rating: 0,
    location: "Boston",
    Rate: 3.9,
    experience: 12,
    availability: "Tue, Thu, Sat",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop",
    specialization: "Electrophysiologist",
    rating: 0,
    location: "Chicago",
    Rate: 3.5,
    experience: 10,
    availability: "Mon-Fri",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop",
    specialization: "Interventional Cardiologist",
    rating: 0,
    location: "Los Angeles",
    Rate: 4.1,
    experience: 14,
    availability: "Wed-Sun",
    totalRatings: 2,
    totalRatingValue: 9.0,
  },
  {
    id: 5,
    name: "Dr. James Ray",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop",
    specialization: "Interventional Cardiologist",
    rating: 0,
    location: "Kolkata",
    Rate: 4.9,
    experience: 14,
    availability: "Fri-Sun",
    totalRatings: 2,
    totalRatingValue: 9.0,
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

      const matchesRating = rating === "all" || doc.Rate >= parseFloat(rating);

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
                (doctor.totalRatingValue + newRating) /
                (doctor.totalRatings + 1),
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
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="boston">Boston</SelectItem>
                    <SelectItem value="chicago">Chicago</SelectItem>
                    <SelectItem value="los-angeles">Los Angeles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
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
              </div>

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