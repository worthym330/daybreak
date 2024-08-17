import { hotelFacilities } from "../config/hotel-options-config";

type Props = {
  selectedFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
  return (
    <div className="border-b pb-5">
      <h4 className="text-lg mb-2">Amenities</h4>
      {hotelFacilities.map((facility) => (
        <label className="flex items-center space-x-2 leading-loose text-[#4A4A4A]">
          <input
            type="checkbox"
            className="rounded input-box"
            value={facility}
            checked={selectedFacilities.includes(facility)}
            onChange={onChange}
          />
          <span>{facility}</span>
        </label>
      ))}
    </div>
  );
};

export default FacilitiesFilter;