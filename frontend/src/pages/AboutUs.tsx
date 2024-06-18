import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import aboutImage from "../assets/images/about.jpg";

const About = () => {
  return (
    <div className="">
      <Header />
      {/* Welcome Section */}
      <div className="bg-center bg-cover mt-16">
        <div className="container mx-auto mt-2 px-8 sm:px-6 lg:px-8">
          <section className="text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-goldColor">
              Welcome Today
            </h2>
            <p className="text-lg lg:text-2xl max-w-4xl mx-auto">
              We believe every day should be filled with joy, embraced fully,
              and lived freely with a playful spirit.
            </p>
          </section>

          {/* What Do We Provide Section */}
          <section className="mt-14 lg:mt-20">
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-center text-goldColor">
              What Do We Provide?
            </h2>

            <div className="flex flex-col lg:flex-row gap-2 py-0 lg:py-4 mt-0 lg:mt-10 ">
              <div className="w-full lg:w-1/2 order-1 lg:order-none">
                <img
                  src={aboutImage}
                  alt="Welcome"
                  className="w-full object-contain"
                />
              </div>
              <div className="w-full lg:w-1/2 lg:pl-8 order-2 mt-4 lg:mt-0 lg:order-none">
                <p className="text-md md:text-lg mb-6">
                  Your next vacation can be just for the day. DayBreakPass
                  unlocks exclusive day access to the world’s best hotels.
                  Experience luxury amenities like pools, spas, and more without
                  having to stay overnight.
                </p>
                <p className="text-md md:text-lg mb-6">
                  At DayBreak we have curated a network of beautiful, on-demand
                  hotel amenities that you can reserve and unlock via our
                  website. Our goal is to provide you with the feeling of
                  instant vacation, realized through a social and relaxing day
                  experience at an amazing partner property.
                </p>
                <p className="text-md md:text-lg mb-6">
                  Simply choose a location, purchase your pass and enjoy our
                  amazing hotels.
                </p>
              </div>
            </div>
          </section>

          {/* Who Are We Section */}
          <section className="py-4 mt-14 lg:mt-20">
            <h2 className="text-2xl lg:text-4xl font-bold mb-10 text-center text-goldColor">
              Who Are We?
            </h2>
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-8 justify-center items-center gap-10 lg:gap-20">
              <div className="flex flex-col w-[10rem] text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Vitthal Kushe"
                  className="rounded-full mb-2"
                />
                <h3 className="text-xl font-bold">Vitthal Kushe</h3>
                <p className="text-gray-700">Founder</p>
              </div>
              <div className="w-[full] md:w-1/2">
                <p className="text-lg mb-6 text-center md:text-left">
                  We are seasoned entrepreneurs with extensive technology
                  experience, having worked with various tech companies and real
                  estate ventures. Our mission is to drive new revenue streams
                  for luxury resorts and wellness retreats through DayBreakPass.
                </p>
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="flex flex-col py-4 rounded-3xl gap-4 justify-center items-center mt-14 lg:mt-20">
            <div className="flex flex-col">
              <span className="flex text-2xl lg:text-4xl md:text-4xl mb-4 font-bold font-LuzuryF1 text-center justify-center text-goldColor">
                Trusted by the Best Luxury Hotels
              </span>
              <span className="text-center max-w-xl mx-auto mb-8 md:mb-12 text-sm md:text-lg">
                Join the world's top hotel brands using Daycation to increase
                their bottom line revenue.
              </span>
            </div>
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
              <div className="relative col-span-1 p-2">
                <img
                  className="w-[10rem] rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
                  alt="Taj Hotel"
                />
              </div>
              <div className="relative col-span-1 p-2">
                <img
                  className="w-[10rem] rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
                  alt="Taj Hotel"
                />
              </div>
              <div className="relative col-span-1 p-2">
                <img
                  className="w-[10rem] rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
                  alt="Taj Hotel"
                />
              </div>
              <div className="relative col-span-1 p-2">
                <img
                  className="w-[10rem] rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
                  alt="Taj Hotel"
                />
              </div>
            </div> */}
            <div className="flex flex-col justify-center items-center mt-10 text-center">
              <span>Want to Bring Daycation to Your Hotel? </span>
              <Link
                to="/partner/register"
                className="font-LuzuryF3 text-goldColor hover:underline underline-goldColor text-2xl"
              >
                Become a Hotel Partner{" "}
              </Link>
            </div>
          </section>

          {/* How Do We Operate Section */}
          <section className="py-4 mt-14 lg:mt-20">
            <h2 className="text-2xl lg:text-4xl font-bold mb-5 text-center text-goldColor">
              How Do We Operate?
            </h2>
            <p className="text-lg mb-6 text-center w-full lg:w-2/3 mx-auto">
              We are a completely bootstrapped company working closely with
              luxury hotels. By understanding their challenges, we help them
              grow their business by selling day passes, resulting in an
              approximate 20% annual revenue growth.
            </p>
          </section>

          {/* Investor Section */}
          <section className="mt-10 lg:mt-20 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold mb-10 text-darkGold">
              Like Our Idea?{" "}
              <span className="text-goldColor">Want to Help Us Grow?</span>
            </h2>
            <p className="text-lg mb-10">
              Become an investor.
              <br />
              Drop us an email at:{" "}
              <a
                href="mailto:team@daybreakpass.com"
                className="text-goldColor underline"
              >
                team@daybreakpass.com
              </a>
            </p>
          </section>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
