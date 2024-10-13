"use client"

const Navbar = () => {


    return (
        <div>
            <nav
                className={`grid grid-cols-6 w-screen py-5 absolute top-0 left-0 z-30 transition duration-300 border-b-2 border-gray-400
        bg-white/50 backdrop-blur-md shadow-lg`}
            >
                {/* Left part with the logo and "Claude" text */}
                <div className="col-start-2 col-span-2 flex items-center font-stratford">
                    <img
                        src="/images/chat.svg"
                        alt="Claude Icon"
                        className="w-16 h-16 mr-2"
                    />
                    <div className="text-3xl text-black">Chatter G</div>
                </div>

                {/* Right part with the navigation links */}
                <div className="col-start-4 col-span-2 flex justify-end items-center">
                    <ul className="flex space-x-8 text-xl">
                        <li>
                            <a
                                href="/signup"
                                className="block text-center text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition duration-200"
                            >
                                Sign Up
                            </a>
                        </li>
                        <li>
                            <a
                                href="/signin"
                                className="block text-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition duration-200"
                            >
                                Sign In
                            </a>
                        </li>
                        <li>
                            <a
                                href="/guest/home"
                                className="block text-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition duration-200"
                            >
                                Join as Guest
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* RGBGlowCard Alert */}
        </div>
    );
};

export default Navbar;
