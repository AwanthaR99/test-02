"use client";

import { useState, useEffect } from "react";
import { client } from "@/lib/sanity";
import { PackagePlus, Save, PlusCircle, Trash2, ImagePlus, Globe } from "lucide-react";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [categories, setCategories] = useState<any[]>([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "", 
    price: "", 
    description: "", 
    categoryId: "", 
    occasion: "", 
    subCategory: "", 
    isSyncedToWeb: false, // 🌟 1. Web Toggle එක සඳහා රාමුවක් හැදුවා
  });

  // 🌟 2. Variant එකක් ඇතුළේ පරණ quantity වෙනුවට sku, inStoreStock, webStock දැම්මා
  const [stock, setStock] = useState([
    { sku: "", color: "Black", size: "M", inStoreStock: 10, webStock: 10 }
  ]);

  // Dynamic Logic Lists
  const accessoriesList = ['cap', 'belt', 'wallet', 'handbag', 'watch', 'sunglasses', 'perfume', 'cream', 'hair-oil'];
  const bottomWearsList = ['trouser', 'jeans', 'shorts', 'skirt'];

  const isAccessory = accessoriesList.includes(formData.subCategory);
  const isBottomWear = bottomWearsList.includes(formData.subCategory);

  const sizeOptions = isBottomWear 
    ? ['26', '28', '30', '32', '34', '36', '38', '40', '42'] 
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  const colorOptions = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Grey', 'Brown', 'Navy', 'Maroon', 'Beige', 'Printed'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await client.fetch(`*[_type == "category"]{_id, title}`);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 🌟 Variant එකක් අලුතින් add කරද්දී වැටෙන default values
  const handleAddVariant = () => setStock([...stock, { sku: "", color: "White", size: "L", inStoreStock: 5, webStock: 5 }]);
  const handleRemoveVariant = (index: number) => setStock(stock.filter((_, i) => i !== index));
  
  const handleVariantChange = (index: number, field: string, value: string | number) => {
    const newStock = [...stock];
    newStock[index] = { ...newStock[index], [field]: value };
    setStock(newStock);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Please select a Main Category!");
      return;
    }
    
    setLoading(true);

    try {
      let uploadedImageIds: string[] = [];

      if (imageFiles.length > 0) {
        setUploadingImage(true);
        
        const uploadPromises = imageFiles.map(async (file) => {
          const imageFormData = new FormData();
          imageFormData.append("image", file);
          const imgRes = await fetch("/api/upload-image", { method: "POST", body: imageFormData });
          return imgRes.json();
        });

        const uploadResults = await Promise.all(uploadPromises);
        setUploadingImage(false);

        uploadedImageIds = uploadResults
          .filter(res => res.success)
          .map(res => res.assetId);

        if (uploadedImageIds.length !== imageFiles.length) {
          alert("⚠️ Some images failed to upload, but proceeding with the successful ones.");
        }
      }

      // Accessory එකක් නම් auto-fill වෙන logic එක අලුත් fields වලට ගැලපුවා
      const finalStock = stock.map(item => 
        isAccessory 
          ? { ...item, color: "N/A", size: "Free Size" } 
          : item
      );

      // 🎯 අලුත් structure එකට අනුව සකස් කරපු Payload එක
      const payload = { 
        ...formData, 
        stock: finalStock, 
        imageIds: uploadedImageIds 
      };

      const res = await fetch("/api/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("🎉 Product Added Successfully!");
        setFormData({ title: "", price: "", description: "", categoryId: "", occasion: "", subCategory: "", isSyncedToWeb: false });
        setStock([{ sku: "", color: "Black", size: "M", inStoreStock: 10, webStock: 10 }]);
        setImageFiles([]);
        setImagePreviews([]);
      } else {
        alert("❌ Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred!");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const occasionList = [
    { title: 'Casual Wear', value: 'casual' }, { title: 'Office Wear', value: 'office' },
    { title: 'Inner Wear', value: 'inner' }, { title: 'Party / Formal', value: 'party' },
  ];

  const subCatList = [
    { title: 'T-Shirt', value: 't-shirt' }, { title: 'Shirt', value: 'shirt' }, { title: 'Top/Blouse', value: 'top' },
    { title: 'Trouser', value: 'trouser' }, { title: 'Denim/Jeans', value: 'jeans' }, { title: 'Shorts', value: 'shorts' },
    { title: 'Leggings', value: 'leggings' }, { title: 'Skirt', value: 'skirt' }, { title: 'Sarong', value: 'sarong' },
    { title: 'Saree', value: 'saree' }, { title: 'Kurti', value: 'kurti' }, { title: 'Frock/Dress', value: 'frock' },
    { title: 'Kids Set', value: 'kids-set' }, { title: 'Innerwear', value: 'innerwear' }, { title: 'Cap/Hat', value: 'cap' },
    { title: 'Belt', value: 'belt' }, { title: 'Wallet', value: 'wallet' }, { title: 'Handbag', value: 'handbag' },
    { title: 'Watch', value: 'watch' }, { title: 'Sunglasses', value: 'sunglasses' }, { title: 'Perfume', value: 'perfume' },
    { title: 'Cream/Lotion', value: 'cream' }, { title: 'Hair Oil', value: 'hair-oil' }
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <PackagePlus size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New Product</h1>
            <p className="text-slate-500 font-medium">Create a new item precisely matching your schema.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Multiple Image Upload UI */}
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[350px] overflow-y-auto">
              <h2 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Product Images</h2>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-200 shadow-sm">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(index)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Upload Button */}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-colors">
                  <ImagePlus size={24} className="text-indigo-400 mb-2" />
                  <span className="text-[10px] font-bold text-indigo-600 text-center px-2">Add Image</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-wider text-sm">Product Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Product Title</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Price (LKR)</label>
                  <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-700" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Main Category</label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700">
                    <option value="">Select a Category...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Occasion</label>
                  <select value={formData.occasion} onChange={(e) => setFormData({...formData, occasion: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700">
                    <option value="">None / Not Applicable</option>
                    {occasionList.map(opt => <option key={opt.value} value={opt.value}>{opt.title}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Sub Category</label>
                  <select value={formData.subCategory} onChange={(e) => setFormData({...formData, subCategory: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700">
                    <option value="">None / Not Applicable</option>
                    {subCatList.map(opt => <option key={opt.value} value={opt.value}>{opt.title}</option>)}
                  </select>
                </div>

                {/* 🌟 3. මෙන්න ලස්සනට ආපු Web Sync Toggle Button එක UI එකට දැම්මා */}
                <div className="md:col-span-2 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="text-indigo-600" size={20} />
                    <div>
                      <p className="text-sm font-black text-slate-800">Show on E-commerce Website?</p>
                      <p className="text-xs font-medium text-slate-500">Enable this to sync this product to the public online store.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isSyncedToWeb} 
                      onChange={(e) => setFormData({...formData, isSyncedToWeb: e.target.checked})} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                </div>
              </div>
            </div>
          </div>

          {/* Stock & Variants */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider text-sm">Real Stock Management</h2>
              <button type="button" onClick={handleAddVariant} className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                <PlusCircle size={16} /> Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {stock.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 items-end gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group">
                  
                  {/* 🌟 A. SKU TAG INPUT */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Variant SKU</label>
                    <input 
                      type="text"
                      required
                      placeholder="AMILA-POL-BLK-M"
                      value={item.sku}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold outline-none focus:border-indigo-500 uppercase"
                    />
                  </div>

                  {/* COLOR INPUT */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Color {!isAccessory && <span className="text-red-500">*</span>}
                    </label>
                    <input 
                      type="text" 
                      list={`color-list-${index}`}
                      required={!isAccessory} 
                      disabled={isAccessory} 
                      placeholder={isAccessory ? "N/A" : "Select Color"}
                      value={isAccessory ? "N/A" : item.color} 
                      onChange={(e) => handleVariantChange(index, "color", e.target.value)} 
                      className={`w-full p-2.5 border rounded-lg text-sm font-bold outline-none transition-colors
                        ${isAccessory ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-slate-200 focus:border-indigo-500'}
                      `}
                    />
                    <datalist id={`color-list-${index}`}>
                      {colorOptions.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>

                  {/* SIZE INPUT */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Size {!isAccessory && <span className="text-red-500">*</span>}
                    </label>
                    <input 
                      type="text" 
                      list={`size-list-${index}`}
                      required={!isAccessory}
                      disabled={isAccessory} 
                      placeholder={isAccessory ? "Free Size" : "Select Size"}
                      value={isAccessory ? "Free Size" : item.size} 
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)} 
                      className={`w-full p-2.5 border rounded-lg text-sm font-bold outline-none transition-colors
                        ${isAccessory ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-slate-200 focus:border-indigo-500'}
                      `}
                    />
                    <datalist id={`size-list-${index}`}>
                      {sizeOptions.map(s => <option key={s} value={s} />)}
                    </datalist>
                  </div>

                  {/* 🌟 B. IN-STORE POS STOCK INPUT */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Store Stock</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={item.inStoreStock} 
                      onChange={(e) => handleVariantChange(index, "inStoreStock", parseInt(e.target.value) || 0)} 
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none text-emerald-700 focus:border-emerald-500" 
                    />
                  </div>

                  {/* 🌟 C. WEB STOCK INPUT & REMOVE BUTTON CONTAINER */}
                  <div className="space-y-1 flex gap-2 items-center">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Web Stock</label>
                      <input 
                        type="number" 
                        min="0" 
                        value={item.webStock} 
                        onChange={(e) => handleVariantChange(index, "webStock", parseInt(e.target.value) || 0)} 
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none text-blue-700 focus:border-blue-500" 
                      />
                    </div>
                    
                    {stock.length > 1 && (
                      <button type="button" onClick={() => handleRemoveVariant(index)} className="h-10 w-10 bg-red-50 text-red-500 flex items-center justify-center rounded-lg hover:bg-red-500 hover:text-white transition-colors shrink-0">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading || uploadingImage} className={`flex items-center gap-2 px-8 py-4 rounded-xl text-white font-black text-lg transition-all shadow-lg ${loading || uploadingImage ? "bg-slate-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30"}`}>
              {uploadingImage ? "Uploading Images..." : loading ? "Saving Product..." : <><Save size={20} /> Publish Product</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}