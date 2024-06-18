import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-footerColor mt-8">
      <div className="container mx-auto px-4 pt-10 flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-6 w-full">
          <div className="flex flex-col items-center md:w-1/3 text-center">
            <span className="text-3xl text-white font-bold tracking-tight mb-4">
              DayBreakPass
            </span>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 mb-2">Connect with us</span>
              <div className="flex gap-4">
                <a href="https://www.facebook.com" target="_blank">
                  <FaFacebook className="w-8 h-8" fill="white" />
                </a>

                <a
                  href="https://www.instagram.com/daybreakpass/"
                  target="_blank"
                >
                  <FaInstagram className="w-8 h-8" fill="white" />
                </a>
                <a href="https://www.linkedin.com" target="_blank">
                  <FaLinkedinIn className="w-8 h-8" fill="white" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between w-full md:w-2/3 gap-6 text-center md:text-left">
            <div className="flex flex-col w-full md:w-1/3">
              <span className="text-[#81817F] font-bold text-lg mb-2">
                COMPANY
              </span>
              <Link to="/about-us" className="text-white font-medium mb-1">
                About Us
              </Link>
              <Link to="/support" className="text-white font-medium mb-1">
                Support
              </Link>
              <Link
                to="/privacy-and-policy"
                className="text-white font-medium mb-1"
              >
                Privacy & Policy
              </Link>
              <Link
                to="/terms-and-condition"
                className="text-white font-medium mb-1"
              >
                Terms & Conditions
              </Link>
              <Link to="/cookie-policy" className="text-white font-medium mb-1">
                Cookie Policy
              </Link>
            </div>
            <div className="flex flex-col w-full md:w-1/3">
              <span className="text-[#81817F] font-bold text-lg mb-2">
                GUESTS
              </span>
              {/* <Link to='/login' className="text-white font-medium mb-1">Sign in</Link>
              <Link to='/register' className="text-white font-medium mb-1">Sign up</Link> */}
              <Link to='waitlist' className="text-white font-medium mb-1">Join Waitlist</Link>
              <span className="text-white font-medium mb-1">Help</span>
            </div>
            <div className="flex flex-col w-full md:w-1/3">
              <span className="text-[#81817F] font-bold text-lg mb-2">
                HOTELS
              </span>
              <Link
                to="/partner/register"
                className="text-white font-medium mb-1"
              >
                Become Hotel Partner
              </Link>
              <Link to="/support" className="text-white font-medium mb-1">
                Support
              </Link>
            </div>
          </div>
        </div>
        <hr className="border-gray-500 my-3 w-full" />
        <div className="flex justify-center items-center pb-3">
          <span className="text-white">2024 © DayBreakPass</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
