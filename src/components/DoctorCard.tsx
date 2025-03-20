
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface DoctorCardProps {
  name: string;
  image: string;
  specialization: string;
  rating: number;
  location: string;
  experience: number;
  availability: string;
  className?: string;
  style?: CSSProperties;
}

const DoctorCard = ({
  name,
  image,
  specialization,
  rating,
  location,
  experience,
  availability,
  className,
  style,
}: DoctorCardProps) => {
  return (
    <div className={cn("glass-morphism rounded-xl overflow-hidden card-hover animate-float-up", className)} style={style}>
      <div className="p-6">
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            loading="lazy"
          />
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {specialization}
              </Badge>
              <div className="flex items-center text-amber-500">
                <Star size={14} className="fill-current" />
                <span className="text-xs ml-1">{rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} className="text-slate-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="text-slate-400" />
            <span>{experience} years experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone size={14} className="text-slate-400" />
            <span>Available {availability}</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="flex-1">View Profile</Button>
          <Button className="flex-1">Book Appointment</Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
