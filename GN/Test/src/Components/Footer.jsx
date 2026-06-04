import React from 'react'

function Footer() {
 const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full bg-[#1B365D] px-[100px] py-5 max-lg:px-8 max-md:px-4"
    >
      <div className="w-full flex items-center justify-between gap-8 max-md:flex-col max-md:text-center">
        
        {/* ====================================================================== */}
        {/* RIGHTS CONTAINER - Copyright Text */}
        {/* ====================================================================== */}
        <div className="flex-shrink-0">
          <p className="text-[16px] font-medium text-white">
            © {currentYear} SmartGN. All rights reserved.
          </p>
        </div>

        {/* ====================================================================== */}
        {/* CONTACT CONTAINER - Admin Support Information */}
        {/* ====================================================================== */}
        <div className="flex flex-col items-end gap-1 max-md:items-center">
          {/* Admin Support Title */}
          <p className="text-[16px] font-medium text-white">
            Admin Support:
          </p>
          
          {/* Mobile Number */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-gray-300">Mobile:</span>
            <a 
              href="tel:+94255731913"
              className="text-[14px] font-normal text-gray-300 hover:text-white hover:underline transition-all duration-300"
            >
              0255731913
            </a>
          </div>
          
          {/* Email */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-gray-300">Email:</span>
            <a 
              href="mailto:Admin@gmail.com"
              className="text-[14px] font-normal text-gray-300 hover:text-white hover:underline transition-all duration-300"
            >
              warapitiyalakshan@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer