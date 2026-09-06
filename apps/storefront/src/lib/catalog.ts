import { KylinProduct, ProductVariant } from '../types';

export const SALEOR_GRAPHQL_ENDPOINT =
  import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8002/graphql/';
export const SALEOR_CHANNEL =
  import.meta.env.VITE_SALEOR_CHANNEL || 'default-channel';

export const INITIAL_PRODUCTS: KylinProduct[] = [
  {
    id: 'UHJvZHVjdDox',
    slug: 'kylin-e30-titanium-maxon',
    name: 'Kylin E30 Titanium Maxon Brushless Pen',
    nameZh: 'Kylin E30 钛合金 Maxon 无刷马达笔',
    categorySlug: 'machines',
    categoryName: 'Machines',
    categoryNameZh: '纹身主机',
    type: 'pen',
    description: 'Swiss Maxon medical-grade brushless core, surgical Grade 5 Titanium body. Near-zero thermal dissipation and virtually imperceptible vibration during extended lining and shading.',
    descriptionZh: '瑞士原装进口 Maxon 医用级无刷马达，航天 TC4 钛合金 CNC 精密镂空机身。超低发热、近乎零手部震动感，专为顶级纹身师严苛高强度作业打造。',
    motor: 'Swiss Maxon Brushless (12V / 11,500 RPM)',
    material: 'Grade 5 Titanium (Ti-6Al-4V)',
    voltage: '5.5V - 10.5V (Recommended 7.5V)',
    weight: '142g (Ultra Balanced)',
    strokeOptions: ['3.5mm Universal', '4.2mm Bold Liner'],
    startingPriceUsd: 260.00,
    startingPriceCny: 1850.00,
    badge: 'FLAGSHIP PRECISION',
    badgeZh: '旗舰精工',
    imageUrl: 'http://localhost:8002/media/products/e30_raw_titanium.jpg',
    media: [
      { id: 'm-e30-1', url: 'http://localhost:8002/media/products/e30_raw_titanium.jpg', alt: 'Kylin E30 Titanium Raw Finish' },
      { id: 'm-e30-2', url: 'http://localhost:8002/media/products/e30_matte_black.jpg', alt: 'Kylin E30 Matte Black' },
      { id: 'm-e30-3', url: 'http://localhost:8002/media/products/e30_space_grey.jpg', alt: 'Kylin E30 Space Grey' },
      { id: 'm-e30-4', url: 'http://localhost:8002/media/products/e30_royal_gold.jpg', alt: 'Kylin E30 Royal Gold' },
    ],
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6MQ==', name: 'Raw Titanium', nameZh: 'Raw Titanium (钛原色)', sku: 'KYLIN-E30-RAW', price: 260.00, currency: 'USD', stroke: '3.5mm (Universal Standard)', color: 'Raw Titanium', imageUrl: 'http://localhost:8002/media/products/e30_raw_titanium.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6Mg==', name: 'Matte Black', nameZh: 'Matte Black (曜石黑)', sku: 'KYLIN-E30-BLK', price: 260.00, currency: 'USD', stroke: '3.5mm (Universal Standard)', color: 'Matte Black', imageUrl: 'http://localhost:8002/media/products/e30_matte_black.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6Mw==', name: 'Space Grey', nameZh: 'Space Grey (深空灰)', sku: 'KYLIN-E30-GRY', price: 260.00, currency: 'USD', stroke: '3.5mm (Universal Standard)', color: 'Space Grey', imageUrl: 'http://localhost:8002/media/products/e30_space_grey.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6NA==', name: 'Royal Gold', nameZh: 'Royal Gold (皇家金)', sku: 'KYLIN-E30-GLD', price: 275.00, currency: 'USD', stroke: '3.5mm (Universal Standard)', color: 'Royal Gold', imageUrl: 'http://localhost:8002/media/products/e30_royal_gold.jpg' },
    ]
  },
  {
    id: 'UHJvZHVjdDoy',
    slug: 'kylin-faulhaber-2610-pen',
    name: 'Kylin Faulhaber 2610 Micro-Motor Pen',
    nameZh: 'Kylin 德国 Faulhaber 2610 空心杯微马达笔',
    categorySlug: 'machines',
    categoryName: 'Machines',
    categoryNameZh: '纹身主机',
    type: 'pen',
    description: 'German-engineered Faulhaber 2610 coreless motor delivering buttery smooth needle hits. Renowned worldwide for realistic black-and-grey portraiture and seamless gradient shading.',
    descriptionZh: '搭载德国制造 Faulhaber 2610 原装空心杯电机，丝般顺滑的出针阻尼与回弹手感，深受全球写实肖像大师推崇。',
    motor: 'German Faulhaber 2610 Coreless',
    material: '7075 Aircraft Billet Aluminum',
    voltage: '6.0V - 11.0V (Smooth Curve)',
    weight: '128g',
    strokeOptions: ['3.5mm All-Round'],
    startingPriceUsd: 138.00,
    startingPriceCny: 980.00,
    badge: 'PORTRAIT FAVORITE',
    badgeZh: '黑灰写实力作',
    imageUrl: 'http://localhost:8002/media/products/fh26_space_grey.jpg',
    media: [
      { id: 'm-fh26-1', url: 'http://localhost:8002/media/products/fh26_space_grey.jpg', alt: 'Kylin Faulhaber 2610 Space Grey' },
      { id: 'm-fh26-2', url: 'http://localhost:8002/media/products/fh26_matte_black.jpg', alt: 'Kylin Faulhaber 2610 Matte Black' },
      { id: 'm-fh26-3', url: 'http://localhost:8002/media/products/fh26_royal_gold.jpg', alt: 'Kylin Faulhaber 2610 Royal Gold' },
    ],
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6NQ==', name: 'Space Grey', nameZh: 'Space Grey (深空灰)', sku: 'KYLIN-FH26-GRY', price: 138.00, currency: 'USD', stroke: '3.5mm (Universal Standard)', color: 'Space Grey', imageUrl: 'http://localhost:8002/media/products/fh26_space_grey.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6Ng==', name: 'Matte Black', nameZh: 'Matte Black (哑光黑)', sku: 'KYLIN-FH26-BLK', price: 138.00, currency: 'USD', stroke: '3.5mm (Universal Standard)', color: 'Matte Black', imageUrl: 'http://localhost:8002/media/products/fh26_matte_black.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6Nw==', name: 'Royal Gold', nameZh: 'Royal Gold (荣耀金)', sku: 'KYLIN-FH26-GLD', price: 145.00, currency: 'USD', stroke: '3.5mm (Universal Standard)', color: 'Royal Gold', imageUrl: 'http://localhost:8002/media/products/fh26_royal_gold.jpg' },
    ]
  },
  {
    id: 'UHJvZHVjdDoz',
    slug: 'kylin-t7max-wireless-pen',
    name: 'Kylin T7max Wireless Variable-Stroke Pen',
    nameZh: 'Kylin T7max 调频调行程双电无线笔',
    categorySlug: 'machines',
    categoryName: 'Machines',
    categoryNameZh: '纹身主机',
    type: 'pen',
    description: 'Instant on-the-fly stroke click adjustment (2.4mm to 4.2mm). Integrated OLED diagnostic telemetry, dual magnetic 2000mAh swappable power cells for continuous 14-hour sessions.',
    descriptionZh: '支持在作业中即时旋钮微调行程深度（2.4mm–4.2mm 无级调节）。高清 OLED 显示屏，搭配两块磁吸高容量电池，无限续航无拘无束。',
    motor: 'High-Torque Custom Coreless',
    material: 'Hard-Anodized Aluminum Alloy',
    voltage: '4.5V - 12.0V Digital Steps',
    weight: '185g (With Battery)',
    strokeOptions: ['2.4mm - 4.2mm Click Dial'],
    startingPriceUsd: 350.00,
    startingPriceCny: 2480.00,
    badge: 'WIRELESS DUAL-CELL',
    badgeZh: '双电无线机王',
    imageUrl: 'http://localhost:8002/media/products/t7max_wireless_real.png',
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6OA==', name: 'Matte Black (Dual Battery)', nameZh: 'Matte Black (曜石黑 - 双电)', sku: 'KYLIN-T7M-BLK', price: 350.00, currency: 'USD', stroke: 'Adjustable', color: 'Matte Black', imageUrl: 'http://localhost:8002/media/products/t7max_wireless_real.png' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6OQ==', name: 'Space Grey (Dual Battery)', nameZh: 'Space Grey (深空灰 - 双电)', sku: 'KYLIN-T7M-GRY', price: 350.00, currency: 'USD', stroke: 'Adjustable', color: 'Space Grey', imageUrl: 'http://localhost:8002/media/products/t7max_wireless_real.png' },
    ]
  },
  {
    id: 'UHJvZHVjdDo0',
    slug: 'kylin-black-ghost-handmade-brass',
    name: 'Kylin Black Ghost Handmade Brass Machine',
    nameZh: 'Kylin 黑鬼 手工失蜡纯黄铜发蓝旧化重锤机',
    categorySlug: 'machines',
    categoryName: 'Machines',
    categoryNameZh: '纹身主机',
    type: 'brass',
    description: 'Handcrafted lost-wax casting in solid 65-brass with heritage blue chemical patina. Hand-wound 10-wrap OFC copper coils delivering authoritative, unyielding single-pass lining.',
    descriptionZh: '65 纯黄铜古法失蜡精细铸造，表面施以古法化学药水发蓝做旧。10 圈高纯无氧铜手工缠绕线圈，击打坚决沉着，传统美式割线与大图必备利器。',
    motor: '10-Wrap Hand-Wound OFC Coils & Sterling Silver Contact',
    material: 'Cast 65 Brass w/ Antique Patina',
    voltage: '6.5V - 9.0V (Analog Frequency)',
    weight: '235g (Heavy Hitting Stance)',
    strokeOptions: ['Fixed Long Throw (Heavy Hit)'],
    startingPriceUsd: 250.00,
    startingPriceCny: 1780.00,
    badge: 'MASTERPIECE COIL',
    badgeZh: '传统失蜡名器',
    imageUrl: 'http://localhost:8002/media/products/black_ghost_real_blue.jpg',
    media: [
      { id: 'm-bg-1', url: 'http://localhost:8002/media/products/black_ghost_real_blue.jpg', alt: 'Kylin Black Ghost Antique Blue Liner' },
      { id: 'm-bg-2', url: 'http://localhost:8002/media/products/black_ghost_real_macro.jpg', alt: 'Kylin Black Ghost Precision Macro Detail' },
      { id: 'm-bg-3', url: 'http://localhost:8002/media/products/black_ghost_brass.jpg', alt: 'Kylin Black Ghost Raw Brass Vintage' },
    ],
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTA=', name: 'Antique Blue (Liner)', nameZh: 'Antique Blue (古法药水发蓝 / 割线)', sku: 'KYLIN-BG-LINER-BLU', price: 250.00, currency: 'USD', tuning: 'Liner', tuningZh: 'Liner (割线专用)', color: 'Antique Blue', imageUrl: 'http://localhost:8002/media/products/black_ghost_real_blue.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTE=', name: 'Antique Blue (Shader)', nameZh: 'Antique Blue (古法药水发蓝 / 打雾)', sku: 'KYLIN-BG-SHADER-BLU', price: 250.00, currency: 'USD', tuning: 'Shader', tuningZh: 'Shader (打雾专用)', color: 'Antique Blue', imageUrl: 'http://localhost:8002/media/products/black_ghost_real_macro.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTI=', name: 'Raw Brass (Liner)', nameZh: 'Raw Brass (原色复古铜)', sku: 'KYLIN-BG-RAW-BRS', price: 250.00, currency: 'USD', tuning: 'Liner', tuningZh: 'Liner (割线专用)', color: 'Polished Brass', imageUrl: 'http://localhost:8002/media/products/black_ghost_brass.jpg' },
    ]
  },
  {
    id: 'UHJvZHVjdDo1',
    slug: 'kylin-r07-polished-brass',
    name: 'Kylin R07 Handcrafted Polished Brass Machine',
    nameZh: 'Kylin R07 经典镜面手工抛光黄铜机',
    categorySlug: 'machines',
    categoryName: 'Machines',
    categoryNameZh: '纹身主机',
    type: 'brass',
    description: 'The archetype coil machine. High-polish mirror finish with brushed accents. 8-wrap tuned coils for lightning-quick needle snaps and crisp lines.',
    descriptionZh: '经典 R07 骨架设计，纯黄铜手工抛光与微拉丝双重工艺。8 圈高导磁手工线圈，出针迅猛干脆，线条笔直扎实。',
    motor: '8-Wrap Precision Japanese Wire Coils',
    material: 'Mirror-Polished Solid Brass',
    voltage: '6.0V - 8.5V',
    weight: '210g',
    strokeOptions: ['Medium Throw Liner'],
    startingPriceUsd: 149.00,
    startingPriceCny: 1050.00,
    badge: 'HERITAGE CRAFT',
    badgeZh: '纯手工经典',
    imageUrl: 'http://localhost:8002/media/products/r07_polished.png',
    media: [
      { id: 'm-r07-1', url: 'http://localhost:8002/media/products/r07_polished.png', alt: 'Kylin R07 Mirror-Polished Solid Brass' },
      { id: 'm-r07-2', url: 'http://localhost:8002/media/products/r07_patina.jpg', alt: 'Kylin R07 Antique Vintage Patina' },
    ],
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTM=', name: 'Polished Brass', nameZh: 'Polished Brass (镜面纯黄铜)', sku: 'KYLIN-R07-LINER-BRS', price: 149.00, currency: 'USD', tuning: 'Liner', tuningZh: 'Liner (割线专用)', color: 'Polished Brass', imageUrl: 'http://localhost:8002/media/products/r07_polished.png' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTQ=', name: 'Antique Vintage Patina', nameZh: 'Antique Vintage Patina (复古氧化铜)', sku: 'KYLIN-R07-VINTAGE', price: 159.00, currency: 'USD', tuning: 'Liner', tuningZh: 'Liner (割线专用)', color: 'Antique Blue', imageUrl: 'http://localhost:8002/media/products/r07_patina.jpg' },
    ]
  },
  {
    id: 'UHJvZHVjdDo2',
    slug: 'kylin-precision-stroke-cam',
    name: 'Kylin Precision Stroke Cam Bearing Assembly',
    nameZh: 'Kylin 纯钢微型高速偏心轮轴承改装件',
    categorySlug: 'parts-and-cams',
    categoryName: 'Parts & Cams',
    categoryNameZh: '配件与偏心轮',
    type: 'part',
    description: 'German high-speed micro-bearing pressed into hardened surgical steel eccentric cam. Cross-compatible with Kylin rotary machines and custom Bishop rotary builds.',
    descriptionZh: '德国微型高速防尘轴承，配合淬火纯钢偏心轮。出针同轴度极高无侧摆，完美兼容 Kylin 旋转机与 Bishop 架构机型改装。',
    motor: 'German High-RPM Sealed Bearings',
    material: 'Hardened Tooling Steel',
    voltage: 'N/A (Mechanical)',
    weight: '18g',
    strokeOptions: ['3.5mm Universal', '4.2mm Long Throw', '5.0mm Heavy Hit'],
    startingPriceUsd: 38.00,
    startingPriceCny: 268.00,
    badge: 'PRECISION MOD',
    badgeZh: '改装升级必备',
    imageUrl: 'http://localhost:8002/media/products/cam_bearing.png',
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTU=', name: 'Titanium Eccentric Cam 3.5mm', sku: 'KYLIN-PART-CAM-35', price: 38.00, currency: 'USD', stroke: '3.5mm', imageUrl: 'http://localhost:8002/media/products/cam_bearing.png' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTY=', name: 'Direct-Drive High-Impact Cam 4.2mm', sku: 'KYLIN-PART-CAM-42', price: 42.00, currency: 'USD', stroke: '4.2mm', imageUrl: 'http://localhost:8002/media/products/cam_bearing.png' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTc=', name: 'Extreme Power Stroke Cam 5.0mm', sku: 'KYLIN-PART-CAM-50', price: 45.00, currency: 'USD', stroke: '5.0mm', imageUrl: 'http://localhost:8002/media/products/cam_bearing.png' },
    ]
  },
  {
    id: 'UHJvZHVjdDo3',
    slug: 'kylin-precision-motors',
    name: 'Kylin Precision Replacement Motor Units',
    nameZh: 'Kylin 原装高转速空心杯替换电机模组',
    categorySlug: 'parts-and-cams',
    categoryName: 'Parts & Cams',
    categoryNameZh: '配件与偏心轮',
    type: 'part',
    description: 'Factory-tested coreless micro-motors for direct drop-in replacement. Provides vibration-free rotational velocity up to 11,500 RPM under load.',
    descriptionZh: '原厂严选空心杯微型马达，带预焊防折断硅胶引线，负载转速高达 11,500 RPM，无震动、极速启动，换装即可满血复活。',
    motor: 'Coreless Micro DC Motor (9V-12V)',
    material: 'Rare-Earth Neodymium Magnet & Copper',
    voltage: '6.0V - 12.0V',
    weight: '32g',
    strokeOptions: ['Universal Shaft Fitting'],
    startingPriceUsd: 68.00,
    startingPriceCny: 480.00,
    badge: 'OEM MOTOR CORE',
    badgeZh: '原厂核心动力',
    imageUrl: 'http://localhost:8002/media/products/needle_cartridge.jpg',
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTI=', name: 'Mabuchi High-Torque Custom Core', sku: 'KYLIN-MOT-MABUCHI', price: 68.00, currency: 'USD', imageUrl: 'http://localhost:8002/media/products/needle_cartridge.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTM=', name: 'Faulhaber 2610 Replacement Unit', sku: 'KYLIN-MOT-FH2610', price: 135.00, currency: 'USD', imageUrl: 'http://localhost:8002/media/products/needle_cartridge.jpg' },
    ]
  },
  {
    id: 'UHJvZHVjdDo4',
    slug: 'kylin-power-battery-dock',
    name: 'Kylin Power Batteries & Smart Charging Docks',
    nameZh: 'Kylin 模块化无线锂电池与双槽闪充底座',
    categorySlug: 'parts-and-cams',
    categoryName: 'Parts & Cams',
    categoryNameZh: '配件与偏心轮',
    type: 'part',
    description: 'High-density 2000mAh magnetic battery cells with intelligent USB-C PD fast-charge protocol. Dual dock features real-time voltage and temperature diagnostics.',
    descriptionZh: '2000mAh 高能量密度磁吸锂电池组，配合双槽快充机座。支持 PD 30W 极速补能，具备独立过充与温控安全保护芯片。',
    motor: 'N/A (Power Supply)',
    material: 'Matte Anodized Aluminum Base & Fireproof PC',
    voltage: 'USB-C PD 5V/9V Input, 4V-12V Output',
    weight: '110g',
    strokeOptions: ['Modular Snap-On'],
    startingPriceUsd: 59.00,
    startingPriceCny: 420.00,
    badge: 'ENDURANCE POWER',
    badgeZh: '持久续航动力',
    imageUrl: 'http://localhost:8002/media/products/kylin_smart_power_battery.jpg',
    media: [
      { id: 'm-bat-1', url: 'http://localhost:8002/media/products/kylin_smart_power_battery.jpg', alt: 'T7max Wireless Li-Po Battery Pack' },
      { id: 'm-bat-2', url: 'http://localhost:8002/media/products/dock_flight_case.jpg', alt: 'Studio Dual-Slot Quick Charging Dock' },
    ],
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTQ=', name: 'T7max Wireless Li-Po Battery Pack 1800mAh', sku: 'KYLIN-BAT-T7', price: 59.00, currency: 'USD', imageUrl: 'http://localhost:8002/media/products/kylin_smart_power_battery.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTU=', name: 'Studio Dual-Slot Quick Charging Dock', sku: 'KYLIN-DOCK-DUAL', price: 75.00, currency: 'USD', imageUrl: 'http://localhost:8002/media/products/dock_flight_case.jpg' },
    ]
  },
  {
    id: 'UHJvZHVjdDo5',
    slug: 'kylin-cables-hardware',
    name: 'Kylin Studio Cables & Machine Hardware Kits',
    nameZh: 'Kylin 24K 镀金超软 RCA 勾线与高弹弹片配件包',
    categorySlug: 'parts-and-cams',
    categoryName: 'Parts & Cams',
    categoryNameZh: '配件与偏心轮',
    type: 'part',
    description: 'Studio-grade ultra-flexible pure copper silicone RCA cables with 24K gold-plated connectors. Includes Japanese spring steel replacements for coil tuning.',
    descriptionZh: '24K 镀金纯铜 90 度直角 RCA 接口，加粗无氧铜超软抗冻硅胶线身。内附日本进口高弹锰钢弹片组与纯银触点螺丝。',
    motor: 'N/A (Wiring Hardware)',
    material: 'Pure OFC Copper, 24K Gold Plate, Blue Tempered Steel',
    voltage: 'Zero Voltage Drop (<0.02V)',
    weight: '65g',
    strokeOptions: ['Universal Fitment'],
    startingPriceUsd: 28.00,
    startingPriceCny: 198.00,
    badge: 'STUDIO ESSENTIAL',
    badgeZh: '工作室精配耗材',
    imageUrl: 'http://localhost:8002/media/products/cables_rca.jpg',
    variants: [
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTY=', name: '90° 24K Gold-Plated RCA Cable 2.5m', sku: 'KYLIN-RCA-GOLD', price: 28.00, currency: 'USD', imageUrl: 'http://localhost:8002/media/products/cables_rca.jpg' },
      { id: 'UHJvZHVjdFZhcmlhbnQ6MTc=', name: 'Tempered Spring Steel & Silver Contact Kit', sku: 'KYLIN-SPRING-KIT', price: 22.00, currency: 'USD', imageUrl: 'http://localhost:8002/media/products/cables_rca.jpg' },
    ]
  }
];

export async function fetchSaleorProducts(channel: string = SALEOR_CHANNEL): Promise<KylinProduct[]> {
  try {
    const query = `
      query GetKylinCatalog($channel: String!) {
        products(first: 50, channel: $channel) {
          edges {
            node {
              id
              name
              slug
              category {
                name
                slug
              }
              media {
                id
                url
                alt
              }
              variants {
                id
                name
                sku
                media {
                  id
                  url
                  alt
                }
                pricing {
                  price {
                    gross {
                      amount
                      currency
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch(SALEOR_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { channel } }),
    });

    const data = await res.json();
    const edges = data?.data?.products?.edges;

    if (!edges || edges.length === 0) {
      console.warn('No products returned from Saleor, fallback to static catalog');
      return INITIAL_PRODUCTS;
    }

    console.log('✅ Fetched live Saleor GraphQL catalog:', edges.length, 'products');

    // Create a lookup map of INITIAL_PRODUCTS by slug for rich metadata enrichment
    const initialMap = new Map<string, KylinProduct>(
      INITIAL_PRODUCTS.map(p => [p.slug, p])
    );

    const mappedProducts: KylinProduct[] = edges.map(({ node }: any) => {
      const initial = initialMap.get(node.slug);

      const variants: ProductVariant[] = (node.variants || []).map((v: any) => {
        const initialVariant = initial?.variants.find(iv => iv.sku === v.sku || iv.name === v.name);
        const price = v.pricing?.price?.gross?.amount ?? initialVariant?.price ?? 0;
        const currency = v.pricing?.price?.gross?.currency ?? 'USD';
        const liveVariantMediaUrl = v.media && v.media.length > 0 ? v.media[0].url : null;
        const imageUrl = liveVariantMediaUrl || initialVariant?.imageUrl;

        return {
          id: v.id, // REAL Saleor GraphQL ID e.g. UHJvZHVjdFZhcmlhbnQ6MQ==
          name: initialVariant?.name || v.name,
          nameZh: initialVariant?.nameZh || v.name,
          sku: v.sku,
          price,
          currency,
          stroke: initialVariant?.stroke,
          color: initialVariant?.color,
          tuning: initialVariant?.tuning,
          tuningZh: initialVariant?.tuningZh,
          imageUrl,
        };
      });

      const startingPrice = variants.length > 0
        ? Math.min(...variants.map(v => v.price))
        : (initial?.startingPriceUsd ?? 0);

      const categorySlug = (node.category?.slug || initial?.categorySlug || 'machines') as KylinProduct['categorySlug'];
      const categoryName = node.category?.name || initial?.categoryName || 'Machines';

      // Pick live GraphQL media URL if available, fallback to high-definition static URL
      const liveMediaUrl = node.media && node.media.length > 0 ? node.media[0].url : null;
      const imageUrl = liveMediaUrl || initial?.imageUrl || 'http://localhost:8002/media/products/e30_raw_titanium.jpg';

      const media = node.media && node.media.length > 0
        ? node.media.map((m: any) => ({ id: m.id, url: m.url, alt: m.alt }))
        : initial?.media || [{ id: 'hero-1', url: imageUrl, alt: node.name }];

      return {
        id: node.id, // REAL Saleor GraphQL Product ID
        slug: node.slug,
        name: node.name,
        nameZh: initial?.nameZh || node.name,
        categorySlug,
        categoryName,
        categoryNameZh: initial?.categoryNameZh || categoryName,
        type: initial?.type || (categorySlug === 'parts-and-cams' ? 'part' : 'pen'),
        description: initial?.description || '',
        descriptionZh: initial?.descriptionZh || '',
        motor: initial?.motor,
        material: initial?.material,
        voltage: initial?.voltage,
        weight: initial?.weight,
        strokeOptions: initial?.strokeOptions || [],
        startingPriceUsd: startingPrice,
        startingPriceCny: initial?.startingPriceCny || startingPrice * 7.1,
        badge: initial?.badge,
        badgeZh: initial?.badgeZh,
        imageUrl,
        media,
        variants: variants.length > 0 ? variants : (initial?.variants || []),
      };
    });

    return mappedProducts;
  } catch (err) {
    console.warn('Saleor Core not reachable, using embedded catalog sync:', err);
    return INITIAL_PRODUCTS;
  }
}
