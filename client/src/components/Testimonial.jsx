import { assets } from "../assets/assets";
import { Quote, Sparkles } from "lucide-react";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "John Doe",
      title: "Marketing Director, TechCorp",
      content:
        "ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Jane Smith",
      title: "Content Creator, Digital Agency",
      content:
        "ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
    {
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "David Lee",
      title: "Content Writer, Startup Co.",
      content:
        "ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
  ];

  return (
    <div className="relative px-4 sm:px-20 xl:px-32 py-32 bg-[#0A0A0F] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 backdrop-blur-sm rounded-full border border-pink-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-semibold text-pink-300 uppercase tracking-wider">
              TESTIMONIAL
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Loved by{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Creators
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our users are saying
            about their experience with our AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {dummyTestimonialData.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 
              hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300
              hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div
                className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 
              rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]"
              >
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6 mt-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < testimonial.rating
                          ? assets.star_icon
                          : assets.star_dull_icon
                      }
                      alt="star"
                      className="w-5 h-5"
                    />
                  ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 text-base leading-relaxed mb-8">
                "{testimonial.content}"
              </p>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  className="w-14 h-14 object-cover rounded-full ring-2 ring-pink-500/30"
                  alt={testimonial.name}
                />
                <div>
                  <h3 className="font-bold text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
