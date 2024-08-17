type Props = {
  selectedStars: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const StarRatingFilter = ({ selectedStars, onChange }: Props) => {
  return (
    <div className="border-b pb-5">
      <h4 className="text-lg mb-4">Hotel Class</h4>
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Any", value: "Any" },
          { label: "5 Star Hotels", value: "5 Star" },
          { label: "4 Star+ Hotels", value: "4+ Star" },
          { label: "3 Star+ Hotels", value: "3+ Star" },
        ].map((star) => (
          <label
            key={star.value}
            className={`flex items-center justify-center p-2 rounded-full cursor-pointer border ${
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
          </label>
        ))}
      </div>
    </div>
  );
};

export default StarRatingFilter;
