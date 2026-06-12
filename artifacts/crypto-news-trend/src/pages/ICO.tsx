import { useState } from "react";
import { mockIcos } from "@/lib/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Rocket, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ICO() {
  const [activeTab, setActiveTab] = useState("active");

  const filteredIcos = mockIcos.filter(ico => ico.status === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
            <Rocket className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Crypto Launchpad & Token Sales</h1>
        <p className="text-muted-foreground">
          Discover and participate in top-tier Web3 projects. Early access to the next generation of decentralized applications.
        </p>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-secondary">
            <TabsTrigger value="active" className="font-semibold tracking-wide px-8">Active Projects</TabsTrigger>
            <TabsTrigger value="upcoming" className="font-semibold tracking-wide px-8">Upcoming Projects</TabsTrigger>
            <TabsTrigger value="ended" className="font-semibold tracking-wide px-8">Ended Projects</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIcos.map((ico, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={ico.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-orange-500/50 transition-colors flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <img 
                    src={ico.logo} 
                    alt={ico.name} 
                    className="w-16 h-16 rounded-full ring-4 ring-background"
                  />
                  <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-xs font-mono font-semibold">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span className={ico.status === 'ended' ? 'text-muted-foreground' : 'text-foreground'}>
                      {ico.timeLeft}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-display font-bold text-xl mb-2">{ico.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-8 flex-grow">
                  {ico.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={ico.status === 'ended'}
                  >
                    Whitelist
                  </Button>
                  <Button variant="outline" className="w-full">
                    Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredIcos.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No projects found in this category.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
