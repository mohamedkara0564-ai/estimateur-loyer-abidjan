import { useState } from "react";

const QUARTIERS = [
  "Plateau", "Cocody", "Marcory", "Treichville",
  "Bingerville", "Koumassi", "Port-Bouët",
  "Yopougon", "Adjamé", "Abobo",
];

const TYPES = ["studio", "appartement", "maison", "villa"];

const initialForm = {
  surface: "",
  nb_chambres: "",
  nb_salons: "",
  nb_salles_de_bains: "",
  quartier: "",
  type: "",
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultat(null);
    setErreur(null);

    try {
      const payload = {
        surface: parseInt(form.surface),
        nb_chambres: parseInt(form.nb_chambres),
        nb_salons: parseInt(form.nb_salons),
        nb_salles_de_bains: parseInt(form.nb_salles_de_bains),
        quartier: form.quartier,
        type: form.type,
      };

      const response = await fetch("https://estimateur-loyer-abidjan.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur serveur");

      const data = await response.json();
      setResultat(data);
    } catch (err) {
      setErreur("Impossible de contacter l'API. Vérifiez que le backend est lancé.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResultat(null);
    setErreur(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-700">🏠 Estimateur de loyer</h1>
          <p className="text-gray-500 mt-1">Abidjan — Côte d'Ivoire</p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
        >
          {/* Type de bien */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de bien
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">-- Sélectionner --</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Quartier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quartier
            </label>
            <select
              name="quartier"
              value={form.quartier}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">-- Sélectionner --</option>
              {QUARTIERS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Surface */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface (m²)
            </label>
            <input
              type="number"
              name="surface"
              value={form.surface}
              onChange={handleChange}
              required
              min="10"
              max="500"
              placeholder="Ex : 75"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Ligne : chambres + salons */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chambres
              </label>
              <input
                type="number"
                name="nb_chambres"
                value={form.nb_chambres}
                onChange={handleChange}
                required
                min="0"
                max="6"
                placeholder="Ex : 2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salons
              </label>
              <input
                type="number"
                name="nb_salons"
                value={form.nb_salons}
                onChange={handleChange}
                required
                min="1"
                max="2"
                placeholder="Ex : 1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Salles de bain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salles de bain
            </label>
            <input
              type="number"
              name="nb_salles_de_bains"
              value={form.nb_salles_de_bains}
              onChange={handleChange}
              required
              min="1"
              max="6"
              placeholder="Ex : 1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Calcul en cours..." : "Estimer le loyer"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition"
            >
              Réinitialiser
            </button>
          </div>
        </form>

        {/* Résultat */}
        {resultat && (
          <div className="mt-6 bg-orange-600 text-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-sm uppercase tracking-wide opacity-80">Loyer estimé</p>
            <p className="text-4xl font-bold mt-1">{resultat.prix_formate}</p>
            <p className="text-sm opacity-70 mt-1">par mois</p>
          </div>
        )}

        {/* Erreur */}
        {erreur && (
          <div className="mt-6 bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 text-center">
            {erreur}
          </div>
        )}

      </div>
    </div>
  );
}
