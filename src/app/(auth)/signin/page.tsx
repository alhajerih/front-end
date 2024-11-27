import AuthForm from "@/components/AuthForm";
import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-center h-full">
        <div className="flex md:flex-row w-screen h-full bg-[linear-gradient(90deg,_rgba(3,3,85,1)_5%,_rgba(3,3,85,1)_74%,_rgba(40,63,107,1)_100%)]">
          {/* Left Section with Image */}
          <div className="relative w-full overflow-hidden group hidden md:block">
            <Image
              src={"/registerImage.png"}
              layout="fill" // Enables the image to fill the parent div
              objectFit="cover" // Ensures the image covers the div while keeping its aspect ratio
              alt="Image for Innovate today for the future"
              className="transition-transform duration-300 ease-in-out transform group-hover:scale-105"
            />
          </div>

          {/* Right Section with AuthForm */}
          <div className="w-screen md:w-2/5 bg-grey-200 p-10 md:p-28 md:pr-98 md:pl-90 flex items-center justify-center">
            <AuthForm type="signin" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
