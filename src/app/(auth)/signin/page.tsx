import AuthForm from "@/components/AuthForm";
import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="">
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
          <div className="flex md:flex-row md:h-[59rem] md:w-screen md:flex-rows bg-[linear-gradient(90deg,_rgba(3,3,85,1)_5%,_rgba(3,3,85,1)_74%,_rgba(40,63,107,1)_100%)] ">
            <div className="bg-red-200 relative w-full overflow-hidden group hidden md:block">
              <Image
                src={"/registerImage.png"}
                layout="fill" // Enables the image to fill the parent div
                objectFit="cover" // Ensures the image covers the div while keeping its aspect ratio
                alt="Image for Innovate today for the future"
                className="transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
            </div>

            <div className="w-screen md:w-2/5 bg-grey-200 p-10 md:p-28 md:pr-98 md:pl-90 ">
              <AuthForm type="signin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
