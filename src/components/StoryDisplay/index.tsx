import { PlaceInfo } from "@/models/placeInfo";
import { RideStats } from "@/models/rideStats";

export interface StoryDisplayProps {
  places: PlaceInfo[];
  rideStats: RideStats;
}

export function StoryDisplay({ places, rideStats }: StoryDisplayProps) {
  return (
    <div className="border border-gray-500 w-1/2 mx-auto shadow-lg rounded">
      <header className="bg-secondary-1 flex justify-center text-white my-2">
        <h2 className="font-semibold h-10 flex items-center">My Story</h2>
      </header>

      <p className="p-4 text-justify">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum optio
        vel praesentium voluptates incidunt labore maiores eveniet delectus.
        Quam blanditiis facilis placeat amet eos minus vel reprehenderit id,
        exercitationem veniam! Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Fugiat minus labore provident ea saepe accusamus
        deleniti quae, dicta nihil aliquam enim iste ullam aperiam minima
        deserunt laboriosam. Illo, consequuntur repellendus. Lorem ipsum dolor
        sit amet consectetur adipisicing elit. Laboriosam placeat quas fugit,
        explicabo sequi ducimus, aut vel veritatis qui delectus aliquam
        molestiae ipsa tempora! Doloremque asperiores debitis odio rem enim!
      </p>
    </div>
  );
}
