import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-footerColor mt-14">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row bg-footerColor py-10 justify-between container mx-auto">
          <div className="flex  flex-col w-1/3">
            <span className="text-3xl text-white font-bold tracking-tight mb-4">
              DayBreak
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-gray-400">Connect with us</span>
              <div className="flex gap-4 cursor-pointer">
                <FaFacebook className="w-8 h-8" fill="white" />
                <FaInstagram className="w-8 h-8" fill="white" />
                <FaLinkedinIn className="w-8 h-8" fill="white" />
              </div>
            </div>
          </div>
          <div className="flex justify-between w-1/2 gap-6">
            <div className="flex flex-col w-2/3 ">
              <span className="text-gray-400 font-bold text-lg">COMPANY</span>
              <span className="text-white text-nowrap font-medium">
                About Us
              </span>
              <span className="text-white text-nowrap font-medium">
                Support
              </span>
              <span className="text-white text-nowrap font-medium">
                Privacy & Policy
              </span>
              <span className="text-white text-nowrap font-medium">
                Terms & Conditions
              </span>
            </div>
            <div className="flex flex-col w-1/3">
              <span className="text-gray-400 font-bold text-lg">GUESTS</span>
              <span className="text-white text-nowrap font-medium">
                Sign in
              </span>
              <span className="text-white text-nowrap font-medium">
                Sign up
              </span>
              <span className="text-white text-nowrap font-medium">Help</span>
            </div>
            <div className="flex flex-col w-1/3">
              <span className="text-gray-400 font-bold text-lg">HOTELS</span>
              <span className="text-white font-medium">
                Become Hotel Partner
              </span>
              <span className="text-white text-nowrap font-medium">
                Support
              </span>
            </div>
          </div>
        </div>
        <hr className="border-gray-500 my-2" />
        <div className="flex justify-center items-center">
          <span className="text-gray-400">2024 © Daybreak</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
