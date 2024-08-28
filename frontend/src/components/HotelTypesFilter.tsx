import { hotelTypes } from "../config/hotel-options-config";

type Props = {
  selectedHotelTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelTypesFilter = ({ selectedHotelTypes, onChange }: Props) => {
  return (
    <div className="border-b pb-5 font-inter">
      <h4 className="text-lg mb-2">Vibes</h4>
      {hotelTypes.map((hotelType) => (
        <label className="flex justify-between items-center space-x-2 leading-loose text-[#4A4A4A]">
          <span className="text-black">{hotelType}</span>
          <input
            type="checkbox"
            className="rounded input-box"
            value={hotelType}
            checked={selectedHotelTypes.includes(hotelType)}
            onChange={onChange}
          />
        </label>
      ))}
    </div>
  );
};

export default HotelTypesFilter;
