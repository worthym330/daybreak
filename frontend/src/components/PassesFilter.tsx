import { hotelProducts } from "../config/hotel-options-config";
import { titleIcons, TitleKey } from "./ProductCard";

type Props = {
  selectedHotelTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PassesFilter = ({ selectedHotelTypes, onChange }: Props) => {
  return (
    <div className="border-b pb-5 font-inter">
      <h4 className="text-lg mb-2">Passes</h4>
      {hotelProducts.map((hotelType) => (
        <label className="flex justify-between items-center space-x-2 leading-loose text-[#4A4A4A]">
          <div className="flex gap-1 items-center">
            {titleIcons[hotelType.toUpperCase() as TitleKey] && (
              <span>{titleIcons[hotelType.toUpperCase() as TitleKey]}</span>
            )}
            <span className="text-black">{hotelType}</span>
          </div>
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

export default PassesFilter;
