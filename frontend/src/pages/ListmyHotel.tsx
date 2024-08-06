import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ListMyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="font-poppins">
      {/* Header */}
      <Header />
      {/* <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DayBreakPass</h1>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="bg-[#c2ffff] flex flex-col md:flex-row items-center my-10">
        <div className="w-full md:w-1/2 px-4 md:px-8 lg:px-16">
          <h2 className="text-4xl font-bold text-[#02596c] my-4">
            DayBreakPass
          </h2>
          <h2 className="text-6xl font-bold text-orange-500">
            Become a Hotel Partner
          </h2>
          <p className="my-4 text-xl text-[#02596c]">
            "Unlock Your Property's Full Potential"
          </p>
          <button
            className="mt-8 px-6 py-3 bg-orange-500 text-white uppercase rounded-xl text-left font-inter hover:text-orange-500 hover:bg-white border border-white hover:border-orange-500 duration-500"
            onClick={() => {
              navigate("/partner/register");
            }}
          >
            Register Now
          </button>
        </div>
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
          <img
            src="/images/list1.png"
            alt="Feature"
            className="w-full h-auto rounded"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4 items-center justify-center">
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
              <img
                src="/images/list2.png"
                alt="Feature"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 space-y-16">
              <h3 className="text-5xl font-bold text-orange-500 my-4">
                Untapped Revenue Opportunities in Hospitality
              </h3>
              <ul className="mt-4 text-lg list-disc list-inside ml-6 space-y-2 text-[#02596c]">
                <li>Underutilized amenities during off-peak hours</li>
                <li>Missed chances to attract local customers</li>
                <li>Difficulty in managing non-room assets</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Streams Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4 items-center">
            <div className="w-full md:w-1/2 p-8 space-y-16">
              <h3 className="text-5xl font-bold text-orange-500">
                Your Gateway to Maximizing Property Revenue
              </h3>
              <ul className="mt-4 text-lg list-disc list-inside ml-6 space-y-2 text-[#02596c]">
                <li>Make the most of existing amenities</li>
                <li>20% increase in annual ancillary revenue</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <img
                src="/images/list3.png"
                alt="Revenue Streams"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4 items-center">
            <div className="w-full md:w-1/2 px-4">
              <img
                src="/images/Leftside.png"
                alt="Revenue Streams"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 space-y-16">
              <h3 className="text-5xl font-bold text-orange-500">
                Generate New Revenue Streams
              </h3>
              <ul className="mt-4 text-lg list-disc list-inside ml-6 space-y-2 text-[#02596c]">
                <li>Make the most of existing amenities</li>
                <li>20% increase in annual ancillary revenue</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Customer Base Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4 items-center">
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0 space-y-16">
              <h3 className="text-5xl font-bold text-orange-500 text-center mb-8">
                Expanded Customer Base
              </h3>
              <ul className="mt-4 text-lg list-disc list-inside ml-6 space-y-2 text-[#02596c]">
                <li>Attract local and visiting day guests</li>
                <li>Convert day guests into future overnight stays</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <img
                src="/images/rightside1.png"
                alt="Expanded Customer Base"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Easy-to-Use Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4 items-center">
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
              <img
                src="/images/Leftside1.png"
                alt="Tools"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="w-full md:w-1/2 px-4 space-y-16">
              <h3 className="text-5xl font-bold text-orange-500">
                Easy-to-Use Tools
              </h3>
              <ul className="mt-4 text-lg list-disc list-inside ml-6 space-y-2 text-[#02596c]">
                <li>User-friendly platform accessible on multiple devices</li>
                <li>Real-time inventory and pricing management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Support Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4 items-center">
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0 space-y-16">
              <h3 className="text-5xl font-bold text-orange-500 text-center mb-8">
                Dedicated Support
              </h3>
              <ul className="mt-4 text-lg list-disc list-inside ml-6 space-y-2 text-[#02596c]">
                <li>Account management team</li>
                <li>24/7 customer support for day guests</li>
                <li>On-demand resources</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <img
                src="/images/rightside2.png"
                alt="Support"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">How It Works</h3>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/4 px-4 mb-8">
              <img
                src="/path-to-image.jpg"
                alt="Step 1"
                className="w-full h-auto rounded"
              />
              <p className="mt-4">Step 1: Description</p>
            </div>
            <div className="w-full md:w-1/4 px-4 mb-8">
              <img
                src="/path-to-image.jpg"
                alt="Step 2"
                className="w-full h-auto rounded"
              />
              <p className="mt-4">Step 2: Description</p>
            </div>
            <div className="w-full md:w-1/4 px-4 mb-8">
              <img
                src="/path-to-image.jpg"
                alt="Step 3"
                className="w-full h-auto rounded"
              />
              <p className="mt-4">Step 3: Description</p>
            </div>
            <div className="w-full md:w-1/4 px-4 mb-8">
              <img
                src="/path-to-image.jpg"
                alt="Step 4"
                className="w-full h-auto rounded"
              />
              <p className="mt-4">Step 4: Description</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Join Section */}
      <section className="py-20">
        <div className="flex flex-col items-center justify-center bg-white text-center p-4">
          <h1 className="text-5xl font-bold text-orange-600">
            Join DayBreakPass
          </h1>
          <h2 className="text-2xl font-semibold text-[#02596c] mt-4">
            Boost Your Revenue Beyond the Hotel Room
          </h2>
          <div className="mt-6">
            <p className="text-lg text-[#02596c]">
              • All-in-one marketing and technology solution
            </p>
            <p className="text-lg text-[#02596c]">
              • Generate lakhs of rupees in new revenue annually
            </p>
          </div>
          <button
            className="mt-8 px-6 py-3 bg-orange-500 text-white uppercase rounded-xl text-left font-inter hover:text-orange-500 hover:bg-white border border-white hover:border-orange-500 duration-500 shadow-lg shadow-black"
            onClick={() => {
              navigate("/partner/register");
            }}
          >
            JOIN US
          </button>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DayBreakPass</p>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
};

export default ListMyPage;
