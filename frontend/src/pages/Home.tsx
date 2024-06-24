import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
// import hotelImg1 from "../assets/taj.jpg";
import LatestDestinationCard from "../components/LatestDestinationCard";
import TopDestinationCard from "../components/TopDestinationCard";
import Button from "../components/Button";

const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  const latestDestHotels = hotels || [];
  // const bottomRowHotels = hotels?.slice(2) || [];
  const navigate = useNavigate();

  const topDestinations = [
    {
      _id: 1,
      imageUrls: [
        "https://images.unsplash.com/photo-1598932982787-f54572e6cde4?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      name: "Mumbai",
    },
    {
      _id: 2,
      imageUrls: [
        "https://images.unsplash.com/photo-1598977054780-2dc700fdc9d3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      name: "Delhi",
    },
    {
      _id: 3,
      imageUrls: [
        "https://images.unsplash.com/photo-1667300376656-e5d2cc288918?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      name: "Jaipur",
    },
    {
      _id: 4,
      imageUrls: [
        "https://images.unsplash.com/photo-1603689200436-b212c976c011?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8S29sa2F0YSUyMGJlYXV0aWZ1bCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
      ],
      name: "Kolkata",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Latest Destinations */}
      <section className="">
        <h2 className="text-center text-fontPrimaryColor text-2xl md:text-3xl font-bold mb-3 font-LuzuryF1">
          Popular Destinations
        </h2>
        <p className="text-center mb-5 text-base md:text-lg text-fontSecondaryColor">
          Most recent destinations added by our hosts
        </p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
          {latestDestHotels.slice(0, 6).map((hotel: any) => (
            <LatestDestinationCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* Latest Destinations End */}

      {/* Top Destinations */}
      <section className="">
        <div className="flex flex-col">
          <h2 className="text-center text-fontPrimaryColor text-2xl md:text-3xl font-bold font-LuzuryF1">
            Explore Destinations
          </h2>
          {/* <p className="text-center mb-10">
          Most recent desinations added by our hosts
        </p> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {topDestinations.map((hotel: any) => {
              return <TopDestinationCard hotel={hotel} key={hotel._id} />;
            })}
          </div>
        </div>
      </section>
      {/* Top Destinations End */}

      {/* Become Hotelier Section */}
      <section className="flex flex-col p-8 md:p-16 mx-8 md:mx-0 rounded-3xl gap-4 bg-[#F6F5F5]">
        <div className="flex flex-col">
          <span className="flex text-2xl md:text-3xl mb-4 text-goldColor font-bold font-LuzuryF1 uppercase text-center justify-center">
            Are You A Hotelier?
          </span>
          <span className="text-center max-w-xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
            Join the world's top hotel brands using Daycation to increase their
            bottom line revenue.
          </span>
        </div>
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="relative col-span-1 p-2">
            <img
              className="rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
              alt="Taj Hotel"
            />
          </div>
          <div className="relative col-span-1 p-2">
            <img
              className="rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
              alt="Taj Hotel"
            />
          </div>
          <div className="relative col-span-1 p-2">
            <img
              className="rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
              alt="Taj Hotel"
            />
          </div>
          <div className="relative col-span-1 p-2">
            <img
              className="rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
              alt="Taj Hotel"
            />
          </div>
        </div> */}
        <div className="flex justify-center mt-8">
          <Button
            className="font-LuzuryF3"
            type="button"
            onClick={() => {
              navigate("/partner/register");
            }}
          >
            Become a Hotel Partner
          </Button>
        </div>
      </section>
      {/* Become Hotelier Section End*/}
    </div>
  );
};

export default Home;
