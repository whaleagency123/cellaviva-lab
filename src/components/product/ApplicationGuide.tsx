const steps = [
  {
    n: '01',
    title: 'Wet Your Scalp',
    desc: 'Thoroughly wet hair and scalp with warm water. The warmth opens up the follicles for deeper penetration.',
  },
  {
    n: '02',
    title: 'Apply Stemuvita™ Cleanser',
    desc: 'Dispense a coin-sized amount directly onto the scalp. Gently massage in circular motions for 2–3 minutes.',
  },
  {
    n: '03',
    title: 'Let It Work',
    desc: 'Leave the formula on your scalp for 3–5 minutes to let the plant stem cells deeply nourish the follicles.',
  },
  {
    n: '04',
    title: 'Rinse Thoroughly',
    desc: 'Rinse completely with cool water to seal the follicles and lock in the treatment.',
  },
  {
    n: '05',
    title: 'Apply the Serum',
    desc: 'While hair is still damp, apply 3–4 drops of Stemuvita™ Serum to the scalp. Do not rinse. Style as usual.',
  },
]

export function ApplicationGuide() {
  return (
    <section className="py-16 border-t border-gray-100">
      <h3 className="text-2xl font-black text-[#1b1b1b] mb-8">
        From Scalp Stress to Shine — 5 Simple Steps
      </h3>
      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={step.n} className="flex gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1b4332] flex items-center justify-center">
              <span className="text-white text-sm font-black">{step.n}</span>
            </div>
            <div className="flex-1 pt-2">
              <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="mt-4 ml-[-28px] pl-[28px] border-l-2 border-dashed border-[#d8f3dc] h-4" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
