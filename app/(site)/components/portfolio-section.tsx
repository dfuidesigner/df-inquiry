"use client"

import * as React from "react"
import Image from "next/image"
// Import the autoplay plugin
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Your specific projects
const projects = [
  {
    id: 1,
    title: "Wild Wisdom",
    type: "(Interactive Nature Quiz)",
    tags: ["B2C", "Web Application"],
    image: "/images/OnlineProject/FullLargeSizeProject/wildwisdom.png",
    link: "#",
  },
  {
    id: 3,
    title: "Harmonia",
    type: "(Psychotherapy Platform)",
    tags: ["Healthcare", "SaaS"],
    image: "/images/OnlineProject/FullLargeSizeProject/harmonia.png",
    link: "#",
  },
  {
    id: 4,
    title: "RewardsApp",
    type: "(SaaS Corporate Gifting)",
    tags: ["B2B", "SaaS Platform"],
    image: "/images/OnlineProject/FullLargeSizeProject/rewardsap.png",
    link: "#",
  },
  {
    id: 5,
    title: "Gaur City Mall",
    type: "(Commercial Mall Website)",
    tags: ["B2C", "Web Application"],
    image: "/images/OnlineProject/FullLargeSizeProject/gaurcity.png",
    link: "#",
  },
  {
    id: 6,
    title: "Sehgal Neo Hospital",
    type: "(Healthcare & Hospital Website)",
    tags: ["Healthcare", "Web Application"],
    image: "/images/OnlineProject/FullLargeSizeProject/shegal.png",
    link: "#",
  },
]

export default function ProjectCarouselSection() {
  const [plugin] = React.useState(() =>
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <section className="py-20 font-sans" id="portfolio">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-center text-center">
          <div>
            <h2 className="font-gra text-3xl font-bold tracking-tight sm:text-4xl">
              Real Products We’ve <span className="text-[#080C5E]"> Built</span>
            </h2>
            <p className="mt-2 text-gray-500">
              Explore platforms and applications delivered through our scalable
              web app development service and enterprise-ready software
              expertise.
            </p>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin]}
          onMouseEnter={plugin.stop}
          onMouseLeave={plugin.reset}
          className="w-full"
        >
          <CarouselContent className="-ml-4 sm:-ml-6">
            {projects.map((project) => (
              <CarouselItem
                key={project.id}
                className="pl-4 sm:basis-1/2 sm:pl-6 lg:basis-1/3"
              >
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                  </div>

                  <div className="flex grow flex-col bg-[#080C5E] p-6 font-gra">
                    <div className="mb-4">
                      <h3 className="text-[25px] font-semibold tracking-tight text-white">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 text-[14px] text-white">
                        {project.type}
                      </p>
                    </div>

                    <div className="mb-0 flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-[12px] font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Controls positioned at the bottom right */}
          <div className="mt-8 flex justify-end gap-4">
            <CarouselPrevious className="static translate-y-0 border-gray-200 bg-white text-[#080C5E] hover:bg-gray-50 hover:text-[#0091DA]" />
            <CarouselNext className="static translate-y-0 border-gray-200 bg-white text-[#080C5E] hover:bg-gray-50 hover:text-[#0091DA]" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
