import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-600">Logisoft</h1>
        <a
          href="https://calendly.com/ngouonomartychagly/30min" // ← remplace par ton lien Calendly
          className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition"
        >
          Prendre rendez-vous
        </a>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Automatisez votre entreprise avec des agents IA sur mesure
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Logisoft conçoit vos applications, sites web, outils de gestion et agents
          intelligents qui prennent vos appels, planifient vos rendez-vous et
          exécutent vos tâches répétitives.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="https://calendly.com/ngouonomartychagly/30min"
            className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 shadow-lg"
          >
            Demander une démo gratuite
          </a>
          <a
            href="#services"
            className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-50"
          >
            Nos services
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Ce que nous créons pour vous
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Applications mobiles',
              desc: 'Apps iOS & Android performantes, adaptées à vos besoins métier.',
              icon: '📱',
            },
            {
              title: 'Sites web sur mesure',
              desc: 'Vitrine, e-commerce ou plateforme complexe, nous codons votre présence en ligne.',
              icon: '🌐',
            },
            {
              title: 'Applications web de gestion',
              desc: 'ERP, CRM, tableaux de bord : centralisez et pilotez toute votre activité.',
              icon: '⚙️',
            },
            {
              title: 'Agents IA intelligents',
              desc: 'Automatisez vos appels, vos emails, la prise de rendez-vous et bien plus.',
              icon: '🤖',
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition border border-gray-100"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">
                {service.title}
              </h4>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent IA focus */}
      <section className="bg-indigo-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            L'agent IA qui travaille pour vous 24h/24
          </h3>
          <ul className="text-lg space-y-4 mb-10 max-w-2xl mx-auto text-left list-disc list-inside">
            <li>Répond à vos appels et qualifie vos prospects</li>
            <li>Fixe automatiquement des rendez-vous dans votre agenda</li>
            <li>Automatise les tâches administratives et les relances</li>
            <li>S'intègre à vos outils existants (CRM, email, calendrier)</li>
          </ul>
          <a
            href="https://calendly.com/ngouonomartychagly/30min"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            Voyez-le en action
          </a>
        </div>
      </section>

      {/* Call-to-action final */}
      <section className="py-20 px-4 text-center max-w-3xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Prêt à transformer votre quotidien ?
        </h3>
        <p className="text-gray-600 mb-8">
          Discutons de votre projet. Le premier rendez-vous est gratuit et sans
          engagement.
        </p>
        <a
          href="https://calendly.com/ngouonomartychagly/30min"
          className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 shadow-lg"
        >
          Réserver une démo
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} Logisoft. Tous droits réservés.
      </footer>
    </main>
  );
}