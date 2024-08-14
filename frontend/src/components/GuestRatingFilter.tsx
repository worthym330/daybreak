type Props = {
    selectedStars: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  const GuestRatingFilter = ({ selectedStars, onChange }: Props) => {
    return (
      <div className="border-b pb-5">
        <h4 className="text-lg mb-2">Guest Rating</h4>
        {["Any", "5 Star", "4+ Star", "3+ Star"].map((star) => (
          <label className="flex items-center space-x-2 leading-loose text-[#4A4A4A]">
            <input
              type="checkbox"
              className="rounded input-box"
              value={star}
              checked={selectedStars.includes(star)}
              onChange={onChange}
            />
            <span>{star}</span>
          </label>
        ))}
      </div>
    );
  };
  
  export default GuestRatingFilter;