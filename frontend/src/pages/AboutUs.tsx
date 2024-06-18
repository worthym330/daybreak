import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import aboutImage from "../assets/images/about.jpg";

const About = () => {
  return (
    <div className="">
      <Header />
      {/* Welcome Section */}
      <div className="bg-center bg-cover">
        <div className="container mx-auto mt-2">
          <section className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-goldColor">
              Welcome Today
            </h2>
            <p className="text-lg mb-6">
              We believe every day should be filled with joy, embraced fully,
              and lived freely with a playful spirit.
            </p>
          </section>

          {/* What Do We Provide Section */}
          <section className="py-4">
          <h2 className="text-4xl font-bold mb-4 text-center">What Do We Provide?</h2>

          <div className="flex flex-col md:flex-row gap-4 py-4">
            <div className="w-full md:w-1/3">
              <p className="text-lg md:text-xl mb-6">
                Your next vacation can be just for the day. DayBreakPass unlocks
                exclusive day access to the world’s best hotels. Experience
                luxury amenities like pools, spas, and more without having to
                stay overnight.
              </p>
            </div>
            <div className="w-full md:w-2/3 h-[350px]">
              <img
                src={aboutImage}
                alt="Welcome"
                className="w-full h-full object-fill"
              />
            </div>
          </div>
          </section>

          {/* Who Are We Section */}
          <section className="py-4">
            <h2 className="text-4xl font-bold mb-4 text-center">Who Are We?</h2>
            <div className="flex flex-col md:flex-row space-x-8">
              <div className="w-full md:w-1/2">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Vitthal Kushe"
                  className="rounded-full mb-2"
                />
                <h3 className="text-xl font-bold">Vitthal Kushe</h3>
                <p className="text-gray-700">Founder</p>
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-lg mb-6">
                  We are seasoned entrepreneurs with extensive technology
                  experience, having worked with various tech companies and real
                  estate ventures. Our mission is to drive new revenue streams
                  for luxury resorts and wellness retreats through DayBreakPass.
                </p>
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="flex flex-col py-4 rounded-3xl gap-4">
            <div className="flex flex-col">
              <span className="flex text-2xl md:text-3xl mb-4 font-bold font-LuzuryF1 text-center justify-center">
                Trusted by the Best Luxury Hotels
              </span>
              {/* <span className="text-center max-w-xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
            Join the world's top hotel brands using Daycation to increase their
            bottom line revenue.
          </span> */}
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
            <div className="flex justify-center">
              <span>
                Want to Bring Daycation to Your Hotel?{" "}
                <Link
                  to="/partner/register"
                  className="font-LuzuryF3 text-goldColor hover:underline underline-goldColor"
                >
                  Become a Hotel Partner{" "}
                </Link>
              </span>
            </div>
          </section>

          {/* How Do We Operate Section */}
          <section className="py-4">
            <h2 className="text-4xl font-bold mb-4">How Do We Operate?</h2>
            <p className="text-lg mb-6">
              We are a completely bootstrapped company working closely with
              luxury hotels. By understanding their challenges, we help them
              grow their business by selling day passes, resulting in an
              approximate 20% annual revenue growth.
            </p>
          </section>

          {/* Investor Section */}
          <section className="py-4">
            <h2 className="text-4xl font-bold mb-4">
              Like Our Idea? Want to Help Us Grow?
            </h2>
            <p className="text-lg mb-6">
              Become an investor.
              <br />
              Drop us an email at:{" "}
              <a
                href="mailto:team@daybreakpass.com"
                className="text-blue-500 underline"
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
