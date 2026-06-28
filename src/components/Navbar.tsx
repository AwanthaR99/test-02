"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, Heart, LogIn, User, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { client } from "@/lib/sanity"; 
import { urlFor } from "@/../sanity/lib/image";

const NAV_ITEMS = [
  {
    label: "Men",
    value: "men",
    hasMegaMenu: true,
    sections: [
      {
        title: "Casual Wear",
        value: "casual",
        items: [
          { name: "T-Shirts", value: "t-shirt" },
          { name: "Shirts", value: "shirt" },
          { name: "Trousers", value: "trouser" },
          { name: "Denims", value: "jeans" },
          { name: "Shorts", value: "shorts" },
          { name: "Sarongs", value: "sarong" },
        ]
      },
      {
        title: "Formal / Office",
        value: "office",
        items: [
          { name: "Formal Shirts", value: "shirt" },
          { name: "Formal Trousers", value: "trouser" },
        ]
      },
      {
        title: "Inner Wear",
        value: "inner",
        items: [
          { name: "Boxers", value: "innerwear" },
          { name: "Vests", value: "innerwear" },
        ]
      }
    ]
  },
  {
    label: "Women",
    value: "women",
    hasMegaMenu: true,
    sections: [
      {
        title: "Casual Wear",
        value: "casual",
        items: [
          { name: "Frocks", value: "frock" },
          { name: "Tops", value: "top" },
          { name: "T-Shirts", value: "t-shirt" },
          { name: "Skirts", value: "skirt" },
          { name: "Denims", value: "jeans" },
          { name: "Kurtis", value: "kurti" },
        ]
      },
      {
        title: "Formal / Office",
        value: "office",
        items: [
          { name: "Office Sarees", value: "saree" },
          { name: "Formal Tops", value: "top" },
          { name: "Office Skirts", value: "skirt" },
          { name: "Office Trouser", value: "trouser" },
        ]
      },
      {
        title: "Inner Wear",
        value: "inner",
        items: [
          { name: "Lingerie", value: "innerwear" },
        ]
      }
    ]
  },
  {
    label: "Kids",
    value: "kids",
    hasMegaMenu: false,
    items: [
      { name: "Boys Clothing", value: "kids-set" },
      { name: "Girls Clothing", value: "frock" },
    ]
  },
  {
    label: "Accessories",
    value: "accessories",
    hasMegaMenu: false,
    items: [
      { name: "Watches", value: "watch" },
      { name: "Handbags", value: "handbag" },
      { name: "Wallets", value: "wallet" },
      { name: "Perfumes", value: "perfume" },
      { name: "Beauty/Creams", value: "cream" },
    ]
  }
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeOccasion, setActiveOccasion] = useState<string>("casual");

  // Live Search States
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live Search Effect (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const query = `*[_type == "product" && title match "${searchQuery}*"] {
            _id,
            title,
            price,
            "image": images[0],
            slug
          }[0...5]`;
          const data = await client.fetch(query);
          setSearchResults(data);
        } catch (error) {
          console.error("Search Error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click Outside logic for search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname && pathname.startsWith("/studio")) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchResults([]);
    }
  };

  const isHomePage = pathname === "/";
  const navClass = isScrolled || !isHomePage 
    ? "bg-white/90 backdrop-blur-md text-black shadow-sm py-3" 
    : "bg-transparent text-white py-5";
  const textColor = isScrolled || !isHomePage ? "text-black" : "text-white";
  const hoverColor = isScrolled || !isHomePage ? "hover:text-gray-600" : "hover:text-gray-300";

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${navClass}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          <button className={`lg:hidden ${textColor}`} onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className={`text-2xl md:text-3xl font-black tracking-tighter uppercase ${textColor}`}>
            Amila <span className="font-light">Fashion</span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className={`hidden lg:flex items-center gap-8 text-sm font-medium ${textColor}`}>
            <Link href="/shop" className={`${hoverColor} transition relative group`}>Shop All</Link>

            {NAV_ITEMS.map((item) => (
              <div 
                key={item.value} 
                className="relative group h-full flex items-center"
                onMouseEnter={() => item.hasMegaMenu && setActiveOccasion("casual")}
              >
                <Link href={`/shop?category=${item.value}`} className={`${hoverColor} transition flex items-center gap-1 py-4`}>
                  {item.label}
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                </Link>

                {item.hasMegaMenu ? (
                  <div className="absolute top-full -left-4 w-[500px] bg-white text-black shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 flex rounded-md overflow-hidden z-50">
                    <div className="w-44 bg-gray-50 py-3">
                       {item.sections?.map((section) => (
                          <div 
                            key={section.value}
                            className={`px-5 py-2.5 cursor-pointer flex justify-between items-center text-sm transition-colors ${activeOccasion === section.value ? "bg-white font-semibold text-black" : "text-gray-500 hover:text-black hover:bg-gray-100"}`}
                            onMouseEnter={() => setActiveOccasion(section.value)}
                          >
                            <span>{section.title}</span>
                            {activeOccasion === section.value && <ChevronRight className="w-3 h-3 text-black" />}
                          </div>
                       ))}
                    </div>
                    <div className="flex-1 p-5 bg-white">
                       {item.sections?.map((section) => (
                          activeOccasion === section.value && (
                            <div key={section.title} className="animate-fade-in grid grid-cols-1 gap-2">
                               {section.items.map((sub) => (
                                  <Link key={sub.name} href={`/shop?category=${item.value}&occasion=${section.value}&sub=${sub.value}`} className="text-sm text-gray-600 hover:text-black hover:translate-x-1 transition-transform block py-1">
                                      {sub.name}
                                  </Link>
                               ))}
                            </div>
                          )
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-full left-0 w-48 bg-white text-black shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 rounded-md py-2 z-50">
                      {item.items?.map((sub) => (
                        <Link key={sub.value} href={`/shop?category=${item.value}&sub=${sub.value}`} className="block px-5 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors">{sub.name}</Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`flex items-center gap-5 ${textColor}`}>
            <button onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchQuery(""); }} className="hover:opacity-70 transition">
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <Link href="/wishlist" className="hidden sm:block hover:text-red-500 transition hover:scale-110"><Heart className="w-5 h-5" /></Link>
            <Link href="/cart" className="relative group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition" />
              {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{totalItems}</span>}
            </Link>
            {session ? (
              <Link href="/profile" className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 hover:border-black transition shadow-sm">
                 {session.user?.image ? <Image src={session.user.image} alt="Profile" fill className="object-cover" /> : <div className="bg-gray-200 w-full h-full flex items-center justify-center font-bold text-black text-xs">{session.user?.name?.charAt(0)}</div>}
              </Link>
            ) : (
              <button onClick={() => signIn("google")} className="hover:opacity-70 transition flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                 <User className="w-5 h-5" /><span className="hidden xl:inline">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* SEARCH BAR & LIVE RESULTS */}
        {isSearchOpen && (
          <div ref={searchRef} className="absolute top-full left-0 w-full bg-white border-b shadow-2xl p-4 animate-fade-in-down text-black">
            <div className="max-w-3xl mx-auto relative">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Search for products (e.g. Shirts, T-shirts)..." 
                    className="w-full border-none bg-gray-100 px-4 py-3 rounded-lg focus:ring-2 focus:ring-black text-black font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {isSearching && <div className="absolute right-3 top-3"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>}
                </div>
                <button type="submit" className="bg-black text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition">SEARCH</button>
              </form>

              {/* Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[110] animate-fade-in">
                  <div className="p-2">
                    {searchResults.map((product) => (
                      <Link 
                        key={product._id} 
                        href={`/product/${product.slug.current}`}
                        onClick={() => { setIsSearchOpen(false); setSearchResults([]); }}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-100">
                          {product.image && <Image src={urlFor(product.image).url()} alt={product.title} fill className="object-cover" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-black">{product.title}</h4>
                          <p className="text-xs font-semibold text-gray-500">Rs. {product.price?.toLocaleString()}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                  <button onClick={handleSearchSubmit} className="w-full bg-gray-50 p-3 text-center text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black border-t transition-colors">View All Results</button>
                </div>
              )}
              {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-2 p-8 rounded-xl shadow-2xl border border-gray-100 text-center z-[110]">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching products found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[9999] bg-black text-white transition-transform duration-500 overflow-y-auto ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex justify-between items-center border-b border-white/10 sticky top-0 bg-black z-10">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Amila Fashion</h2>
            <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-8 h-8" /></button>
        </div>
        <div className="flex flex-col p-6 gap-6 text-xl font-bold uppercase tracking-widest pb-32">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
            {NAV_ITEMS.map((item) => (
              <div key={item.value} className="border-b border-white/10 pb-4">
                <button onClick={() => setMobileExpanded(mobileExpanded === item.value ? null : item.value)} className="flex justify-between items-center w-full">
                  {item.label}
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpanded === item.value ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === item.value && (
                  <div className="flex flex-col gap-4 mt-4 pl-4 border-l border-white/20 text-sm text-gray-300 animate-fade-in">
                    {item.hasMegaMenu && item.sections ? item.sections.map((section) => (
                        <div key={section.title} className="mb-2">
                            <p className="text-white font-bold mb-2 uppercase text-[11px] opacity-70 tracking-widest bg-white/10 p-1 pl-2 rounded">{section.title}</p>
                            <div className="pl-2 flex flex-col gap-3">
                              {section.items.map(sub => (
                                 <Link key={sub.name} href={`/shop?category=${item.value}&occasion=${section.value}&sub=${sub.value}`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white flex items-center gap-2">- {sub.name}</Link>
                              ))}
                            </div>
                        </div>
                    )) : item.items?.map((sub) => (
                      <Link key={sub.name} href={`/shop?category=${item.value}&sub=${sub.value}`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white block py-1">{sub.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-6 mt-2 flex flex-col gap-4">
               <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2"><Heart className="w-5 h-5" /> Wishlist</Link>
               <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2"><User className="w-5 h-5" /> My Account</Link>
            </div>
            {!session && <button onClick={() => { signIn("google"); setIsMobileMenuOpen(false); }} className="mt-4 flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition"><LogIn className="w-4 h-4" /> Login / Signup</button>}
        </div>
      </div>
    </>
  );
}