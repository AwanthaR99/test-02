export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-center">Size Guide</h1>
        
        <p className="text-center text-gray-500 mb-12">
           Use these charts to find your perfect fit. Measurements are in inches.
        </p>

        {/* MEN */}
        <div className="mb-12">
          <h2 className="text-xl font-bold uppercase mb-4 border-b border-black pb-2">Men's Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Chest (in)</th>
                  <th className="px-6 py-3">Waist (in)</th>
                  <th className="px-6 py-3">Length (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="px-6 py-4 font-bold">S</td><td className="px-6 py-4">36-38</td><td className="px-6 py-4">28-30</td><td className="px-6 py-4">27</td></tr>
                <tr><td className="px-6 py-4 font-bold">M</td><td className="px-6 py-4">38-40</td><td className="px-6 py-4">30-32</td><td className="px-6 py-4">28</td></tr>
                <tr><td className="px-6 py-4 font-bold">L</td><td className="px-6 py-4">40-42</td><td className="px-6 py-4">32-34</td><td className="px-6 py-4">29</td></tr>
                <tr><td className="px-6 py-4 font-bold">XL</td><td className="px-6 py-4">42-44</td><td className="px-6 py-4">34-36</td><td className="px-6 py-4">30</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* WOMEN */}
        <div>
          <h2 className="text-xl font-bold uppercase mb-4 border-b border-black pb-2">Women's Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Bust (in)</th>
                  <th className="px-6 py-3">Waist (in)</th>
                  <th className="px-6 py-3">Hips (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="px-6 py-4 font-bold">UK 8 (S)</td><td className="px-6 py-4">32-34</td><td className="px-6 py-4">25-26</td><td className="px-6 py-4">35-36</td></tr>
                <tr><td className="px-6 py-4 font-bold">UK 10 (M)</td><td className="px-6 py-4">34-36</td><td className="px-6 py-4">27-28</td><td className="px-6 py-4">37-38</td></tr>
                <tr><td className="px-6 py-4 font-bold">UK 12 (L)</td><td className="px-6 py-4">36-38</td><td className="px-6 py-4">29-30</td><td className="px-6 py-4">39-40</td></tr>
                <tr><td className="px-6 py-4 font-bold">UK 14 (XL)</td><td className="px-6 py-4">38-40</td><td className="px-6 py-4">31-32</td><td className="px-6 py-4">41-42</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}