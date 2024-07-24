import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link, useNavigate } from "react-router-dom";
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
      city: "Mumbai",
    },
    {
      _id: 2,
      imageUrls: [
        "https://images.unsplash.com/photo-1598977054780-2dc700fdc9d3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      city: "Delhi",
    },
    {
      _id: 3,
      imageUrls: [
        "https://images.unsplash.com/photo-1667300376656-e5d2cc288918?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      city: "Jaipur",
    },
    {
      _id: 4,
      imageUrls: [
        "https://images.unsplash.com/photo-1603689200436-b212c976c011?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8S29sa2F0YSUyMGJlYXV0aWZ1bCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
      ],
      city: "Kolkata",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Latest Destinations */}
      <section className="lg:container lg:mx-auto">
        <h2 className="text-center text-goldColor text-2xl md:text-3xl mb-3 font-LuzuryF2 uppercase">
          <span className="font-bold">Popular</span> <span>Destinations</span>
        </h2>
        <p className="text-center mb-5 text-base md:text-lg text-fontSecondaryColor">
          Most recent destinations added by our hosts
        </p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 px-4">
          {latestDestHotels.slice(0, 6).map((hotel: any) => (
            <Link to={`/detail/${hotel._id}`}>
              <LatestDestinationCard key={hotel.id} hotel={hotel} />
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Destinations End */}

        <div className="relative p-6 rounded-lg my-8">
          <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-[#018292] to-[#00bdc8]">
            <div className="md:w-1/3 w-full">
              <img
                src="https://s3-alpha-sig.figma.com/img/74ea/c9d3/2a6b88a7300fdf105addbb336b50f009?Expires=1722816000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KqoSonWpp~-18fgRvvo4aehQ1Ty8oqeLobveaTvJGCTEx34g-0FZzeFnVxFAGsiq12CbdwiGhEFVO2AATG-zQAOeAOS4qZL1H55gSub-8WVO1uwhHn2HLK2lHZFfidQYYnCOHlNnrsALVRo2jZjRf6y~BKoJMs4p~riP96deUx5B62zvuC5rUyRDGj3wAg7UsoFUWM7Iwo7mGflaCMvgxirIfC~1xZoDZCn~J-ogkvR-i~MgitVChCyihNaUI6eL912glbP9f1DQhx3e-Ar3uKZgW0ryDvREGnTvgNWNfDs1zA3nP-HTAo3lS737AObbObGXi~p819OcZlgqFX4Dgw__"
                alt="Beach scene"
                className="shadow-md h-full"
              />
            </div>
            <div className="w-full md:w-2/3 md:pl-20 text-white py-4 px-2 md:px-0">
              <h2 className="text-3xl font-bold mb-4">
                Weekday specials: enjoy unbeatable rates!
              </h2>
              <p className="mb-6">
                Enjoy a mid-week escape and rediscover your summer.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg">
                Search Now
              </button>
            </div>
          </div>
        </div>
      {/* Top Destinations */}
      <section className="container mx-auto">
        <div className="flex flex-col">
          <h2 className="text-center text-goldColor text-2xl md:text-3xl mb-3 font-LuzuryF2 uppercase">
            <span className="font-bold">Explore</span> <span>Destinations</span>
          </h2>
          {/* <p className="text-center mb-10">
          Most recent desinations added by our hosts
        </p> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
            {topDestinations.map((hotel: any) => {
              return <TopDestinationCard hotel={hotel} key={hotel._id} />;
            })}
          </div>
        </div>
      </section>
      {/* Top Destinations End */}
      <section className="container mx-auto">
        <div className="py-14 px-4 mt-20">
          <h2 className="text-2xl font-bold text-left text-goldColor mb-10">
            HOW IT WORKS
          </h2>
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-14">
            <div className="flex flex-col items-center text-center lg:w-1/3">
              <div className="bg-[#00c0cb] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg text-goldColor">Explore</h3>
              <p className="leading-5 text-sm text-gray-700 mb-4">
                Explore our list of hotels and resorts in your area. We’re
                always adding new properties.
              </p>
              <div className="bg-[#00c0cb] text-white py-2 px-4 rounded-md">
                150,000+ Happy Daycationers
              </div>
            </div>

            <div className="flex flex-col items-center text-center lg:w-1/3">
              <div className="bg-[#00c0cb] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg text-goldColor">
                Pick & Book
              </h3>
              <p className="leading-5 text-sm text-gray-700 mb-4">
                Once you’ve picked a hotel or a resort, select a date and book
                your Daycation.
              </p>
              <div className="bg-[#00c0cb] text-white py-2 px-4 rounded-md">
                Risk Free Cancellation anytime
              </div>
            </div>

            <div className="flex flex-col items-center text-center lg:w-1/3">
              <div className="bg-[#00c0cb] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg text-goldColor">Enjoy</h3>
              <p className="leading-5 text-sm text-gray-700 mb-4">
                Check-in at the hotel and enjoy the good life! Relax, swim, eat,
                drink, and laugh.
              </p>
              <div className="bg-[#00c0cb] text-white py-2 px-4 rounded-md">
                Flexible Reservation dates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become Hotelier Section */}
      <div className="bg-[#fff6da]">
        <section className="container mx-auto">
          <div className="flex flex-col p-8 md:p-16 mx-8 md:mx-0 rounded-3xl gap-4">
            <div className="flex flex-col">
              <span className="flex text-2xl md:text-3xl mb-4 text-goldColor font-bold font-LuzuryF1 uppercase text-center justify-center">
                Are You A Hotelier?
              </span>
              <span className="text-center max-w-xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
                Join the world's top hotel brands using Daycation to increase
                their bottom line revenue.
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
          </div>
        </section>
      </div>

      {/* Become Hotelier Section End*/}
    </div>
  );
};

export default Home;
