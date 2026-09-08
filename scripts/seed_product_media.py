#!/usr/bin/env python3
"""
Kylin Tattoo 官方商品媒体与变体专属颜色高清大图注入脚本
将真实的专业纹身笔（多色阳极氧化/钛合金）、手工失蜡黄铜机、航模级RCA线材与配件
全面绑定至 Saleor ProductMedia 与 VariantMedia。
"""

import os
import sys

SALEOR_ROOT = os.environ.get(
    "SALEOR_ROOT",
    "/app" if os.path.exists("/app/saleor") else os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "apps/saleor-core")
)
if SALEOR_ROOT not in sys.path:
    sys.path.insert(0, SALEOR_ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "saleor.settings")
import django
django.setup()

from django.core.files import File
from saleor.product.models import Product, ProductVariant, ProductMedia, VariantMedia
from saleor.product import ProductMediaTypes

MEDIA_DIR = os.path.join(SALEOR_ROOT, "media/products")

# 1. 产品主图配置表 (Hero Image)
PRODUCT_HERO_SPECS = [
    {
        "slug": "kylin-e30-titanium-maxon",
        "filename": "e30_raw_titanium.jpg",
        "alt": "Kylin E30 Titanium Maxon Brushless Rotary Pen",
    },
    {
        "slug": "kylin-faulhaber-2610-pen",
        "filename": "fh26_space_grey.jpg",
        "alt": "Kylin Faulhaber 2610 Micro-Motor Rotary Pen",
    },
    {
        "slug": "kylin-t7max-wireless-pen",
        "filename": "t7max_wireless_real.png",
        "alt": "Kylin T7max Wireless Variable-Stroke Tattoo Pen & Dual Battery Dock",
    },
    {
        "slug": "kylin-black-ghost-handmade-brass",
        "filename": "black_ghost_real_blue.jpg",
        "alt": "Kylin Black Ghost (黑鬼) Antique Blue Handmade Coil Tattoo Machine",
    },
    {
        "slug": "kylin-r07-polished-brass",
        "filename": "r07_polished.png",
        "alt": "Kylin R07 Handcrafted Mirror-Polished Solid Brass Coil Machine",
    },
    {
        "slug": "kylin-cables-hardware",
        "filename": "cables_rca.jpg",
        "alt": "Kylin Studio 24K Gold RCA Cables & Machine Hardware Kits",
    },
    {
        "slug": "kylin-power-battery-dock",
        "filename": "kylin_smart_power_battery.jpg",
        "alt": "Kylin Power Modular Batteries & Dual Slot Fast Charging Dock",
    },
    {
        "slug": "kylin-precision-motors",
        "filename": "needle_cartridge.jpg",
        "alt": "Kylin Precision Coreless Replacement Micro-Motors & Cartridge Units",
    },
    {
        "slug": "kylin-precision-stroke-cam",
        "filename": "cam_bearing.png",
        "alt": "Kylin Precision Stroke Cam Bearing Assembly Kit",
    },
]

# 2. 变体颜色/规格专属媒体表 (Variant-specific Color Finishes)
VARIANT_MEDIA_SPECS = [
    # Kylin E30 Titanium (四种精密金属配色)
    {
        "sku": "KYLIN-E30-RAW",
        "filename": "e30_raw_titanium.jpg",
        "alt": "Kylin E30 Raw Titanium (钛原色)",
    },
    {
        "sku": "KYLIN-E30-BLK",
        "filename": "e30_matte_black.jpg",
        "alt": "Kylin E30 Matte Black (曜石黑)",
    },
    {
        "sku": "KYLIN-E30-GRY",
        "filename": "e30_space_grey.jpg",
        "alt": "Kylin E30 Space Grey (深空灰)",
    },
    {
        "sku": "KYLIN-E30-GLD",
        "filename": "e30_royal_gold.jpg",
        "alt": "Kylin E30 Royal Gold (皇家金)",
    },

    # Kylin Faulhaber 2610 (三种金属滚花配色)
    {
        "sku": "KYLIN-FH26-GRY",
        "filename": "fh26_space_grey.jpg",
        "alt": "Kylin Faulhaber 2610 Space Grey (深空灰)",
    },
    {
        "sku": "KYLIN-FH26-BLK",
        "filename": "fh26_matte_black.jpg",
        "alt": "Kylin Faulhaber 2610 Matte Black (哑光黑)",
    },
    {
        "sku": "KYLIN-FH26-GLD",
        "filename": "fh26_royal_gold.jpg",
        "alt": "Kylin Faulhaber 2610 Royal Gold (荣耀金)",
    },

    # Kylin T7max Wireless
    {
        "sku": "KYLIN-T7M-BLK",
        "filename": "t7max_wireless_real.png",
        "alt": "Kylin T7max Matte Black Dual Battery Suite",
    },
    {
        "sku": "KYLIN-T7M-GRY",
        "filename": "t7max_wireless_real.png",
        "alt": "Kylin T7max Space Grey Dual Battery Suite",
    },

    # Kylin Black Ghost (黑鬼手工失蜡铸铜)
    {
        "sku": "KYLIN-BG-LINER-BLU",
        "filename": "black_ghost_real_blue.jpg",
        "alt": "Kylin Black Ghost Antique Blue Liner (古法药水发蓝 / 割线)",
    },
    {
        "sku": "KYLIN-BG-SHADER-BLU",
        "filename": "black_ghost_real_macro.jpg",
        "alt": "Kylin Black Ghost Antique Blue Shader (精密宏观特写 / 打雾)",
    },
    {
        "sku": "KYLIN-BG-RAW-BRS",
        "filename": "black_ghost_brass.jpg",
        "alt": "Kylin Black Ghost Raw Brass Vintage (原色复古铜)",
    },

    # Kylin R07 经典黄铜机
    {
        "sku": "KYLIN-R07-LINER-BRS",
        "filename": "r07_polished.png",
        "alt": "Kylin R07 Mirror-Polished Solid Brass (镜面纯黄铜)",
    },
    {
        "sku": "KYLIN-R07-VINTAGE",
        "filename": "r07_patina.jpg",
        "alt": "Kylin R07 Antique Vintage Patina (复古氧化铜)",
    },

    # 配件类
    {
        "sku": "KYLIN-PART-RCA-GOLD",
        "filename": "cables_rca.jpg",
        "alt": "Kylin 90° 24K Gold-Plated Ultra-Flex RCA Cord",
    },
    {
        "sku": "KYLIN-PART-SPR-SWEDEN",
        "filename": "cables_rca.jpg",
        "alt": "Hand-Tempered Swedish Blue Spring Set",
    },
    {
        "sku": "KYLIN-PART-POST-BRASS",
        "filename": "cables_rca.jpg",
        "alt": "Carved Solid Brass Binding Post Pair",
    },
    {
        "sku": "KYLIN-PART-BAT-T7",
        "filename": "kylin_smart_power_battery.jpg",
        "alt": "T7max Wireless Li-Po Battery Pack",
    },
    {
        "sku": "KYLIN-PART-DOCK-DUAL",
        "filename": "dock_flight_case.jpg",
        "alt": "Studio Dual-Slot Quick Charging Dock",
    },
    {
        "sku": "KYLIN-PART-CAM-35",
        "filename": "cam_bearing.png",
        "alt": "Titanium Eccentric Cam 3.5mm",
    },
    {
        "sku": "KYLIN-PART-CAM-42",
        "filename": "cam_bearing.png",
        "alt": "Direct-Drive High-Impact Cam 4.2mm",
    },
    {
        "sku": "KYLIN-PART-CAM-50",
        "filename": "cam_bearing.png",
        "alt": "Extreme Power Stroke Cam 5.0mm",
    },
    {
        "sku": "KYLIN-PART-MOT-FH2610",
        "filename": "needle_cartridge.jpg",
        "alt": "Faulhaber Coreless 2610 Motor Unit",
    },
    {
        "sku": "KYLIN-PART-MOT-MABUCHI",
        "filename": "needle_cartridge.jpg",
        "alt": "Mabuchi High-Torque Custom Core",
    },
]


def run():
    print("==================================================")
    print("📸 正在清理旧媒体并注入 Kylin 官方真机高清多色媒体...")
    print("==================================================")

    # 清空所有旧的 ProductMedia 与关联（彻底消除工厂/电钻等非硬件错误配图）
    old_count = ProductMedia.objects.count()
    ProductMedia.objects.all().delete()
    print(f"🧹 已清除全部旧 ProductMedia 记录 ({old_count} 条)")

    # 1. 建立商品主图 (Hero Image)
    print("\n📦 正在写入商品官方封面主图 (Hero)...")
    for spec in PRODUCT_HERO_SPECS:
        slug = spec["slug"]
        filename = spec["filename"]
        file_path = os.path.join(MEDIA_DIR, filename)
        if not os.path.exists(file_path):
            print(f"⚠️ 文件不存在: {file_path}")
            continue

        product = Product.objects.filter(slug=slug).first()
        if not product:
            print(f"⚠️ 未找到商品: {slug}")
            continue

        with open(file_path, "rb") as f:
            media = ProductMedia.objects.create(
                product=product,
                image=File(f, name=filename),
                alt=spec["alt"],
                type=ProductMediaTypes.IMAGE,
                sort_order=0,
            )
            print(f"  ✨ 主图就绪: [{product.name}] -> {media.image.name} (ID: {media.id})")

    # 2. 建立各变体颜色/规格专属媒体与 VariantMedia 关联
    print("\n🎨 正在为各机型变体建立颜色图像关联...")
    for v_spec in VARIANT_MEDIA_SPECS:
        sku = v_spec["sku"]
        filename = v_spec["filename"]
        file_path = os.path.join(MEDIA_DIR, filename)
        if not os.path.exists(file_path):
            print(f"⚠️ 文件不存在: {file_path}")
            continue

        variant = ProductVariant.objects.filter(sku=sku).select_related("product").first()
        if not variant:
            print(f"⚠️ 未找到变体 SKU: {sku}")
            continue

        product = variant.product

        # 检查该 product 是否已经有这张图
        media = product.media.filter(image__icontains=filename).first()
        if not media:
            with open(file_path, "rb") as f:
                media = ProductMedia.objects.create(
                    product=product,
                    image=File(f, name=filename),
                    alt=v_spec["alt"],
                    type=ProductMediaTypes.IMAGE,
                    sort_order=10,
                )

        # 绑定 VariantMedia
        vm, created = VariantMedia.objects.get_or_create(variant=variant, media=media)
        status = "新增关联" if created else "已关联"
        print(f"  💎 {status}: [{product.name}] SKU={sku} -> Media ID={media.id} ({filename})")

    print("\n✅ 所有 Kylin 官方真机多色变体媒体已全部注入并绑定成功！")


if __name__ == "__main__":
    run()
