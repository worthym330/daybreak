// import { useAppContext } from "../contexts/AppContext";
// import { useNavigate } from "react-router-dom";

const WaitList = () => {
  //   const { showToast } = useAppContext();
  //   const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="lg:container lg:mx-auto mx-8 py-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">DayBreakPass</h1>
        </div>
        <div className="flex flex-col justify-center items-center min-h-[80vh]">
          <h2 className="mt-2 text-xl font-extrabold">Launching Soon</h2>
          <p className="mt-4 text-6xl hover:ease-in-out duration-300">Join the waitlist !</p>
          <p className="mt-4 text-lg text-center">
            Let’s tick your bucketlist
            <br />
            Get access to luxury hotels, resorts and spa to have your daycation
            with dirty martini and pool parties etc. Stay tuned!
          </p>
          <form className="mt-8 space-y-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 text-black rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 text-black rounded"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-800 rounded text-white hover:bg-gray-600 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WaitList;
