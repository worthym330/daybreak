import React from 'react'
import { CiMap } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineSupportAgent } from "react-icons/md";


const InfoSection = () => {
  return (
    <div className="flex max-w-7xl mx-auto py-14 gap-14 flex-col pl-3 pr-4 md:max-w-8xl md:flex-row md:px-6">
      <div className="flex items-center">
        <div className="bg-green-400 rounded-full p-2">
        <CiMap className="text-4xl text-white"/>
        </div>
        <div className="flex-col md:ml-4">
          <p className="font-semibold text-base">Discover DayBreak</p>
          <p className="leading-5 text-sm">
            Select a date and explore pool, spa, beach access and more, at 1,000+ top hotels.
          </p>
        </div>
      </div>

      <div className="flex items-center">
      <div className="rounded-full p-2 bg-orange-400">
        <IoCartOutline className="text-4xl text-white" />
        </div>
        <div className="flex-col md:ml-4">
          <p className="font-semibold text-base">Book Confidently</p>
          <p className="leading-5 text-sm">
            After booking, receive check-in instructions, parking details, and all necessary information.
          </p>
        </div>
      </div>

      <div className="flex items-center">
      <div className="rounded-full p-2 bg-blue-400">
        <MdOutlineSupportAgent className="text-4xl text-white"/>
        </div>
        <div className="flex-col md:ml-4">
          <p className="font-semibold text-base">Flexible Support and Cancellation</p>
          <p className="leading-5 text-sm">
            Invite guests or cancel bookings as needed with support on our website or app.
          </p>
        </div>
      </div>
    </div>
  )
}

export default InfoSection
