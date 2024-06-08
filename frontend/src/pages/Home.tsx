import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";
import { useNavigate } from "react-router-dom";
// import hotelImg1 from "../assets/taj.jpg";
import Card from "../components/Card";

const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  const topRowHotels = hotels?.slice(0, 2) || [];
  // const bottomRowHotels = hotels?.slice(2) || [];
  const navigate = useNavigate();

  // const topRowHotels = [
  //   {
  //     id: 1,
  //     image: hotelImg1,
  //     name: "Taj Hotel",
  //     location: "Mumbai, India",
  //     rating: 4.9,
  //   },
  //   {
  //     id: 2,
  //     image: hotelImg1,
  //     name: "Taj Hotel",
  //     location: "Mumbai, India",
  //     rating: 4.9,
  //   },
  //   {
  //     id: 3,
  //     image: hotelImg1,
  //     name: "Taj Hotel",
  //     location: "Mumbai, India",
  //     rating: 4.9,
  //   },
  //   {
  //     id: 4,
  //     image: hotelImg1,
  //     name: "Taj Hotel",
  //     location: "Mumbai, India",
  //     rating: 4.9,
  //   },
  //   {
  //     id: 5,
  //     image: hotelImg1,
  //     name: "Taj Hotel",
  //     location: "Mumbai, India",
  //     rating: 4.9,
  //   },
  //   {
  //     id: 6,
  //     image: hotelImg1,
  //     name: "Taj Hotel",
  //     location: "Mumbai, India",
  //     rating: 4.9,
  //   },
  // ];

  // const bottomRowHotels = [
  //   {
  //     id: 1,
  //     image: [hotelImg1, hotelImg1, hotelImg1, hotelImg1, hotelImg1],
  //     name: "Taj Hotel",
  //     location: "Mumbai, India",
  //     rating: 4.9,
  //     price: 1000,
  //   },
  //   {
  //     id: 2,
  //     image: [hotelImg1, hotelImg1, hotelImg1, hotelImg1, hotelImg1],
  //     name: "Taj Hotel",
  //     location: "Goa, India",
  //     rating: 4.9,
  //     price: 1000,
  //   },
  //   {
  //     id: 3,
  //     image: [hotelImg1, hotelImg1, hotelImg1, hotelImg1, hotelImg1],
  //     name: "Taj Hotel",
  //     location: "Kannor, India",
  //     rating: 4.9,
  //     price: 1000,
  //   },
  //   {
  //     id: 4,
  //     image: [hotelImg1, hotelImg1, hotelImg1, hotelImg1, hotelImg1],
  //     name: "Taj Hotel",
  //     location: "Lakshwadweep, India",
  //     rating: 4.9,
  //     price: 1000,
  //   },
  // ];

  return (
    <div className="space-y-3">
      <section className="flex flex-col">
        <h2 className="text-center text-gray-700 text-3xl font-bold mb-5">
          Latest Destinations
        </h2>
        <p className="text-center mb-10">
          Most recent desinations added by our hosts
        </p>
        <div className="grid gap-4">
          <div className="grid md:grid-cols-3 gap-4">
            {topRowHotels.map((a: any) => (
              <LatestDestinationCard hotel={a} />
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col py-4">
        <h2 className="text-center text-gray-700 text-3xl font-bold mb-5">
          Top Destinations
        </h2>
        {/* <p className="text-center mb-10">
          Most recent desinations added by our hosts
        </p> */}

        <div className="grid gap-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {topRowHotels.map((hotel: any) => {
              return <Card hotel={hotel} key={hotel.id} />;
            })}
          </div>
        </div>
      </div>

      {/* Become Hotelier Section */}
      <section className="flex flex-col p-16 rounded-3xl gap-4 bg-gray-100">
        <div className="flex flex-col">
          <span className="flex text-3xl mb-4 text-red-500 font-bold uppercase text-nowrap justify-center">
            Are You A Hotelier?
          </span>
          <span className="text-center max-w-xl mx-auto mb-12">
            Join the world's top hotel brands using Daycation to increase their
            bottom line revenue.
          </span>
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <div className="relative col-span-1">
            <img className="p-2 rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png" alt="Taj Hotel" />
          </div>
          <div className="relative col-span-1">
            <img className="p-2 rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png" alt="Taj Hotel" />
          </div>
          <div className="relative col-span-1">
            <img className="p-2 rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png" alt="Taj Hotel" />
          </div>
          <div className="relative col-span-1">
            <img className="p-2 rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png" alt="Taj Hotel" />
          </div>
        </div> */}
        <div className="flex justify-center">
          <button
            className="text-white bg-btnColor h-full py-3 px-7 font-bold text-xl hover:bg-[#2f8794] rounded-md "
            type="button"
            onClick={() => {
              navigate("/partner/register");
            }}
          >
            Become a Hotel Partner
          </button>
        </div>
      </section>
      {/* Become Hotelier Section End*/}
    </div>
  );
};

export default Home;
