import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { getBrandName, BRAND_CONFIG } from "@/config/brand";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Danios | Premium Fashion from Nepal",
  description: "Learn about Shreya Ghimire, founder of Danios, and our mission to create premium streetwear in Nepal.",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb title={`About ${getBrandName()}`} pages={["about"]} />
      
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-danios-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-danios-black mb-6">
              Crafting Stories Through Fashion
            </h1>
            <p className="text-xl text-brand-text-light max-w-3xl mx-auto leading-relaxed">
              Born in the heart of {BRAND_CONFIG.country}, {getBrandName()} represents more than just clothing—it&apos;s a movement
              towards sustainable, premium fashion that celebrates our heritage while embracing modernity.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-danios-accent font-medium text-sm uppercase tracking-wider mb-4 block">
                Our Founder
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-danios-black mb-6">
                Meet Shreya Ghimire
              </h2>
              <div className="space-y-6 text-danios-text-light leading-relaxed">
                <p>
                  Shreya Ghimire founded Danios with a simple yet powerful vision: to create premium 
                  streetwear that tells the story of Nepal&apos;s rich textile heritage while meeting the 
                  demands of contemporary fashion.
                </p>
                <p>
                  Growing up surrounded by Nepal&apos;s vibrant textile traditions, Shreya witnessed 
                  firsthand the incredible craftsmanship of local artisans. After studying fashion 
                  design and working with international brands, she returned to Nepal with a mission 
                  to bridge the gap between traditional craftsmanship and modern design.
                </p>
                <p>
                  &ldquo;Fashion should be more than just clothing—it should be a statement of values, 
                  quality, and respect for the hands that create it,&rdquo; says Shreya. This philosophy 
                  drives every decision at Danios, from sourcing premium materials to ensuring fair 
                  wages for our artisans.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Placeholder for founder image */}
                <div className="aspect-[4/5] bg-gradient-to-br from-danios-neutral via-danios-neutral-2 to-danios-neutral-3 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-danios-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">SG</span>
                    </div>
                    <p className="text-danios-text-muted">Shreya Ghimire</p>
                    <p className="text-danios-text-muted text-sm">Founder & Creative Director</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-danios-accent"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-danios-accent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 lg:py-24 bg-danios-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-danios-black mb-6">
              Our Mission & Values
            </h2>
            <p className="text-xl text-danios-text-light max-w-3xl mx-auto">
              Every piece we create is guided by our core principles of quality, sustainability, and respect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-danios-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-danios-black mb-4">Premium Quality</h3>
              <p className="text-danios-text-light">
                We use only the finest materials and work with skilled artisans to ensure every piece meets our exacting standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-danios-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-danios-black mb-4">Sustainable Practice</h3>
              <p className="text-danios-text-light">
                From eco-friendly materials to ethical production, we&apos;re committed to fashion that doesn&apos;t compromise our planet.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-danios-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-danios-black mb-4">Community First</h3>
              <p className="text-danios-text-light">
                We believe in fair wages, safe working conditions, and supporting the communities that make our vision possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-danios-black mb-8">
              The Danios Story
            </h2>
            <div className="space-y-6 text-danios-text-light leading-relaxed text-lg">
              <p>
                Danios began in 2023 as a dream to showcase Nepal&apos;s incredible textile heritage 
                to the world. What started as a small collection of premium t-shirts has grown into 
                a full lifestyle brand that represents the best of Nepalese craftsmanship.
              </p>
              <p>
                Our name &ldquo;Danios&rdquo; reflects our commitment to diversity and adaptability—just like 
                the resilient fish species, we believe in thriving in any environment while staying 
                true to our roots. Every piece in our collection tells a story of tradition meeting 
                innovation.
              </p>
              <p>
                Today, Danios is proud to work with over 50 local artisans across Nepal, creating 
                employment opportunities while preserving traditional techniques. We&apos;re not just 
                making clothes—we&apos;re building a sustainable future for Nepalese fashion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-danios-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join the Danios Movement
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of a fashion revolution that values quality, sustainability, and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop-with-sidebar"
              className="bg-white text-danios-black px-8 py-4 font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Shop Collection
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-danios-black transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
