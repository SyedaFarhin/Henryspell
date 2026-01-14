import React,{useState} from 'react'
import SimpleCarousel from '../components/SimpleCarousel';
export default function Home(){
    const [serviceType, setServiceType] = useState("online");
  const onlineServices = [
{
name: "Tarot Reading",
options: ["15 minutes", "30 minutes", "60 minutes", "90 minutes"],
},
{
name: "Spell Work",
options: ["One-day working", "Three-day working", "Seven-day working"],
},
];


const inPersonServices = [
{
name: "Sound Healing",
options: ["45-minute session"],
comingSoon: true,
},
{
name: "Energetic Alignment Massage",
options: [
"60-minute session",
"60-minute session + 30-minute sound healing",
],
comingSoon: true,
},
];
    const items = [
  {
    title: "Cleansing &\nCurse Breaking",
    image: "/tarotReadings.png",
  },
  {
    title: "Spell work – online only",
    image: "/spellWork.png",
  },
  {
    title: "Sound healing – in person only",
    image: "/sound.webp",
  },
  {
    title: "Energetic alignment massage – in person only",
    image: "/energitic.png",
  },
];
  return (
   <div>
      <SimpleCarousel />
      
      {/* INTRO TEXT */}
       <section className="w-full bg-white flex justify-center">
      <div className="max-w-6xl px-6 py-20 text-center text-gray-900 font-serif">

        <h1 className="text-4xl font-medium mb-6">
          Welcome, I’m Henry.
        </h1>

        <p className="max-w-4xl mx-auto text-sm leading-relaxed mb-6">
         I grew up immersed in a wide range of spiritual traditions, from the wisdom of Hinduism and
Buddhism to meditation, herbal practices, and working with elemental and subtle natural energies.
Alongside this, my upbringing also included a strong influence of science, questioning, and
skepticism from my father’s side. I believe this balance has shaped the way I work today; grounded,
discerning, and deeply respectful of both the seen and unseen.
        </p>

        <p className="max-w-4xl mx-auto text-sm leading-relaxed mb-12">
         Over the years, I’ve taken these foundations and built my own path as a practicing witch through
lived experience, dedication, and ongoing inner work. My journey has taken me overseas, where
I’ve learned from shamans in Peru, Colombia, Indonesia, and Australia, studying plant medicines,
healing techniques, and ways of connecting with the spirits and energies of different lands.
These experiences have profoundly shaped how I support others.
        </p>

        <button className="border border-gray-900 px-6 py-2 text-xs uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors">
          Read More
        </button>

      </div>
    </section>

     


    

<section style={{ backgroundColor: '#fbefef' }} className="py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Image */}
        <div className="flex justify-center">
          <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden">
            <img
              src="/man.jpg"   // place image in public folder
              alt="Beautiful woman"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            How I work
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
            My work is intuitive, grounded, and responsive to the individual. Whatever the session looks like on
the surface, everything begins with tuning in; to you, your energy, and what’s present for you in that
moment.I channel as I work. Information may come through as clear knowing, images, sensations, or words,
and I pay attention to how different layers of your energy and body respond. This helps me
understand where attention is needed and how best to support you.
          </p>

          <button className="border border-gray-900 px-6 py-2 text-xs uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors">
          Read More
        </button>

          {/* Decorative Stars */}
          <div className="absolute -right-6 top-10 hidden md:block text-[#e7b7ad] text-3xl">
            ✦ ✦
          </div>
        </div>

      </div>
    </section>


<div className="w-full bg-white px-6 py-16">
      {/* Title */}
      <h2 className="text-center text-4xl font-serif mb-12">
        Services
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative h-[320px] overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center">
              <p className="text-white text-2xl md:text-3xl font-serif leading-snug whitespace-pre-line px-4">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>



  <div className="min-h-screen bg-neutral-100 p-6">
<div className="max-w-5xl mx-auto">
<h1 className="text-3xl font-semibold text-center mb-2">
Book a Session
</h1>
<p className="text-center text-sm text-neutral-600 mb-8">
Available Friday to Tuesday · 8:00 a.m. – 3:00 p.m.
</p>


{/* Toggle */}
<div className="flex justify-center mb-10">
<button
onClick={() => setServiceType("online")}
className={`px-6 py-2 rounded-l-full border ${
serviceType === "online"
? "bg-black text-white"
: "bg-white text-black"
}`}
>
Online Services
</button>
<button
onClick={() => setServiceType("inperson")}
className={`px-6 py-2 rounded-r-full border ${
serviceType === "inperson"
? "bg-black text-white"
: "bg-white text-black"
}`}
>
In-Person Services
</button>
</div>



<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{(serviceType === "online" ? onlineServices : inPersonServices).map(
(service, idx) => (
<div
key={idx}
className="bg-white rounded-2xl shadow p-6 flex flex-col"
>
<h2 className="text-xl font-medium mb-4">{service.name}</h2>


<ul className="space-y-3 mb-6">
{service.options.map((opt, i) => (
<li
key={i}
className="flex items-center justify-between border-b pb-2"
>
<span className="text-sm">{opt}</span>
{service.comingSoon ? (
<span className="text-xs text-neutral-400">
Coming Soon
</span>
) : (
<button className="text-sm px-4 py-1 border rounded-full hover:bg-black hover:text-white transition">
Book
</button>
)}
</li>
))}
</ul>


{service.comingSoon && (
<div className="mt-auto text-xs text-neutral-500">
Available from mid-February
</div>
)}
</div>
)
)}
</div>
</div>
</div>
      
     
    </div>
  )
}
