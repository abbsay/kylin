import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      brand: {
        name: "KYLIN TATTOO",
        tagline: "Precision Engineering. Uncompromising Craft.",
        subtitle: "Swiss Maxon & German Faulhaber Motors • Lost-Wax Brass Casting • Titanium Rotary Pen",
      },
      nav: {
        home: "Overview",
        products: "Machines & Hardware",
        compare: "Specs Matrix",
        gallery: "Craftsmanship",
        cart: "Cart",
      },
      hero: {
        badge: "NEW GENERATION PRO HARDWARE",
        title1: "Titanium Power.",
        title2: "Handmade Soul.",
        desc: "Engineered in titanium alloys, driven by surgical Maxon motors, and hand-tuned in lost-wax cast brass. Kylin builds the world's most disciplined tattoo hardware for master tattoo artists.",
        exploreBtn: "Explore Machines",
        specsBtn: "Compare Specs",
      },
      catalog: {
        heading: "Precision Hardware",
        subheading: "Designed with surgical tolerance. Hand-tuned for pure tattoo mastery.",
        all: "All Series",
        pens: "Rotary & Wireless Pens",
        brass: "Handmade Brass",
        parts: "Precision Cams & Parts",
        quickBuy: "Select Options",
        inStock: "In Stock",
        stroke: "Stroke",
        motor: "Motor",
        material: "Frame",
        tuning: "Tuning",
      },
      compare: {
        title: "Engineering Specs Matrix",
        subtitle: "Powered by TanStack Table: Detailed technical comparison of motors, stroke depths, operating voltages, and net weights.",
        colProduct: "Machine Model",
        colMotor: "Motor Technology",
        colStroke: "Stroke Depth",
        colMaterial: "Frame Material",
        colVoltage: "Operating Voltage",
        colWeight: "Weight",
        colPrice: "Starting Price",
      },
      cart: {
        title: "Shopping Bag",
        empty: "Your bag is currently empty.",
        subtotal: "Subtotal",
        shipping: "Free Worldwide Shipping",
        freeShippingNote: "Free Shipping • 2-4 weeks delivery (Direct from China)",
        checkout: "Checkout",
        qty: "Qty",
        remove: "Remove",
      },
      checkoutModal: {
        title: "Artist Fast Checkout",
        desc: "TanStack Form + Zod Type-safe checkout process.",
        nameLabel: "Full Name / Studio Name",
        emailLabel: "Email Address",
        phoneLabel: "Phone Number",
        addressLabel: "Shipping Destination",
        cityLabel: "City & Postal Code",
        countryLabel: "Country / Region",
        step1: "1. Studio & Shipping Address",
        step2: "2. Logistics & Payment Terms",
        selectShipping: "Select Official Logistics Service",
        selectPayment: "Payment & Settlement Terms",
        paymentTerms1: "Studio Purchase Order / Credit Card on File",
        paymentTerms2: "Official Bank Wire Transfer (USD Cleanroom)",
        authorizedPaymentDesc: "Kylin Studio Direct guarantee. Your order is registered into Saleor Core and will be dispatched with commercial customs documentation.",
        continueToDelivery: "Continue to Logistics & Payment",
        submit: "Confirm & Place Official Order",
        orderNumber: "Saleor Order Number",
        successTitle: "Order Confirmed & Placed!",
        successDesc: "Thank you. Your Kylin order is now registered into Saleor Core and prepared in our cleanroom logistics facility.",
        close: "Back to Studio",
      },
      accountPage: {
        badge: "Saleor Verified Artist Portal",
        badgeStaff: "Kylin Studio Staff / Admin",
        badgeTier: "Verified Pro Artist Tier",
        title: "Artist Portal & Hardware Orders",
        desc: "Authenticated via Saleor Core GraphQL. Manage studio hardware orders, cleanroom shipping destinations, and technical credentials.",
        backToStore: "Back to Flagship Store",
        signOut: "Sign Out",
        sessionActive: "Saleor JWT Session: Active",
        tabOverview: "Studio Overview",
        tabOrders: "Saleor Orders",
        tabAddress: "Shipping Destination",
        profileTitle: "Artist Profile & Credentials",
        profileDesc: "Official credentials registered in Saleor Core",
        studioName: "Studio / Artist Name",
        email: "Email Address",
        saleorId: "Saleor Customer ID",
        authTier: "Authentication Tier",
        statusActive: "Active & Verified",
        ordersTitle: "Hardware Procurement Orders",
        ordersDesc: "Direct dispatch from Cleanroom US logistics center",
        ordersCount: "Total Orders",
        noOrders: "No hardware orders recorded yet.",
        noOrdersDesc: "Orders placed through the Kylin Storefront or direct studio purchase orders will appear here automatically.",
        browseCatalog: "Browse Precision Machines",
        orderNumber: "Order",
        orderDate: "Date",
        orderStatus: "Status",
        orderTotal: "Gross Total",
        orderItems: "Items",
        shippingTitle: "Default Cleanroom Shipping Address",
        shippingDesc: "Destination used for DHL Express and customs documentation",
        noAddress: "No default shipping address saved yet.",
        noAddressDesc: "Your address will be automatically captured and verified during your first hardware checkout.",
        quickProcurement: "Quick Spare Parts & Tuning",
        quickProcurementDesc: "Frequently serviced high-wear components",
        signInTitle: "Artist Authentication",
        signInDesc: "Sign in to access your Kylin hardware orders and studio credentials.",
        registerTitle: "Studio Registration",
        registerDesc: "Register your studio for direct procurement access.",
        loginTab: "Artist Sign In",
        registerTab: "Register Studio",
        emailLabel: "Artist Email Address",
        passwordLabel: "Account Password (Min 8 chars)",
        signInBtn: "Sign In with Saleor JWT",
        registerBtn: "Create Studio Account",
        authenticating: "Authenticating with Saleor Core...",
        demoCredentialsNote: "Default Admin credentials for testing: admin@kylintattoo.com / KylinTattoo2026!",
      }
    }
  },
  zh: {
    translation: {
      brand: {
        name: "KYLIN 麒麟",
        tagline: "极度精工 • 传统手工之魂",
        subtitle: "瑞士 Maxon & 德国 Faulhaber 马达 • 失蜡古法黄铜铸造 • 钛合金笔型一体机",
      },
      nav: {
        home: "首页",
        products: "机型系列",
        compare: "参数对比",
        gallery: "精工艺术",
        cart: "购物袋",
      },
      hero: {
        badge: "专业级纹身器材",
        title1: "钛合金强劲动力，",
        title2: "手工失蜡之魂。",
        desc: "精选航天级 TC4 钛合金与 7075 航空铝，搭载瑞士 Maxon 高扭矩无刷马达，辅以纯手工失蜡铸造 65 黄铜框架。为全球顶级纹身大师打造可靠利器。",
        exploreBtn: "浏览全系机型",
        specsBtn: "参数对比",
      },
      catalog: {
        heading: "全系列产品",
        subheading: "手术级加工公差，为顶级刺青师手感严苛调校。",
        all: "全部产品",
        pens: "马达笔与无线机",
        brass: "手工黄铜机",
        parts: "偏心轮与套件",
        quickBuy: "选择规格",
        inStock: "现货",
        stroke: "出针行程",
        motor: "马达动力",
        material: "机身材质",
        tuning: "出厂调校",
      },
      compare: {
        title: "技术参数对比矩阵",
        subtitle: "对比马达动力、行程深度、工作电压与机身配重。",
        colProduct: "机型名称",
        colMotor: "马达核心",
        colStroke: "行程规格",
        colMaterial: "机身工艺",
        colVoltage: "推荐电压",
        colWeight: "机身自重",
        colPrice: "起订价格",
      },
      cart: {
        title: "购物袋",
        empty: "购物袋中目前没有商品。",
        subtotal: "小计",
        shipping: "全球免运费",
        freeShippingNote: "Free Shipping • 全球 2-4 周直达，中国直发",
        checkout: "前往结算",
        qty: "数量",
        remove: "移除",
      },
      checkoutModal: {
        title: "艺术家快速结算通道",
        desc: "基于 TanStack Form + Zod 类型安全校验与履约引擎。",
        nameLabel: "刺青师姓名 / 纹身工作室",
        emailLabel: "电子邮箱",
        phoneLabel: "联系电话",
        addressLabel: "收货地址",
        cityLabel: "城市与邮政编码",
        countryLabel: "国家 / 地区",
        step1: "1. 配送地址与工作室信息",
        step2: "2. 物流专线与付款条款",
        selectShipping: "选择官方物流专线",
        selectPayment: "结算与支付方式",
        paymentTerms1: "工作室采购账期 / 企业预留信用卡",
        paymentTerms2: "银行官方美元电汇 (Cleanroom USD Wire)",
        authorizedPaymentDesc: "Kylin 官方直营采购保障。订单生成后将直接写入 Saleor Core，并附带正式海关商业发票与通关单据。",
        continueToDelivery: "下一步：选择物流与支付",
        submit: "确认并提交正式订单",
        orderNumber: "Saleor 官方订单号",
        successTitle: "订单已成功提交！",
        successDesc: "感谢您的支持。您的 Kylin 专属设备现已正式录入 Saleor Core，正由洁净室物流中心精心打包调校发运。",
        close: "返回工作室",
      },
      accountPage: {
        badge: "认证艺术家专区",
        badgeStaff: "Kylin 官方管理员",
        badgeTier: "专业刺青师专属",
        title: "账户档案与订单记录",
        desc: "管理您的器材订单、收货地址与专业凭证。",
        backToStore: "返回商城",
        signOut: "退出登录",
        sessionActive: "认证状态：已激活",
        tabOverview: "概览",
        tabOrders: "订单",
        tabAddress: "收货地址",
        profileTitle: "艺术家档案",
        profileDesc: "官方登记身份信息",
        studioName: "姓名 / 工作室",
        email: "电子邮箱",
        saleorId: "客户 ID",
        authTier: "认证级别",
        statusActive: "已认证",
        ordersTitle: "订单记录",
        ordersDesc: "全球直达特快物流",
        ordersCount: "订单总数",
        noOrders: "暂无订单记录",
        noOrdersDesc: "您在商城提交的订单将自动同步于此。",
        browseCatalog: "浏览全系机型",
        orderNumber: "订单编号",
        orderDate: "下单日期",
        orderStatus: "状态",
        orderTotal: "金额",
        orderItems: "商品明细",
        shippingTitle: "默认收货地址",
        shippingDesc: "用于特快空运与海关清关",
        noAddress: "暂未保存收货地址",
        noAddressDesc: "首次下单时填写的地址将自动保存。",
        quickProcurement: "常用配件补给",
        quickProcurementDesc: "调校偏心轮与替换核心",
        signInTitle: "艺术家登录",
        signInDesc: "登录您的账户以查看订单与物流。",
        registerTitle: "创建账户",
        registerDesc: "创建专属账户以获取直供支持。",
        loginTab: "登录",
        registerTab: "注册",
        emailLabel: "邮箱地址",
        passwordLabel: "账户密码",
        signInBtn: "登录",
        registerBtn: "注册",
        authenticating: "正在验证...",
        demoCredentialsNote: "体验账户提示：管理员 admin@kylintattoo.com / KylinTattoo2026!",
      }
    }
  }
};

const getInitialLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  try {
    const userPref = localStorage.getItem('kylin_user_lang_pref');
    // Only switch to Chinese if the user explicitly clicked and selected Chinese
    if (userPref === 'zh') {
      return 'zh';
    }
    // Clear out legacy auto-detected i18nextLng from previous sessions
    localStorage.removeItem('i18nextLng');
    return 'en';
  } catch {
    return 'en';
  }
};

const initialLng = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Absolute guarantee: unless explicitly opted into Chinese, enforce English
if (typeof window !== 'undefined') {
  try {
    const userPref = localStorage.getItem('kylin_user_lang_pref');
    if (userPref !== 'zh' && i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  } catch {
    // ignore
  }
}

export default i18n;
