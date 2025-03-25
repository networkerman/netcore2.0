import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AdPlatform } from '@/types/ad.types';
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TargetingEditorProps {
  platform: AdPlatform;
}

export default function TargetingEditor({ platform }: TargetingEditorProps) {
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [ageRange, setAgeRange] = useState([18, 65]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocation && !locations.includes(newLocation)) {
      setLocations([...locations, newLocation]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location: string) => {
    setLocations(locations.filter(l => l !== location));
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Location Targeting</h3>
        <form onSubmit={handleAddLocation} className="flex gap-2 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Add location (city, region, or country)"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
          </div>
          <Button type="submit">Add</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <Badge key={location} variant="secondary">
              {location}
              <button
                onClick={() => handleRemoveLocation(location)}
                className="ml-2 hover:text-destructive"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Age Range</h3>
        <div className="space-y-4">
          <Slider
            value={ageRange}
            min={13}
            max={65}
            step={1}
            onValueChange={setAgeRange}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Age: {ageRange[0]}</span>
            <span>to {ageRange[1]}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Interests</h3>
        <form onSubmit={handleAddInterest} className="flex gap-2 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Add interest or behavior"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
            />
          </div>
          <Button type="submit">Add</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <Badge key={interest} variant="secondary">
              {interest}
              <button
                onClick={() => handleRemoveInterest(interest)}
                className="ml-2 hover:text-destructive"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </Card>

      {platform === 'meta' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Custom Audiences</h3>
          <p className="text-sm text-gray-500">
            Connect your Meta Ads account to import custom audiences
          </p>
          <Button variant="outline" className="mt-4">
            Connect Meta Account
          </Button>
        </Card>
      )}
    </div>
  );
} 