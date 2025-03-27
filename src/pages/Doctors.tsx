
import MainLayout from "@/layouts/MainLayout";
import DoctorCard from "@/components/DoctorCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample doctor data
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    specialization: "Cardiologist",
    rating: 4.9,
    location: "New York Medical Center",
    experience: 15,
    availability: "Mon, Wed, Fri",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    specialization: "Cardiac Surgeon",
    rating: 4.7,
    location: "Heart Institute",
    experience: 12,
    availability: "Tue, Thu, Sat",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop",
    specialization: "Electrophysiologist",
    rating: 4.8,
    location: "Cardiac Rhythm Center",
    experience: 10,
    availability: "Mon-Fri",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop",
    specialization: "Interventional Cardiologist",
    rating: 4.6,
    location: "Cardiovascular Specialists",
    experience: 14,
    availability: "Wed-Sun",
  },
];

const Doctors = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Find Cardiac Specialists</h1>
        <p className="text-muted-foreground mt-1">
          Connect with experts in cardiac care based on your health needs
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card className="sticky top-24 animate-float-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter size={18} />
                Filter Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input placeholder="Doctor name or specialty" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="cardiac-surgeon">Cardiac Surgeon</SelectItem>
                    <SelectItem value="electrophysiologist">Electrophysiologist</SelectItem>
                    <SelectItem value="interventional">Interventional Cardiologist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select defaultValue="all">
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
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full mt-2">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <Card className="animate-float-up">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={18} />
                    Recommended Specialists
                  </CardTitle>
                  <CardDescription>Based on your health metrics</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1 bg-white">
                    <MapPin size={12} className="text-green-500 font-bold" />
                    Near You
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {doctors.map((doctor, index) => (
                  <DoctorCard
                    key={doctor.id}
                    name={doctor.name}
                    image={doctor.image}
                    specialization={doctor.specialization}
                    rating={doctor.rating}
                    location={doctor.location}
                    experience={doctor.experience}
                    availability={doctor.availability}
                    className={{ 'animate-float-up': true, 'opacity-0': true }['']}
                    style={{ animationDelay: `${0.1 * index}s` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Doctors;
