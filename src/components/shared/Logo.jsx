import React from 'react';
import logo from "../../../public/logo.png"

const Logo = () => {
    return (
        <div className="flex -ms-2.5 items-center p-2">
            <img src={logo} alt="logo" className="w-10 h-10 end-0 items-center" />
            <h3 className="font-bold text-[20px] mt-2 text-white hidden lg:flex">eTuiTionsBd</h3>
        </div>
    );
};

export default Logo;