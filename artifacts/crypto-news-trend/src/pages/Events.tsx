import { useState } from "react";
import { mockEvents, EVENT_STATUSES } from "@/lib/mockData";
import { format } from "date-fns";
import { MapPin, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Events() {
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesStatus = activeStatus === "ALL" || event.status === activeStatus;
    const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) || 
                          event.location.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Web3 & Fintech Events</h1>
        <p className="text-muted-foreground text-lg">Discover the most important conferences, hackathons, and meetups in crypto.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
        <div className="flex flex-wrap gap-2">
          {EVENT_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search events or locations..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={event.id}
            className="group rounded-xl overflow-hidden bg-card border border-border hover:border-purple-500/50 transition-colors flex flex-col h-full"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={event.imageUrl} 
                alt={event.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-sm shadow-sm ${
                  event.status === 'ONGOING' ? 'bg-green-500 text-white' :
                  event.status === 'UPCOMING' ? 'bg-blue-500 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-display font-semibold text-lg mb-3 line-clamp-2">{event.name}</h3>
              
              <div className="mt-auto space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No events found matching your criteria.
        </div>
      )}
    </div>
  );
}
