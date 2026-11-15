import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { money, qrSVG } from '../../utils/formatters';
import { mStatus, mDue, getMemberLedger } from '../../utils/helpers';
import Pill from '../../components/common/Pill';

// ============================================================================
// CAFÉ & BEER / BAR MENU CATALOG (Floor 2 & Floor 3)
// ============================================================================
const CAFE_AND_BAR_MENU = [
  // 1. BEER & BAR DRINKS (Lantern Bar & Lounge - Floor 2 & Rooftop Floor 10)
  {
    id: 'ts_beer',
    name: 'Tsingtao Premium Draft Beer',
    alt: '青岛生啤酒',
    bnName: 'সিংতাও প্রিমিয়াম ড্রাফট বিয়ার',
    category: 'beer',
    catLabel: 'Beer & Bar',
    price: 480,
    outlet: 'Lantern Bar',
    floor: 'Floor 2 & 10',
    desc: 'Ice-cold imported draught beer served in frosted club goblet. Crisp, refreshing golden malt finish.',
    badge: 'Popular',
    icon: '🍺'
  },
  {
    id: 'craft_beer',
    name: 'BCC Bilateral Craft Golden Lager',
    alt: '金牌精酿啤酒',
    bnName: 'বিসিসি ক্রাফট গোল্ডেন লেগার',
    category: 'beer',
    catLabel: 'Beer & Bar',
    price: 520,
    outlet: 'Lantern Bar',
    floor: 'Floor 2',
    desc: 'Club specialty craft lager brewed with noble hops and golden malt. 330ml chilled bottle.',
    badge: 'Club Special',
    icon: '🍻'
  },
  {
    id: 'baijiu_shot',
    name: 'Imperial Maotai Baijiu (30ml Shot)',
    alt: '贵州茅台 (小杯)',
    bnName: 'ইম্পেরিয়াল মাওতাই বাইজিউ',
    category: 'beer',
    catLabel: 'Beer & Bar',
    price: 850,
    outlet: 'Lantern Bar',
    floor: 'Floor 2',
    desc: 'Authentic Guizhou aroma Baijiu served in ritual ceramic cup. Reserved for club VIP members.',
    badge: 'VIP Only',
    icon: '🍶'
  },
  {
    id: 'scotch_12y',
    name: 'Highland Single Malt Scotch (12Y)',
    alt: '单一麦芽威士忌',
    bnName: 'হাইল্যান্ড সিঙ্গেল মল্ট স্কচ (১২ বছর)',
    category: 'beer',
    catLabel: 'Beer & Bar',
    price: 1100,
    outlet: 'Lantern Bar',
    floor: 'Floor 2',
    desc: 'Served neat or on hand-carved ice sphere with salted edamame and spiced roasted nuts.',
    badge: 'Premium',
    icon: '🥃'
  },
  {
    id: 'jasmine_mocktail',
    name: 'Jasmine Sunset Cooler Mocktail',
    alt: '茉莉日落特调',
    bnName: 'জেসমিন সানসেট মকটেল',
    category: 'beer',
    catLabel: 'Beer & Bar',
    price: 380,
    outlet: 'Lantern Bar',
    floor: 'Floor 2',
    desc: 'Fragrant jasmine tea infused with fresh lychee nectar, garden mint, and sparkling tonic.',
    badge: 'Mocktail',
    icon: '🍹'
  },
  {
    id: 'borhani_spritz',
    name: 'Heritage Borhani Spritz',
    alt: '特色香料酸奶汽水',
    bnName: 'হেরিটেজ বোরহানি স্প্রিটজ',
    category: 'beer',
    catLabel: 'Beer & Bar',
    price: 320,
    outlet: 'Lantern Bar',
    floor: 'Floor 2',
    desc: 'Traditional spicy mint yogurt drink blended with sparkling soda and roasted cumin zest.',
    badge: 'Desi Blend',
    icon: '🍸'
  },

  // 2. CAFÉ & COFFEE & SPECIALTY TEA (Tea Garden Café - Floor 3)
  {
    id: 'artisan_cappuccino',
    name: 'Artisan Arabica Cappuccino',
    alt: '意式卡布奇诺',
    bnName: 'আর্টিসান ক্যাপুচিনো কফি',
    category: 'cafe',
    catLabel: 'Café & Coffee',
    price: 280,
    outlet: 'Tea Garden',
    floor: 'Floor 3',
    desc: 'Double shot rich espresso with velvety steamed micro-foam and Madagascar cocoa dusting.',
    badge: 'Best Seller',
    icon: '☕'
  },
  {
    id: 'signature_americano',
    name: 'Signature Dark Roast Americano',
    alt: '经典美式咖啡',
    bnName: 'সিগনেচার ডার্ক আমেরিকান কফি',
    category: 'cafe',
    catLabel: 'Café & Coffee',
    price: 240,
    outlet: 'Tea Garden',
    floor: 'Floor 3',
    desc: 'Smooth, aromatic dark roast blend with caramel undertones. Served piping hot or iced.',
    badge: 'Classic',
    icon: '☕'
  },
  {
    id: 'sylhet_tea_pot',
    name: 'Heritage Sylhet First Flush Tea (Pot)',
    alt: '锡尔赫特红茶',
    bnName: 'সিলেট হেরিটেজ চা (পট)',
    category: 'cafe',
    catLabel: 'Café & Coffee',
    price: 260,
    outlet: 'Tea Garden',
    floor: 'Floor 3',
    desc: 'Brewed premium Malnicherra estate black tea. Served with warm condensed milk and cardamom.',
    badge: 'Heritage',
    icon: '🫖'
  },
  {
    id: 'longjing_tea_pot',
    name: 'Imperial Longjing Dragon Well Green Tea',
    alt: '西湖特级龙井',
    bnName: 'ইম্পেরিয়াল লংজিং ড্রাগন গ্রিন টি',
    category: 'cafe',
    catLabel: 'Café & Coffee',
    price: 420,
    outlet: 'Tea Garden',
    floor: 'Floor 3',
    desc: 'Authentic West Lake pan-roasted emerald tea leaves with nutty roasted chestnut aroma.',
    badge: 'Premium Tea',
    icon: '🍵'
  },
  {
    id: 'cheesecake',
    name: 'New York Baked Cheesecake',
    alt: '纽约烤芝士蛋糕',
    bnName: 'নিউইয়র্ক বেকড চিজকেক',
    category: 'cafe',
    catLabel: 'Café & Coffee',
    price: 340,
    outlet: 'Tea Garden',
    floor: 'Floor 3',
    desc: 'Rich Philadelphia cream cheese on graham crust topped with wild berry compote.',
    badge: 'Bakery',
    icon: '🍰'
  },

  // 3. FOOD & SNACKS (Silk Route & Tea Garden)
  {
    id: 'club_burger',
    name: 'Classic Club Wagyu Burger & Fries',
    alt: '俱乐部牛肉汉堡',
    bnName: 'ক্লাসিক ক্লাব বার্গার ও ফ্রাইস',
    category: 'food',
    catLabel: 'Food & Snacks',
    price: 450,
    outlet: 'Silk Route',
    floor: 'Floor 2',
    desc: 'Juicy grilled beef patty, melted sharp cheddar, caramelized onions, crispy golden fries.',
    badge: 'Chef Choice',
    icon: '🍔'
  },
  {
    id: 'club_sandwich',
    name: 'Triple-Decker Club Sandwich',
    alt: '俱乐部三明治',
    bnName: 'ট্রিপল-ডেকার ক্লাব স্যান্ডউইচ',
    category: 'food',
    catLabel: 'Food & Snacks',
    price: 380,
    outlet: 'Tea Garden',
    floor: 'Floor 3',
    desc: 'Smoked chicken breast, turkey bacon, farm egg, vine tomato, butter lettuce and garlic aioli.',
    badge: 'Light Meal',
    icon: '🥪'
  },
  {
    id: 'dim_sum_platter',
    name: 'Steamed Dim Sum Platter (8 pcs)',
    alt: '蒸点心拼盘 (8件)',
    bnName: 'স্টিমড ডিম সাম প্ল্যাটার (৮ পিস)',
    category: 'food',
    catLabel: 'Food & Snacks',
    price: 520,
    outlet: 'Silk Route',
    floor: 'Floor 2',
    desc: 'Har Gow shrimp dumplings, Siu Mai, and crystal spinach dumplings with Sichuan chili crisp.',
    badge: 'Authentic',
    icon: '🥟'
  }
];

export default function MemberDashboardView() {
  const {
    currentMember,
    members,
    openModal,
    collectDues,
    setView,
    openChat,
    lang,
    transactions,
    addTxn,
    showToast
  } = useApp();

  // Active workspace tab: default to 'cafe_bar' as requested so member can order immediately!
  const [activeTab, setActiveTab] = useState('cafe_bar'); // 'cafe_bar' | 'orders' | 'card' | 'dues' | 'book'

  // Café & Bar Filter Category
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'beer' | 'cafe' | 'food'

  // Cart state: { [itemId]: quantity }
  const [cart, setCart] = useState({});

  // Delivery options state
  const [deliveryLocation, setDeliveryLocation] = useState('Lantern Bar & Lounge (Floor 2)');
  const [deliveryPoint, setDeliveryPoint] = useState('Table B2');
  const [paymentMethod, setPaymentMethod] = useState('Member account');
  const [orderNote, setOrderNote] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Fallback to first member if none selected
  const member = currentMember || members[0] || {
    id: 'BCC-0482',
    name: 'Anika Rahman',
    alt: 'আনিকা রহমান',
    email: 'anika.rahman@gmail.com',
    tier: 'Permanent',
    nat: 'BD',
    over: 0,
    spend: 18450,
    year: 2018
  };

  const status = mStatus(member);
  const dues = mDue(member);
  const ledger = getMemberLedger(member);

  // Load and manage member orders
  const [memberOrders, setMemberOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(`bcc_orders_${member.id}`);
      return saved ? JSON.parse(saved) : [
        {
          id: 'BCC-ORD-8492',
          items: [
            { name: 'Tsingtao Premium Draft Beer', qty: 2, price: 480 },
            { name: 'Artisan Arabica Cappuccino', qty: 1, price: 280 }
          ],
          subtotal: 1240,
          discount: 186,
          total: 1054,
          location: 'Lantern Bar & Lounge (Floor 2)',
          point: 'Table B2',
          method: 'Member account',
          time: '25 mins ago',
          status: 'In Preparation',
          step: 2
        }
      ];
    } catch {
      return [];
    }
  });

  // Save orders to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(`bcc_orders_${member.id}`, JSON.stringify(memberOrders));
    } catch (e) {
      console.warn('Failed to save member orders:', e);
    }
  }, [memberOrders, member.id]);

  // Cart management helpers
  const addToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const clearCart = () => setCart({});

  // Cart Computations
  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  const cartCalculations = useMemo(() => {
    let subtotal = 0;
    const items = [];
    Object.keys(cart).forEach((id) => {
      const qty = cart[id];
      const menuItem = CAFE_AND_BAR_MENU.find((m) => m.id === id);
      if (menuItem && qty > 0) {
        const itemTotal = menuItem.price * qty;
        subtotal += itemTotal;
        items.push({
          ...menuItem,
          qty,
          itemTotal
        });
      }
    });

    // 15% VIP Club Member Discount on all Café & Bar orders!
    const discount = Math.round(subtotal * 0.15);
    const total = Math.max(0, subtotal - discount);

    return { items, subtotal, discount, total };
  }, [cart]);

  // Handle Order Submission
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (cartCalculations.items.length === 0) return;

    setIsPlacingOrder(true);

    const orderId = `BCC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalTotal = cartCalculations.total;

    // Record in global transactions
    if (addTxn) {
      addTxn({
        outlet: deliveryLocation.includes('Bar') ? 'Lantern Bar' : 'Tea Garden',
        method: paymentMethod,
        amount: finalTotal,
        st: 'Success'
      });
    }

    const newOrder = {
      id: orderId,
      items: cartCalculations.items.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        icon: i.icon
      })),
      subtotal: cartCalculations.subtotal,
      discount: cartCalculations.discount,
      total: finalTotal,
      location: deliveryLocation,
      point: deliveryPoint.trim() || 'Floor Delivery',
      note: orderNote.trim(),
      method: paymentMethod,
      time: 'Just now',
      status: 'In Preparation',
      step: 2
    };

    setTimeout(() => {
      setMemberOrders((prev) => [newOrder, ...prev]);
      setLastPlacedOrder(newOrder);
      setCart({});
      setIsPlacingOrder(false);
      showToast(
        lang === 'bn'
          ? `অর্ডার কনফার্ম হয়েছে! আইডি: #${orderId}`
          : `Order placed successfully! ID: #${orderId}`
      );
    }, 700);
  };

  // Filtered menu based on selected category
  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'all') return CAFE_AND_BAR_MENU;
    return CAFE_AND_BAR_MENU.filter((m) => m.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* ==================================================================== */}
      {/* 1. TOP WELCOME & NOTIFICATION BANNER                                 */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#082018] to-[#12382e] border border-[#e8b04a]/30 text-white shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0b6e52] to-[#e8b04a] p-0.5 flex items-center justify-center shadow-md flex-shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#071d16] flex items-center justify-center text-lg font-serif font-bold text-[#e8b04a]">
              {member.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide">
                {lang === 'bn' ? `স্বাগতম, ${member.name}!` : `Welcome, ${member.name}!`}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                {member.tier}
              </span>
            </div>
            <p className="text-xs text-[#8fa89c] font-sans mt-0.5 flex items-center gap-2">
              <span>{lang === 'bn' ? 'সুপার এডমিন ভেরিফাইড জিমেইল:' : 'Super Admin Verified Gmail:'}</span>
              <span className="font-mono text-[#e8b04a] font-semibold underline underline-offset-2">
                {member.email || `${member.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com`}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('cafe_bar')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#e8b04a] to-[#d49e38] text-[#071d16] text-xs font-serif font-bold shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>☕🍺</span>
            <span>{lang === 'bn' ? 'ক্যাফে ও বিয়ার অর্ডার' : 'Order Café & Beer'}</span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#071d16] text-white text-[10px] flex items-center justify-center font-mono">
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => openChat('Explore All Floors')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-serif font-medium transition-all flex items-center gap-1.5"
          >
            <span>🤖</span>
            <span>{lang === 'bn' ? 'ক্লাব এআই' : 'Club AI'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. VIP MEMBER PASS & QUICK METRICS BAR                               */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital VIP Member Pass Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#071f17] via-[#0d2f24] to-[#174839] text-white shadow-2xl border border-[#e8b04a]/40 overflow-hidden group">
            {/* Background Decorative Gold Watermark & Gradients */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#e8b04a]/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#006a4e]/20 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />

            {/* Card Header: Club Bilateral Crest */}
            <div className="flex justify-between items-start gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b6e52] border border-[#e8b04a]/50 flex items-center justify-center shadow-md flex-shrink-0">
                  <svg viewBox="0 0 40 40" className="w-7 h-7" aria-hidden="true">
                    <rect width="40" height="40" rx="9" fill="#0b6e52" />
                    <circle cx="18" cy="20" r="8.5" fill="#e0412f" />
                    <path d="M4 33 Q20 19 36 33" fill="none" stroke="#e8b04a" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#e8b04a] font-bold">
                    Bangladesh China Club
                  </div>
                  <div className="text-[11px] text-[#9bb3a8] font-serif">
                    孟中俱乐部 · VIP Member Pass
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code for Gate/Reception Access */}
              <div
                className="p-1.5 bg-white rounded-xl shadow-md flex-shrink-0 transform group-hover:scale-105 transition-transform"
                title="Scan at Entrance Gate & Reception"
                dangerouslySetInnerHTML={{ __html: qrSVG(member.id.charCodeAt(4) || 21, 60) }}
              />
            </div>

            {/* Member Identity Details */}
            <div className="mb-6 relative z-10">
              <div className="text-xl sm:text-2xl font-serif font-bold tracking-wide text-white flex items-center gap-2">
                <span>{member.name}</span>
                {member.nat && (
                  <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold border border-white/10">
                    {member.nat}
                  </span>
                )}
              </div>
              {member.alt && (
                <div className="text-sm text-[#9bb3a8] font-serif mt-0.5">{member.alt}</div>
              )}
              <div className="text-xs text-[#e8b04a]/90 font-mono mt-1.5 flex items-center gap-1.5">
                <span>✉️</span>
                <span>{member.email}</span>
              </div>
            </div>

            {/* Card Footer: Metadata Grid */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/15 text-xs relative z-10">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#8fa89c]">Member ID</div>
                <div className="font-mono font-bold text-white tracking-wider">{member.id}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#8fa89c]">Tier</div>
                <div className="font-serif font-semibold text-[#e8b04a]">{member.tier}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#8fa89c]">Joined</div>
                <div className="font-semibold text-white">{member.year}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Key Member Metrics Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          {/* Card 1: Outstanding Dues & Instant Pay */}
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-bcc-muted">
                  {lang === 'bn' ? 'বকেয়া সাবস্ক্রিপশন (Dues)' : 'Outstanding Dues'}
                </span>
                <Pill
                  text={status}
                  variant={status === 'Active' ? 'ok' : status === 'Overdue' ? 'warn' : 'bad'}
                />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-bcc-red mt-2">
                {dues > 0 ? money(dues) : '৳0'}
              </div>
              <p className="text-[11px] text-bcc-muted mt-1">
                {member.over > 0 ? `${member.over} month(s) overdue` : 'All club dues cleared'}
              </p>
            </div>

            <div className="pt-3">
              {dues > 0 ? (
                <button
                  onClick={() => collectDues(member)}
                  className="w-full py-2 px-3 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>💳</span>
                  <span>{lang === 'bn' ? 'বকেয়া পরিশোধ করুন' : 'Pay Dues Online'}</span>
                </button>
              ) : (
                <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span>✓</span>
                  <span>{lang === 'bn' ? 'কোনো বকেয়া নেই' : 'Account in Good Standing'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: 15% VIP Food & Drink Privilege */}
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-bcc-muted">
                  {lang === 'bn' ? 'ভিআইপি ডাইনিং ডিসকাউন্ট' : 'VIP Dining Benefit'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                  15% OFF
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-bcc-text mt-2">
                15% OFF
              </div>
              <p className="text-[11px] text-bcc-muted mt-1">
                Applied on all Café, Beer & Bar orders
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setActiveTab('cafe_bar')}
                className="w-full py-2 px-3 rounded-xl bg-[#0b6e52] hover:bg-[#095942] text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>🍺</span>
                <span>{lang === 'bn' ? 'অর্ডার শুরু করুন' : 'Order Now'}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Friendship Reward Points */}
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-bcc-muted">
                {lang === 'bn' ? 'বন্ধুত্ব রিওয়ার্ড পয়েন্টস' : 'BCC Friendship Points'}
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#b58117] dark:text-[#f3c258] mt-2">
                {(Math.round(member.spend * 0.12) + 240).toLocaleString()} <span className="text-sm font-sans font-medium text-bcc-muted">pts</span>
              </div>
              <p className="text-[11px] text-bcc-muted mt-1">
                Redeemable at Silk Route & Tea Garden
              </p>
            </div>

            <div className="pt-3">
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40 inline-block">
                VIP Tier Active
              </span>
            </div>
          </div>

          {/* Card 4: Month-to-Date Spend */}
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-bcc-muted">
                {lang === 'bn' ? 'চলতি মাসের খরচ (Spend MTD)' : 'Spend (MTD)'}
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-bcc-text mt-2">
                {money(member.spend)}
              </div>
              <p className="text-[11px] text-bcc-muted mt-1">
                Dining, Hotel Stay & Club Services
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setActiveTab('orders')}
                className="w-full py-2 px-3 rounded-xl border border-bcc-line hover:bg-black/5 dark:hover:bg-white/5 text-bcc-text text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <span>📋</span>
                <span>{lang === 'bn' ? 'অর্ডার হিস্ট্রি' : 'View Orders'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. TAB NAVIGATION MENU                                               */}
      {/* ==================================================================== */}
      <div className="flex border-b border-bcc-line gap-2 overflow-x-auto pb-px">
        {[
          { id: 'cafe_bar', label: lang === 'bn' ? 'ক্যাফে ও বিয়ার/বার অর্ডার' : 'Order Café & Beer', icon: '☕🍺', badge: cartItemCount > 0 ? cartItemCount : null },
          { id: 'orders', label: lang === 'bn' ? 'অর্ডার হিস্ট্রি ও ট্র্যাকিং' : 'Order History & Status', icon: '📋', badge: memberOrders.length },
          { id: 'card', label: lang === 'bn' ? 'সদস্য পরিচিতি ও সুবিধা' : 'Profile & Privileges', icon: '👤' },
          { id: 'dues', label: lang === 'bn' ? 'বকেয়া ও অ্যাকাউন্ট স্টেটমেন্ট' : 'Dues & Invoices', icon: '🧾' },
          { id: 'book', label: lang === 'bn' ? 'রুম ও ডাইনিং বুকিং' : 'Book Facilities', icon: '🏨' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-serif font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#0b6e52] text-[#0b6e52] dark:text-[#26a67a] bg-black/[0.02] dark:bg-white/[0.02]'
                : 'border-transparent text-bcc-muted hover:text-bcc-text'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === tab.id ? 'bg-[#0b6e52] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: CAFÉ & BEER/BAR ORDERING WORKSPACE (FEATURE REQUESTED)        */}
      {/* ==================================================================== */}
      {activeTab === 'cafe_bar' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Recent Order Toast Alert if just placed */}
          {lastPlacedOrder && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 shadow-md flex items-center justify-between gap-3 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <h4 className="font-bold text-sm font-serif">
                    Order Confirmed #{lastPlacedOrder.id}!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Preparing now · Delivering to {lastPlacedOrder.location} ({lastPlacedOrder.point}) in 10-15 mins.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap shadow-xs"
              >
                Track Order
              </button>
            </div>
          )}

          {/* Category Filter Pills & Notice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bcc-surface p-3.5 rounded-2xl border border-bcc-line shadow-xs">
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'All Items', icon: '🍽️' },
                { id: 'beer', label: 'Beer & Bar Drinks', icon: '🍺' },
                { id: 'cafe', label: 'Café & Coffee', icon: '☕' },
                { id: 'food', label: 'Food & Snacks', icon: '🍔' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    selectedCategory === c.id
                      ? 'bg-[#0b6e52] text-white shadow-xs font-semibold'
                      : 'bg-black/5 dark:bg-white/5 text-bcc-muted hover:text-bcc-text'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <span>✨</span>
              <span>15% VIP Member Discount automatically applied at checkout</span>
            </div>
          </div>

          {/* Main 2-Column Ordering Layout: Menu Grid (Left) + Cart & Checkout (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Menu Items Cards Grid */}
            <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenu.map((item) => {
                const itemQtyInCart = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-bcc-surface border border-bcc-line shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Outlet & Category Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {item.outlet} · {item.floor}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {item.badge}
                        </span>
                      </div>

                      {/* Item Title & Emoji Icon */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-serif font-bold text-sm text-bcc-text leading-snug">
                            {item.name}
                          </h4>
                          <div className="text-[11px] text-bcc-muted font-serif">
                            {item.alt} {item.bnName ? `· ${item.bnName}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-bcc-muted mt-2 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Price and Add to Cart Buttons */}
                    <div className="mt-4 pt-3 border-t border-bcc-line flex items-center justify-between">
                      <div>
                        <div className="text-base font-serif font-bold text-bcc-text">
                          {money(item.price)}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">
                          VIP: {money(Math.round(item.price * 0.85))}
                        </div>
                      </div>

                      {itemQtyInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl px-2 py-1">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-gray-800 text-bcc-text flex items-center justify-center font-bold text-sm hover:bg-gray-100 shadow-xs active:scale-95"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs px-1 text-emerald-800 dark:text-emerald-200">
                            {itemQtyInCart}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(item.id)}
                            className="w-6 h-6 rounded-lg bg-[#0b6e52] text-white flex items-center justify-center font-bold text-sm hover:bg-[#095942] shadow-xs active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0b6e52] hover:bg-[#095942] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <span>+ Add to Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 5 Cols: Cart, Delivery Selection & Checkout Panel */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
              <div className="p-5 rounded-3xl bg-bcc-surface border border-bcc-line shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-bcc-line">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛍️</span>
                    <h3 className="font-serif font-bold text-base text-bcc-text">
                      {lang === 'bn' ? 'আপনার অর্ডার কার্ট' : 'Member Order Cart'}
                    </h3>
                  </div>
                  {cartCalculations.items.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                {cartCalculations.items.length === 0 ? (
                  <div className="py-8 text-center text-bcc-muted space-y-2">
                    <div className="text-3xl">☕🍺</div>
                    <div className="text-xs font-medium">Your cart is currently empty.</div>
                    <p className="text-[11px] text-bcc-muted max-w-xs mx-auto">
                      Select any Café coffee, tea, craft beer, or snack from the left to order directly to your table or room!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {cartCalculations.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base flex-shrink-0">{item.icon}</span>
                          <div className="min-w-0">
                            <div className="font-serif font-bold truncate text-bcc-text">{item.name}</div>
                            <div className="text-[10px] text-bcc-muted">{money(item.price)} × {item.qty}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="w-5 h-5 rounded bg-white dark:bg-gray-800 text-bcc-text flex items-center justify-center font-bold text-xs border border-bcc-line shadow-2xs"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs px-0.5">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item.id)}
                            className="w-5 h-5 rounded bg-[#0b6e52] text-white flex items-center justify-center font-bold text-xs shadow-2xs"
                          >
                            +
                          </button>
                          <span className="font-mono font-bold text-xs ml-1 text-bcc-text">
                            {money(item.itemTotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Delivery Location & Instructions Form */}
                <form onSubmit={handleConfirmOrder} className="space-y-3 pt-2 border-t border-bcc-line">
                  <div>
                    <label className="text-xs font-semibold text-bcc-text block mb-1">
                      {lang === 'bn' ? 'ডেলিভারি লোকেশন (Delivery Location)' : 'Club Delivery Location'}
                    </label>
                    <select
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-bcc-line bg-bcc-surface text-xs font-medium"
                      required
                    >
                      <option value="Lantern Bar & Lounge (Floor 2)">🛋️ Lantern Bar & Lounge (Floor 2)</option>
                      <option value="Tea Garden Café Terrace (Floor 3)">☕ Tea Garden Café Terrace (Floor 3)</option>
                      <option value="Silk Route Restaurant (Floor 2)">🥢 Silk Route Restaurant (Floor 2)</option>
                      <option value="Club Guest Room (Floor 4/5)">🛏️ Club Guest Room (Floor 4/5)</option>
                      <option value="Olympic Swimming Pool (Floor 9)">🏊 Poolside Lounge (Floor 9)</option>
                      <option value="Gym & Sauna Lounge (Floor 8)">🏋️ Gym & Sauna Lounge (Floor 8)</option>
                      <option value="VIP Executive Boardroom (Floor 6)">🏛️ VIP Executive Boardroom (Floor 6)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-bcc-muted block mb-1">
                        Table / Room No.
                      </label>
                      <input
                        type="text"
                        value={deliveryPoint}
                        onChange={(e) => setDeliveryPoint(e.target.value)}
                        placeholder="e.g. Table B2 / Room 402"
                        className="w-full px-3 py-1.5 rounded-xl border border-bcc-line bg-bcc-surface text-xs font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-bcc-muted block mb-1">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-bcc-line bg-bcc-surface text-xs font-medium"
                      >
                        <option value="Member account">💳 Member Account</option>
                        <option value="bKash">📱 bKash</option>
                        <option value="Nagad">📱 Nagad</option>
                        <option value="Cash on Delivery">💵 Cash at Table</option>
                        <option value="Card">💳 POS Card</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Special instructions (e.g. Extra ice, lemon, less sugar)"
                      className="w-full px-3 py-1.5 rounded-xl border border-bcc-line bg-bcc-surface text-xs placeholder-gray-400"
                    />
                  </div>

                  {/* Pricing Breakdown */}
                  {cartCalculations.items.length > 0 && (
                    <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1.5 text-xs">
                      <div className="flex justify-between text-bcc-muted">
                        <span>Items Subtotal</span>
                        <span className="font-mono">{money(cartCalculations.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>VIP Member Privilege (15% OFF)</span>
                        <span className="font-mono">-{money(cartCalculations.discount)}</span>
                      </div>
                      <div className="pt-1.5 border-t border-bcc-line flex justify-between font-bold text-sm text-bcc-text">
                        <span>Total Payable</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-serif">
                          {money(cartCalculations.total)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={cartCalculations.items.length === 0 || isPlacingOrder}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0b6e52] to-[#128a67] hover:from-[#095942] hover:to-[#0f7758] text-white font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isPlacingOrder ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>☕🍺 Confirm & Order Now</span>
                        {cartCalculations.items.length > 0 && (
                          <span className="font-mono font-normal">
                            ({money(cartCalculations.total)})
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: MEMBER ORDERS & REAL-TIME TRACKING                            */}
      {/* ==================================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-bcc-text">
                {lang === 'bn' ? 'আমার খাবারের অর্ডার ও লাইভ স্ট্যাটাস' : 'My Orders & Real-Time Tracking'}
              </h3>
              <p className="text-xs text-bcc-muted mt-0.5">
                Track all Café coffee, Tsingtao beer, food and club service deliveries in real-time.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('cafe_bar')}
              className="px-4 py-2 rounded-xl bg-[#0b6e52] hover:bg-[#095942] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>+ Place New Order</span>
            </button>
          </div>

          {/* Active Orders List with Stepper */}
          <div className="space-y-4">
            {memberOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-bcc-line">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍽️</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-bcc-text">
                          Order #{order.id}
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-bcc-muted font-sans mt-0.5">
                        📍 Destination: <b>{order.location}</b> ({order.point}) · {order.time}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                      {money(order.total)}
                    </div>
                    <div className="text-[10px] text-bcc-muted font-medium">
                      Paid via {order.method}
                    </div>
                  </div>
                </div>

                {/* Progress Tracking Stepper */}
                <div className="py-2">
                  <div className="flex items-center justify-between text-xs font-medium text-bcc-muted max-w-xl mx-auto relative">
                    <div className="flex flex-col items-center gap-1 z-10">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                      <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        Received
                      </span>
                    </div>

                    <div className="flex-1 h-1 bg-emerald-500 mx-2" />

                    <div className="flex flex-col items-center gap-1 z-10">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        (order.step || 2) >= 2 ? 'bg-emerald-600 text-white animate-pulse' : 'bg-gray-200 text-gray-500'
                      }`}>
                        ⏳
                      </span>
                      <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        In Preparation
                      </span>
                    </div>

                    <div className={`flex-1 h-1 mx-2 ${
                      (order.step || 2) >= 3 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />

                    <div className="flex flex-col items-center gap-1 z-10">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        (order.step || 2) >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}>
                        🛵
                      </span>
                      <span className="text-[10.5px] text-bcc-muted">
                        Out for Delivery
                      </span>
                    </div>

                    <div className={`flex-1 h-1 mx-2 ${
                      (order.step || 2) >= 4 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />

                    <div className="flex flex-col items-center gap-1 z-10">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        (order.step || 2) >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}>
                        ✓
                      </span>
                      <span className="text-[10.5px] text-bcc-muted">
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Ordered List */}
                <div className="bg-black/[0.02] dark:bg-white/[0.02] p-3 rounded-xl border border-bcc-line">
                  <div className="text-xs font-semibold text-bcc-text mb-2">Items in this order:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex items-center justify-between text-bcc-muted">
                        <span>{i.icon || '☕'} {i.name} × {i.qty}</span>
                        <span className="font-mono">{money(i.price * i.qty)}</span>
                      </div>
                    ))}
                  </div>
                  {order.note && (
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 pt-2 border-t border-bcc-line italic">
                      Note: "{order.note}"
                    </div>
                  )}
                </div>
              </div>
            ))}

            {memberOrders.length === 0 && (
              <div className="p-8 text-center bg-bcc-surface rounded-2xl border border-bcc-line text-bcc-muted space-y-3">
                <div className="text-4xl">☕🍺</div>
                <div className="font-serif font-bold text-base text-bcc-text">No active orders placed yet</div>
                <p className="text-xs max-w-sm mx-auto">
                  You can order artisan coffees, Tsingtao beer, snacks, and cocktails directly to your seat or room!
                </p>
                <button
                  onClick={() => setActiveTab('cafe_bar')}
                  className="px-4 py-2 rounded-xl bg-[#0b6e52] text-white text-xs font-semibold shadow-xs"
                >
                  Browse Menu & Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: MEMBER PROFILE & PRIVILEGES                                   */}
      {/* ==================================================================== */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Left: Official Membership Record */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-bcc-text flex items-center gap-2">
              <span>📋</span>
              <span>Official Membership Information</span>
            </h3>

            <div className="space-y-3 divide-y divide-bcc-line text-xs">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Full Legal Name</span>
                <span className="font-bold font-serif text-bcc-text">{member.name}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Bilingual / Native Name</span>
                <span className="font-serif text-bcc-text">{member.alt || '–'}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Member ID Number</span>
                <span className="font-mono font-bold text-bcc-text">{member.id}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Super Admin Registered Gmail</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {member.email}
                </span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Membership Tier</span>
                <span className="font-semibold text-bcc-text">{member.tier} Member</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Country / Nationality</span>
                <span className="font-semibold text-bcc-text">{member.nat === 'BD' ? 'Bangladesh 🇧🇩' : member.nat === 'CN' ? 'China 🇨🇳' : 'Diplomatic 🌐'}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-bcc-muted">Membership Enrollment Year</span>
                <span className="font-semibold text-bcc-text">{member.year}</span>
              </div>
            </div>
          </div>

          {/* Right: VIP Privileges & Benefits */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-bcc-text flex items-center gap-2">
              <span>👑</span>
              <span>Bilateral Club VIP Privileges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1">
                <div className="font-bold text-bcc-text flex items-center gap-1.5">
                  <span>🏊</span>
                  <span>Pool & Fitness</span>
                </div>
                <p className="text-[11px] text-bcc-muted">Complimentary daily access to Olympic Pool (Fl 9) and Gym (Fl 8).</p>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1">
                <div className="font-bold text-bcc-text flex items-center gap-1.5">
                  <span>🥢</span>
                  <span>15% Dining Discount</span>
                </div>
                <p className="text-[11px] text-bcc-muted">Exclusive discount at Silk Route Restaurant, Lantern Bar & Tea Garden.</p>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1">
                <div className="font-bold text-bcc-text flex items-center gap-1.5">
                  <span>🏨</span>
                  <span>Priority Guest Rooms</span>
                </div>
                <p className="text-[11px] text-bcc-muted">Deluxe Hotel rooms on Fl 4 & 5 with 24-hr concierge check-in.</p>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-bcc-line space-y-1">
                <div className="font-bold text-bcc-text flex items-center gap-1.5">
                  <span>🎉</span>
                  <span>Bilateral Events</span>
                </div>
                <p className="text-[11px] text-bcc-muted">Invitations to diplomatic dinners, tea ceremonies & banquets.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
              💡 <b>Tip:</b> Order drinks, beers, or snacks anytime from the <b>Order Café & Beer</b> tab above!
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: DUES & STATEMENTS                                             */}
      {/* ==================================================================== */}
      {activeTab === 'dues' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-base text-bcc-text">
                Current Subscription & Dues Status
              </h3>
              <p className="text-xs text-bcc-muted mt-0.5">
                Monthly membership fee: ৳3,500 · Billing cycle: 1st of every month
              </p>
            </div>

            {dues > 0 ? (
              <button
                onClick={() => collectDues(member)}
                className="px-5 py-2.5 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>💳 Pay Outstanding Dues ({money(dues)})</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold border border-emerald-300">
                ✓ No Dues Pending
              </div>
            )}
          </div>

          {/* Statement History */}
          <div className="bg-bcc-surface border border-bcc-line rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-bcc-line font-serif font-bold text-sm text-bcc-text">
              Recent Account Ledger Statements
            </div>
            <div className="overflow-x-auto">
              <table className="custom-table">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5">
                    <th>Transaction Description</th>
                    <th className="text-right">Billing Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map(([desc, amt], idx) => (
                    <tr key={idx}>
                      <td className="text-xs">{desc}</td>
                      <td
                        className={`text-xs text-right font-mono font-semibold ${
                          amt > 0 ? 'text-emerald-600' : 'text-bcc-muted'
                        }`}
                      >
                        {amt > 0 ? `+${money(amt)}` : money(amt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: FACILITY & ROOM RESERVATIONS                                  */}
      {/* ==================================================================== */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Booking 1: Hotel Rooms */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0b6e52]/10 text-[#0b6e52] dark:text-emerald-400 flex items-center justify-center text-2xl mb-3">
                🛏️
              </div>
              <h4 className="font-serif font-bold text-base text-bcc-text">Club Guest Stay</h4>
              <p className="text-xs text-bcc-muted mt-1">
                Luxury deluxe rooms and suites located on Floors 4, 5, and 7. Book guest accommodations at member-exclusive rates.
              </p>
            </div>
            <button
              onClick={() => setView('stay')}
              className="w-full py-2.5 px-4 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white text-xs font-semibold shadow-md transition-colors"
            >
              Reserve Room in Stay
            </button>
          </div>

          {/* Booking 2: Restaurant Dining */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#e0412f]/10 text-[#e0412f] flex items-center justify-center text-2xl mb-3">
                🥢
              </div>
              <h4 className="font-serif font-bold text-base text-bcc-text">Silk Route Dining</h4>
              <p className="text-xs text-bcc-muted mt-1">
                Reserve tables at Silk Route Chinese Restaurant (Fl 2), Lantern Bar (Fl 2), or Tea Garden Café (Fl 3).
              </p>
            </div>
            <button
              onClick={() => setView('pos')}
              className="w-full py-2.5 px-4 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white text-xs font-semibold shadow-md transition-colors"
            >
              Book Table & Dining
            </button>
          </div>

          {/* Booking 3: Pool & Fitness */}
          <div className="p-6 rounded-2xl bg-bcc-surface border border-bcc-line shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl mb-3">
                🏊
              </div>
              <h4 className="font-serif font-bold text-base text-bcc-text">Fitness & Wellness</h4>
              <p className="text-xs text-bcc-muted mt-1">
                Olympic swimming pool on Floor 9, full gym and sauna on Floor 8. Reserve personal trainer slots or spa sessions.
              </p>
            </div>
            <button
              onClick={() => setView('fit')}
              className="w-full py-2.5 px-4 rounded-xl bg-bcc-btn hover:bg-bcc-btn-h text-white text-xs font-semibold shadow-md transition-colors"
            >
              Explore Fitness & Sports
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
