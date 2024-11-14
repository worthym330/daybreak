import { AiFillStar } from "react-icons/ai";

type Props = {
  selectedStars: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const GuestRatingFilter = ({ selectedStars, onChange }: Props) => {
  return (
    <div className="border-b pb-5 font-inter">
      <h4 className="text-lg mb-2">Guest Rating</h4>
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Any", value: "Any" },
          { label: "5", value: "5" },
          { label: "4", value: "4" },
          { label: "3", value: "3" },
          { label: "2", value: "2" },
          { label: "1", value: "1" },
        ].map((star, idx) => (
          <label
            key={idx}
            className={`flex items-center justify-center gap-1 p-2 rounded-xl cursor-pointer border ${
              selectedStars.includes(star.value)
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              className="hidden"
              value={star.value}
              checked={selectedStars.includes(star.value)}
              onChange={onChange}
            />
            <span>{star.label}</span>
            {star.label !== "Any" && (
              <AiFillStar className="w-5 h-5 text-yellow-400" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default GuestRatingFilter;
