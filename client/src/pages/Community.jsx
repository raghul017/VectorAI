import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return !loading ? (
    <div className="h-full overflow-y-scroll bg-[#0A0A0F]">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Community Gallery
          </h1>
          <p className="text-gray-400">
            Explore and like amazing AI-generated images from our community
          </p>
        </div>

        {creations.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center animate-scaleIn">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center animate-float">
              <Heart className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No creations yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Be the first to share your AI-generated images with the community!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {creations.map((creation, index) => {
              const animationDelay = `animation-delay-${Math.min(
                (index % 6) * 100,
                500
              )}`;
              return (
                <div
                  key={index}
                  className={`relative group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transform hover:scale-105 animate-scaleIn ${animationDelay}`}
                >
                  <img
                    src={creation.content}
                    alt={creation.prompt}
                    className="w-full aspect-square object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-sm font-medium mb-2 line-clamp-2">
                      {creation.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300 text-xs">
                        by {creation.user_name || user.fullName}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-semibold">
                          {creation.likes.length}
                        </span>
                        <Heart
                          onClick={() => imageLikeToggle(creation.id)}
                          className={`w-5 h-5 hover:scale-110 cursor-pointer transition-transform ${
                            creation.likes.includes(user.id)
                              ? "fill-red-500 text-red-500"
                              : "text-white hover:text-red-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="h-full flex items-center justify-center bg-[#0A0A0F]">
      <div className="flex flex-col items-center gap-4 animate-fadeIn">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        <p className="text-gray-400 font-medium">Loading creations...</p>
      </div>
    </div>
  );
};

export default Community;
