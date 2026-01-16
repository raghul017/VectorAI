import { useRef } from "react";
import { Star } from "lucide-react";
import { motion, useInView } from "framer-motion";

const Testimonial = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Your actual testimonial data
  const testimonials = [
    {
      name: "John Doe",
      title: "Marketing Director, TechCorp",
      content: "ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.",
      rating: 5,
    },
    {
      name: "Jane Smith",
      title: "Content Creator, Digital Agency",
      content: "ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
    {
      name: "David Lee",
      title: "Content Writer, Startup Co.",
      content: "ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
  ];

  return (
    <div
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-20 xl:px-32 bg-black overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
            We're Building the Creative
            <br />
            Layer of the Digital Future
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="px-4 py-2 bg-white text-black text-sm font-medium rounded-full">Creators</span>
            <span className="px-4 py-2 bg-white/[0.05] border border-white/10 text-gray-400 text-sm rounded-full">Businesses</span>
          </div>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-[#0c0c10] rounded-2xl border border-white/[0.05]"
            >
              {/* Content */}
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {Array(5).fill(0).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
