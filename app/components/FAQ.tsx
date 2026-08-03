'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What time does the tour start?',
    answer: 'For sunrise tours, pickup is typically between 2:00 AM - 3:00 AM depending on your hotel location. We want to ensure you reach the viewpoint before sunrise.'
  },
  {
    question: 'What should I bring?',
    answer: 'We recommend bringing warm clothing (jacket), comfortable shoes, camera, and some cash. For trekking, bring extra water and snacks. We provide flashlights and safety equipment.'
  },
  {
    question: 'Is it suitable for beginners?',
    answer: 'Yes! Our Jeep tour is perfect for all fitness levels. The trekking tour requires moderate fitness, but our experienced guides will adjust the pace to your comfort level.'
  },
  {
    question: 'What if the weather is bad?',
    answer: 'Mount Batur tours operate rain or shine. However, if conditions are deemed unsafe, we will reschedule or offer a full refund. Safety is our top priority.'
  },
  {
    question: 'Do you provide hotel pickup?',
    answer: 'Yes, we offer complimentary hotel pickup from most areas in Bali including Ubud, Sanur, Seminyak, Kuta, and Canggu. Additional charges may apply for distant locations.'
  },
  {
    question: 'How do I book?',
    answer: 'You can book directly through WhatsApp by clicking the "Book Now" button. Our team will confirm availability and provide payment details.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 md:py-32 bg-warm-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-terra-brown mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-lg text-stone-gray">
            Everything you need to know about our Mount Batur adventures
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-bold text-terra-brown text-lg">
                  {faq.question}
                </span>
                <svg 
                  className={`w-6 h-6 text-terra-brown flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
