// Master Product Catalog for LUMINA
const PRODUCTS_DATA = [
  {
    id: "lumina-pro-anc",
    name: "Lumina Pro Wireless ANC",
    tagline: "Ultra-pure spatial acoustics with active noise cancellation",
    category: "audio",
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 184,
    badge: "Best Seller",
    image: "assets/images/product-headphones.jpg",
    description: "Engineered with custom 45mm beryllium drivers and adaptive hybrid ANC. Delivers lossless high-resolution wireless streaming with up to 48 hours of battery life on a single charge.",
    features: [
      "Custom 45mm Beryllium Dynamic Drivers",
      "Adaptive Hybrid Active Noise Cancelling",
      "48-hour ultra long battery life",
      "Multipoint Bluetooth 5.4 connectivity",
      "Aerospace-grade aluminum & memory foam earcups"
    ],
    inStock: true
  },
  {
    id: "lumina-apex-watch",
    name: "Lumina Chrono Apex Titanium",
    tagline: "Biometric intelligence encased in grade 5 titanium",
    category: "wearables",
    price: 499,
    originalPrice: 549,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Flagship",
    image: "assets/images/product-smartwatch.jpg",
    description: "Sleek aerodynamic titanium construction featuring a sapphire crystal curved AMOLED display. Advanced multi-spectrum optical heart rate, ECG, blood oxygen, and sleep architecture tracking.",
    features: [
      "Grade 5 Titanium case with sapphire glass",
      "Always-on 1.5\" curved AMOLED display (1500 nits)",
      "Continuous ECG, SpO2 and Sleep tracking",
      "14-day battery life with solar reserve",
      "Water resistant to 10 ATM (100 meters)"
    ],
    inStock: true
  },
  {
    id: "lumina-aura-speaker",
    name: "Lumina Sphere Home Sound",
    tagline: "360° architectural room-filling acoustic sculpture",
    category: "living",
    price: 279,
    originalPrice: 320,
    rating: 4.8,
    reviewsCount: 96,
    badge: "Design Award",
    image: "assets/images/product-speaker.jpg",
    description: "Seamless cylindrical aluminum housing with an ambient LED aura ring. Dual opposed force-cancelling passive radiators deliver deep bass without physical vibration.",
    features: [
      "True 360-degree omnidirectional acoustic array",
      "Room-sensing auto acoustic calibration",
      "Synchronized ambient LED edge halo",
      "AirPlay 2, Spotify Connect & Wi-Fi 6 streaming",
      "Stereo pairing support"
    ],
    inStock: true
  },
  {
    id: "lumina-pods-ultra",
    name: "Lumina Aether True Wireless",
    tagline: "Lossless in-ear audio encased in brushed aluminum",
    category: "audio",
    price: 189,
    originalPrice: 229,
    rating: 4.7,
    reviewsCount: 230,
    badge: "Hot Pick",
    image: "assets/images/product-earbuds.jpg",
    description: "Featherlight ergonomic earbuds with graphene drivers and quad-mic beamforming for crystal clear calls even in noisy city environments. Includes CNC brushed aluminum charging case.",
    features: [
      "Pure graphene micro-drivers with aptX Lossless",
      "Quad-mic beamforming noise cancellation",
      "36 hours total playback with charging case",
      "IPX7 sweat and water resistance",
      "Qi wireless fast charging"
    ],
    inStock: true
  },
  {
    id: "lumina-studio-ref",
    name: "Lumina Studio Reference X",
    tagline: "Open-back planar magnetic audiophile master",
    category: "audio",
    price: 649,
    originalPrice: 699,
    rating: 5.0,
    reviewsCount: 78,
    badge: "Audiophile",
    image: "assets/images/hero.jpg",
    description: "Handcrafted open-back headphones designed for mixing engineers and discerning audiophiles. Laser-etched acoustic grilles ensure wide holographic soundstaging.",
    features: [
      "Planar magnetic ultra-thin diaphragms",
      "Open-back acoustically transparent acoustic chamber",
      "Detachable silver-plated oxygen-free copper cable",
      "Italian lambskin and memory foam headband",
      "Frequency response: 5Hz – 52,000Hz"
    ],
    inStock: true
  },
  {
    id: "lumina-pulse-band",
    name: "Lumina Pulse Fitness Band",
    tagline: "Minimalist stealth biometric tracker without distractions",
    category: "wearables",
    price: 129,
    originalPrice: 159,
    rating: 4.6,
    reviewsCount: 115,
    badge: "Minimalist",
    image: "assets/images/product-smartwatch.jpg",
    description: "Screenless woven textile band designed for 24/7 strain, recovery, and sleep tracking. Vibration haptic alarm wakes you at the optimal stage of sleep.",
    features: [
      "Screenless lightweight aerodynamic design (22g)",
      "Continuous skin temperature & HRV tracking",
      "7-day battery with slide-on wireless battery pack",
      "Waterproof up to 50m",
      "Includes 1 year Lumina Pro Health membership"
    ],
    inStock: true
  },
  {
    id: "lumina-aura-mini",
    name: "Lumina Beam Portable Speaker",
    tagline: "Rugged waterproof outdoor acoustic companion",
    category: "living",
    price: 149,
    originalPrice: 179,
    rating: 4.8,
    reviewsCount: 88,
    badge: "New",
    image: "assets/images/product-speaker.jpg",
    description: "Compact outdoor wireless speaker wrapped in tactile ballistic woven fabric. Up to 20 hours battery life with integrated carabiner loop and magnetic mounting base.",
    features: [
      "IP67 dustproof and waterproof (it floats)",
      "20 hours continuous playtime",
      "PartyBoost mode to pair up to 10 speakers",
      "Built-in powerbank for phone charging",
      "Shockproof silicone end caps"
    ],
    inStock: true
  },
  {
    id: "lumina-charge-dock",
    name: "Lumina Magnetic 3-in-1 Power Stand",
    tagline: "Floating MagSafe wireless charging station",
    category: "accessories",
    price: 119,
    originalPrice: 139,
    rating: 4.9,
    reviewsCount: 164,
    badge: "Staff Pick",
    image: "assets/images/product-earbuds.jpg",
    description: "Machined from a solid billet of aerospace aluminum with weighted base. Fast charges iPhone, Apple Watch, and Lumina earbuds simultaneously with a single cable.",
    features: [
      "15W MagSafe ultra-fast wireless charging",
      "Aircraft-grade anodized aluminum finish",
      "Floating geometric tree design",
      "Integrated smart thermal regulation",
      "Braided 65W USB-C cable included"
    ],
    inStock: true
  }
];
