# Kylin Tattoo 全网在售产品目录与 Saleor 电商架构方案

## 一、全网在线销售产品整理与深度分析

通过对专业纹身器材供应商（如 [Nuclear Tattoo Supply](https://nucleartattoosupply.com)）、跨境电商渠道（[eBay - kylintattoo](https://www.ebay.com/usr/kylintattoo)、[AliExpress](https://www.aliexpress.com)）以及纹身师论坛与评测社区的全面检索，Kylin Tattoo（麒麟纹身器材）是以**高端精密马达纹身笔、手工失蜡法黄铜纹身机、CNC轻量化旋转机及精密改装配件**为核心的技术驱动型专业品牌。

---

### 1. 核心在售硬件矩阵 (Hardware & Machines)

#### (1) 高端马达一体笔 / 无线纹身笔 (Rotary & Wireless Pens)
* **E30 Maxon Brushless Motor 钛合金一体笔**
  - **核心特点**：瑞士顶级 Maxon 无刷马达（高扭矩、极低发热、长寿命）、航空钛合金机身、低震动。
  - **技术参数**：工作电压 5–12V，兼容各类通用卡针（Universal Cartridges）。
  - **参考市场价**：~$260.00 USD
* **Faulhaber 2610 德国马达纹身笔**
  - **核心特点**：德国原产 Faulhaber 2610 空心杯精密微马达，动力输出平稳柔顺，适合写实色彩与精细黑灰过渡。
  - **技术参数**：高转速 10,000–11,000 RPM，RCA 接口。
  - **参考市场价**：~$138.00 USD
* **Kylin T7max 频率可调无线纹身笔 (Frequency Adjustable)**
  - **核心特点**：支持多段频率与行程灵活调节，数显电压与电池电量，双电池续航交替。
  - **参考市场价**：~$350.00 USD
* **Kylin Billow RCA 笔型机 (Rotary Pen Machine)**
  - **核心特点**：3.5mm 与 5.0mm 多行程偏心轮版本（标准割线/重力打雾），CNC 精雕航空铝。
  - **参考市场价**：~$90.00 – $250.00 USD
* **Kylin BL1 磁力/马达纹身笔**
  - **核心特点**：搭载日本定制磁驱马达，回弹反馈细腻，大幅减轻长时间刺青的手腕疲劳。
  - **参考市场价**：~$70.00 – $110.00 USD
* **Kylin 普及型无线旋转笔 (AliExpress/Lazada 等渠道)**
  - **核心特点**：12V 12,000 RPM 马达，800mAh–2400mAh 电池配置，面向便携纹身及 PMU 纹绣师。
  - **参考市场价**：~$50.00 – $90.00 USD

---

#### (2) 手工失蜡铸造黄铜机与弹片机 (Handmade Brass & Shrapnel Machines)
* **Kylin Handmade Brass Series (型号: R07, 20128, 201202)**
  - **工艺材质**：传统 65 纯黄铜精密失蜡铸造（Lost-wax Casting），手工打磨拉丝，9–10 Wrap 手工绕制纯铜线圈。
  - **定位**：传统割线机（Liner）与重雾机（Shader），深受传统风格纹身师与设备收藏家青睐。
  - **参考市场价**：~$149.00 USD
* **Kylin Black Ghost (黑鬼) 黄铜手工重锤机**
  - **工艺材质**：手工 65 黄铜框架，复古古法发蓝/药水旧化工艺处理，击打沉稳有力，出针干脆。
  - **参考市场价**：~$250.00 USD
* **Kylin T3 黄铜弹片马达机 (Shrapnel Rotary)**
  - **核心特点**：高品质黄铜 CNC 框架，特制高韧性弹片传动系统，兼具线圈机的弹动机感与马达机的静音耐用。
  - **参考市场价**：~$110.00 USD
* **Kylin M416 航空铝轻量化机**
  - **核心特点**：7075 高强度航空铝 CNC 精雕，极度轻量化设计，适合大面积打雾作业。
  - **参考市场价**：~$85.00 – $120.00 USD

---

#### (3) 专用精密改装配件与维修套件 (Components & Kits)
* **偏心轮轴承套件 (Stroke Bearing Cams)**
  - **规格**：提供 3.5mm、4.2mm、5.0mm 等行程偏心轮，供纹身师改装 Bishop 等旋转机或 Kylin 本地机型。
  - **参考市场价**：~$25.00 USD / 单件
* **Kylin 纹身机维修与组装套件 (Parts Kit)**
  - **Kit 1**：全套绝缘圈、银接线柱、接触螺丝、调校螺栓（~$129.00 USD）
  - **Kit 2 (with Coils)**：带纯铜线圈与定制电容的基础维护套装（~$99.00 USD）
* **供电与线材**：RCA 纯铜硅胶软线、超薄脚踏开关、T3 便携即插式 RCA 锂电池电源。

---

## 二、面向 Saleor 的商品数据模型 (Data Schema)

Saleor 是基于 GraphQL 的专业 Headless 电商引擎，具有高度灵活的 ProductType、Attribute 以及多渠道多货币能力。针对 Kylin Tattoo 的专业硬件特性，建议设计以下数据结构：

### 1. 分类层级 (Category Hierarchy)
```text
Catalog Root
├── 01 Machines (纹身主机)
│   ├── Wireless Pens (无线马达一体笔)
│   ├── RCA Pens (有线精密一体笔)
│   ├── Handmade Brass & Coil (手工黄铜及线圈机)
│   └── Shrapnel & Rotary (弹片及轻量化马达机)
├── 02 Machine Parts & Accessories (精密配件与改装部件)
│   ├── Stroke Cams & Bearings (偏心轮轴承)
│   ├── Rebuild & Maintenance Kits (维修翻新套件)
│   └── Coils & Hardware (线圈及五金零件)
└── 03 Power Supplies & Cables (电源与连接线)
    ├── Battery Packs (即插式锂电池电源)
    └── RCA Cables & Pedals (高级硅胶线及脚踏)
```

### 2. 产品类型 (Product Types) 与 属性定义 (Attributes)

| 产品类型 (Product Type) | 属性名称 (Attribute) | 类型 (Input Type) | 可选值 (Values) | 是否变体属性 |
| :--- | :--- | :--- | :--- | :--- |
| **`Tattoo Pen Machine`** | `Motor Brand` (马达品牌) | Dropdown | Maxon Brushless, Faulhaber, Coreless, Japanese Magnetic | 否 (商品级) |
| | `Stroke Length` (出针行程) | Dropdown | 2.5mm, 3.5mm, 4.2mm, 5.0mm, Adjustable | **是 (变体级)** |
| | `Color / Finish` (外观配色) | Dropdown / Color | Matte Black, Space Grey, Raw Titanium, Crimson Red | **是 (变体级)** |
| | `Connection` (连接方式) | Multiselect | RCA, Wireless Battery | **是 (变体级)** |
| | `Frame Material` (机身材质) | Dropdown | Titanium Alloy, 7075 Aviation Aluminum | 否 (商品级) |
| | `Operating Voltage` | Text | 5V - 12V | 否 |
| **`Handmade Brass Machine`**| `Tuning Type` (出厂调校) | Dropdown | Liner (割线), Shader (打雾), Color Packer (填色) | **是 (变体级)** |
| | `Coil Wraps` (线圈匝数) | Dropdown | 8 Wraps, 10 Wraps, 12 Wraps | 否 |
| | `Craft Finish` (工艺表面) | Dropdown | Hand Polished Brass, Antique Blue, Distressed Black | **是 (变体级)** |
| **`Machine Parts`** | `Compatibility` (适配机型) | Multiselect | Kylin Billow, Bishop Rotary, Universal Coil | 否 |
| | `Part Size / Spec` | Dropdown | 3.5mm Cam, 4.2mm Cam, 5.0mm Cam | **是 (变体级)** |

---

## 三、基于 Saleor 的电商网站系统搭建方案

```text
               +-------------------------------------------------------+
               |              Cloudflare CDN / DNS                     |
               +-------------------------------------------------------+
                                    |
                    +---------------+---------------+
                    |                               |
        (Browser / Mobile Web)            (Admin / Store Ops)
                    |                               |
                    v                               v
       +-------------------------+     +-------------------------+
       |   Next.js Storefront    |     |    Saleor Dashboard     |
       |  (Tailwind, GraphQL,    |     |  (React, Vite, GraphQL) |
       |   App Router, i18n)     |     +-------------------------+
       +-------------------------+                  |
                    |                               |
                    +---------------+---------------+
                                    |
                         (GraphQL HTTPS / WSS)
                                    v
       +---------------------------------------------------------+
       |                      Saleor Core                        |
       |           (Python 3.12, Django, GraphQL API)            |
       |     - Multi-channel: USD ($), EUR (€), GBP (£)          |
       |     - Multi-warehouse: Global Express, Direct Warehouse |
       |     - Taxes & Customs, Order & Checkout Engine          |
       +---------------------------------------------------------+
                    |                               |
          +---------+---------+           +---------+---------+
          |                   |           |                   |
          v                   v           v                   v
   +--------------+    +--------------+  +-----------------+  +-----------------+
   |  PostgreSQL  |    | Redis Cache  |  |  Stripe/PayPal  |  | DHL/FedEx/EasyPost
   |  (Database)  |    | & Celery Q   |  |  (Payments App) |  | (Shipping App)  |
   +--------------+    +--------------+  +-----------------+  +-----------------+
```

### 1. 核心技术栈选型
1. **电商核心后端 (Backend Engine)**:
   - **Saleor Core** (开源无头电商 API，基于 Python Django + Strawberry GraphQL)。
   - **数据库与中间件**：PostgreSQL 16 + Redis (缓存与 Celery 异步任务队列)。
2. **管理后台 (Admin Dashboard)**:
   - **Saleor Dashboard** (基于 React + TypeScript，支持多语言、商品变体批量维护、订单履约管理)。
3. **品牌独立站前台 (Storefront)**:
   - **Saleor Next.js Storefront** (Next.js 14/15 + TailwindCSS + Apollo/Urql GraphQL Client)，支持极速 SSR/SSG，SEO 极佳，适配移动端和暗黑工业风（专为纹身艺术群体打造的品牌调性）。
4. **跨境支付与物流插件 (Saleor Apps)**:
   - **Payment**：接入 Saleor Stripe App 与 PayPal App（支持多币种即时结算）。
   - **Shipping**：接入 EasyPost / ShipStation App，支持 DHL / FedEx 全球运费自动实时计算与运单单号推送。

---

## 四、落地实施计划 (Action Plan)

1. **阶段一：数据底座构建 (Data Seeding)**
   - 建立结构化商品种子文件（包含商品名称、SKU、描述、规格属性、高清图片链接及多币种定价）。
   - 编写 Saleor GraphQL 批量导入脚本（自动化创建 ProductTypes、Attributes、Categories、Products 与 Variants）。
2. **阶段二：环境部署与容器编排**
   - 编写 `docker-compose.yml`，包含 `saleor-core`、`saleor-dashboard`、`postgres`、`redis`、`jaeger` 等服务。
3. **阶段三：前台定制开发与品牌视觉包装**
   - 定制 Next.js Storefront 品牌主题：深灰与黄铜金属风，契合 Kylin 机械硬核工艺品质。
   - 针对专业纹身器材增加“行程对比 (Stroke Comparison)”与“马达技术规格 (Motor Specs)”特色筛选器。
4. **阶段四：支付、物流与联调上线**
   - 配置海外通道与 Webhooks，完成测试订单与自动化履约。
