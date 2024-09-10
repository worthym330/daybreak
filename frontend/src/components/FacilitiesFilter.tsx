import { AmenitiesIcons, FacilityKey } from "../pages/Detail";
import { hotelFacilities } from "../config/hotel-options-config";

type Props = {
  selectedFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
  return (
    <div className="border-b pb-5 font-inter">
      <h4 className="text-lg mb-2">Amenities</h4>
      {hotelFacilities.map((facility) => (
        <label className="flex justify-between items-center space-x-2 leading-loose text-[#4A4A4A]">
          <div className="flex gap-1 items-center">
            {AmenitiesIcons[facility as FacilityKey] && (
              <span>{AmenitiesIcons[facility as FacilityKey]}</span>
            )}
            <span className="text-black">{facility}</span>
          </div>
          <input
            type="checkbox"
            className="rounded input-box"
            value={facility}
            checked={selectedFacilities.includes(facility)}
            onChange={onChange}
          />
        </label>
      ))}
    </div>
  );
};

export default FacilitiesFilter;
