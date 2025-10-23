import { assets } from "../assets/assets";

export default function Footer() {
  return (
    <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 pt-16 w-full bg-[#0A0A0F] border-t border-white/5 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between w-full gap-10 border-b border-white/10 pb-10">
        <div className="md:max-w-96">
          <img className="h-9 brightness-200" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm text-gray-400 leading-relaxed">
            Experience the Power of AI with Vector.AI <br /> Transform your
            content creation with our suite of premium AI Tools. Write articles,
            generate images, and enhance your workflow.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-white">Company</h2>
            <ul className="text-sm space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-white mb-5">
              Subscribe to our newsletter
            </h2>
            <div className="text-sm space-y-3 text-gray-400">
              <p>
                The latest news, articles, and resources, sent to your inbox
                weekly.
              </p>
              <div className="flex items-center gap-2 pt-4">
                <input
                  className="border border-white/10 bg-white/5 placeholder-gray-500 text-white
                                    focus:ring-2 ring-purple-500 focus:border-purple-500 outline-none 
                                    w-full max-w-64 h-10 rounded-lg px-3 backdrop-blur-sm"
                  type="email"
                  placeholder="Enter your email"
                />
                <button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 
                                w-28 h-10 text-white rounded-lg cursor-pointer font-semibold
                                transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="relative z-10 pt-6 text-center text-xs md:text-sm pb-6 text-gray-500">
        Copyright 2025 © VectorAI. All Rights Reserved.
      </p>
    </footer>
  );
}
