#!/usr/bin/env python3
"""
Kylin Tattoo 电商商品种子注入脚本 (Seed Script)
自动化初始化 Kylin Tattoo 的分类、属性、产品类型、在售核心机型与规格变体。
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

from decimal import Decimal
from django.utils import timezone
from django.utils.text import slugify
from prices import Money

from saleor.product.models import (
    Category,
    ProductType,
    Product,
    ProductVariant,
    ProductChannelListing,
    ProductVariantChannelListing,
)
from saleor.attribute.models import (
    Attribute,
    AttributeValue,
    AssignedProductAttributeValue,
    AssignedVariantAttributeValue,
)
from saleor.attribute.utils import associate_attribute_values_to_instance
from saleor.channel.models import Channel
from saleor.warehouse.models import Warehouse, Stock


def seed():
    print("🌱 正在注入 Kylin Tattoo 官方商品数据与规格分类...")

    # 1. 确保渠道存在 (USD & CNY)
    usd_channel, _ = Channel.objects.get_or_create(
        slug="default-channel",
        defaults={
            "name": "Global USD Channel",
            "currency_code": "USD",
            "is_active": True,
        }
    )

    cny_channel, _ = Channel.objects.get_or_create(
        slug="channel-cny",
        defaults={
            "name": "China CNY Channel",
            "currency_code": "CNY",
            "is_active": True,
        }
    )

    warehouse = Warehouse.objects.first()
    if not warehouse:
        warehouse = Warehouse.objects.create(
            name="Kylin Global Logistics Center",
            slug="kylin-warehouse",
        )
        warehouse.channels.add(usd_channel, cny_channel)
    else:
        warehouse.channels.add(usd_channel, cny_channel)

    # 2. 创建主分类树
    categories_data = [
        {"name": "Machines", "slug": "machines", "description": {"blocks": [{"type": "paragraph", "data": {"text": "Professional Rotary and Handmade Tattoo Machines"}}]}},
        {"name": "Parts & Cams", "slug": "parts-and-cams", "description": {"blocks": [{"type": "paragraph", "data": {"text": "Precision Stroke Cams, Hardware, and Maintenance Kits"}}]}},
        {"name": "Power & Accessories", "slug": "power-and-accessories", "description": {"blocks": [{"type": "paragraph", "data": {"text": "Wireless Battery Packs, RCA silicone cords, and pedals"}}]}},
    ]

    cat_map = {}
    for c_data in categories_data:
        cat, _ = Category.objects.get_or_create(
            slug=c_data["slug"],
            defaults={"name": c_data["name"], "description": c_data["description"]}
        )
        cat_map[c_data["slug"]] = cat
        print(f"  📁 分类就绪: {cat.name}")

    # 3. 创建核心属性
    attributes_spec = [
        {"slug": "motor-brand", "name": "Motor Type", "values": ["Maxon Brushless", "Faulhaber 2610", "Japanese Magnetic", "Coreless Precision"]},
        {"slug": "stroke-length", "name": "Stroke Length", "values": ["2.5mm (Soft Shading)", "3.5mm (Universal Standard)", "4.2mm (Bold Lining)", "5.0mm (Heavy Hitting)", "Adjustable"]},
        {"slug": "frame-material", "name": "Frame Material", "values": ["Titanium Alloy (航空钛)", "7075 Aviation Aluminum (7075航空铝)", "Handmade Cast Brass (纯黄铜失蜡铸造)"]},
        {"slug": "color-finish", "name": "Color & Finish", "values": ["Raw Titanium (钛原色)", "Matte Black (哑光黑)", "Space Grey (深空灰)", "Royal Gold (皇家金)", "Antique Blue (古法药水发蓝)", "Polished Brass (抛光黄铜)"]},
        {"slug": "tuning-type", "name": "Tuning Mode", "values": ["Liner (割线专用)", "Shader (打雾专用)", "All-Rounder (全能型)"]},
    ]

    attr_map = {}
    val_map = {}
    for a_spec in attributes_spec:
        attr, _ = Attribute.objects.get_or_create(
            slug=a_spec["slug"],
            defaults={"name": a_spec["name"], "type": "product-type"}
        )
        attr_map[a_spec["slug"]] = attr
        val_map[a_spec["slug"]] = {}
        for val_name in a_spec["values"]:
            val, _ = AttributeValue.objects.get_or_create(
                attribute=attr,
                slug=slugify(val_name)[:50],
                defaults={"name": val_name}
            )
            val_map[a_spec["slug"]][val_name] = val

    # 4. 创建 ProductTypes
    pen_pt, _ = ProductType.objects.get_or_create(
        slug="tattoo-pen-machine",
        defaults={
            "name": "Tattoo Pen Machine",
            "has_variants": True,
            "is_shipping_required": True,
        }
    )
    pen_pt.product_attributes.set([attr_map["motor-brand"], attr_map["frame-material"]])
    pen_pt.variant_attributes.set([attr_map["stroke-length"], attr_map["color-finish"]])

    brass_pt, _ = ProductType.objects.get_or_create(
        slug="handmade-brass-machine",
        defaults={
            "name": "Handmade Brass Machine",
            "has_variants": True,
            "is_shipping_required": True,
        }
    )
    brass_pt.product_attributes.set([attr_map["frame-material"]])
    brass_pt.variant_attributes.set([attr_map["tuning-type"], attr_map["color-finish"]])

    parts_pt, _ = ProductType.objects.get_or_create(
        slug="precision-parts",
        defaults={
            "name": "Precision Parts",
            "has_variants": True,
            "is_shipping_required": True,
        }
    )

    power_pt, _ = ProductType.objects.get_or_create(
        slug="power-and-accessories",
        defaults={
            "name": "Power & Accessories",
            "has_variants": True,
            "is_shipping_required": True,
        }
    )

    # 5. 产品库清单与变体
    products_catalog = [
        {
            "name": "Kylin E30 Titanium Maxon Brushless Pen",
            "name_zh": "Kylin E30 钛合金 Maxon 无刷一体机",
            "slug": "kylin-e30-titanium-maxon",
            "category": cat_map["machines"],
            "type": pen_pt,
            "description": "瑞士原装 Maxon 高功率无刷电机，航空级 TC4 钛合金 CNC 精雕机身，超低震动、无温升，支持长达 10 小时高强度持续刺青作业。",
            "base_usd": "260.00",
            "base_cny": "1850.00",
            "motor": "Maxon Brushless",
            "material": "Titanium Alloy (航空钛)",
            "variants": [
                {"name": "Raw Titanium (钛原色)", "sku": "KYLIN-E30-RAW", "stroke": "3.5mm (Universal Standard)", "color": "Raw Titanium (钛原色)", "usd": "260.00", "cny": "1850.00"},
                {"name": "Matte Black (曜石黑)", "sku": "KYLIN-E30-BLK", "stroke": "3.5mm (Universal Standard)", "color": "Matte Black (哑光黑)", "usd": "260.00", "cny": "1850.00"},
                {"name": "Space Grey (深空灰)", "sku": "KYLIN-E30-GRY", "stroke": "3.5mm (Universal Standard)", "color": "Space Grey (深空灰)", "usd": "260.00", "cny": "1850.00"},
                {"name": "Royal Gold (皇家金)", "sku": "KYLIN-E30-GLD", "stroke": "3.5mm (Universal Standard)", "color": "Royal Gold (皇家金)", "usd": "275.00", "cny": "1950.00"},
            ]
        },
        {
            "name": "Kylin Faulhaber 2610 Micro-Motor Pen",
            "name_zh": "Kylin 德国 Faulhaber 2610 精密空心杯纹身笔",
            "slug": "kylin-faulhaber-2610-pen",
            "category": cat_map["machines"],
            "type": pen_pt,
            "description": "搭载德国 Faulhaber 2610 原装空心杯微型马达，11,000 RPM，丝滑的出针回弹质感，适合精细黑灰肖像与细腻色彩过渡。",
            "base_usd": "138.00",
            "base_cny": "980.00",
            "motor": "Faulhaber 2610",
            "material": "7075 Aviation Aluminum (7075航空铝)",
            "variants": [
                {"name": "Space Grey (深空灰)", "sku": "KYLIN-FH26-GRY", "stroke": "3.5mm (Universal Standard)", "color": "Space Grey (深空灰)", "usd": "138.00", "cny": "980.00"},
                {"name": "Matte Black (哑光黑)", "sku": "KYLIN-FH26-BLK", "stroke": "3.5mm (Universal Standard)", "color": "Matte Black (哑光黑)", "usd": "138.00", "cny": "980.00"},
                {"name": "Royal Gold (荣耀金)", "sku": "KYLIN-FH26-GLD", "stroke": "3.5mm (Universal Standard)", "color": "Royal Gold (皇家金)", "usd": "145.00", "cny": "1030.00"},
            ]
        },
        {
            "name": "Kylin T7max Wireless Variable-Stroke Pen",
            "name_zh": "Kylin T7max 双电调频无线数显纹身笔",
            "slug": "kylin-t7max-wireless-pen",
            "category": cat_map["machines"],
            "type": pen_pt,
            "description": "多段行程一键旋钮切换，高清 OLED 智能数显屏实时反馈电压与频率，标配两块可拆卸 2000mAh 磁吸锂电池，永不断电。",
            "base_usd": "350.00",
            "base_cny": "2480.00",
            "motor": "Coreless Precision",
            "material": "7075 Aviation Aluminum (7075航空铝)",
            "variants": [
                {"name": "Matte Black (曜石黑 - 双电)", "sku": "KYLIN-T7M-BLK", "stroke": "Adjustable", "color": "Matte Black (哑光黑)", "usd": "350.00", "cny": "2480.00"},
                {"name": "Space Grey (深空灰 - 双电)", "sku": "KYLIN-T7M-GRY", "stroke": "Adjustable", "color": "Space Grey (深空灰)", "usd": "350.00", "cny": "2480.00"},
            ]
        },
        {
            "name": "Kylin Black Ghost (黑鬼) Handmade Brass Machine",
            "name_zh": "Kylin 黑鬼 手工失蜡纯黄铜药水发蓝复古重锤机",
            "slug": "kylin-black-ghost-handmade-brass",
            "category": cat_map["machines"],
            "type": brass_pt,
            "description": "传统失蜡法纯手工铸造 65 黄铜框架，传统古法药水发蓝旧化处理，10 Wrap 手工绕制红铜线圈，打击力沉实，传统美式割线极品。",
            "base_usd": "250.00",
            "base_cny": "1780.00",
            "material": "Handmade Cast Brass (纯黄铜失蜡铸造)",
            "variants": [
                {"name": "Antique Blue (古法药水发蓝 / 割线)", "sku": "KYLIN-BG-LINER-BLU", "tuning": "Liner (割线专用)", "color": "Antique Blue (古法药水发蓝)", "usd": "250.00", "cny": "1780.00"},
                {"name": "Antique Blue (古法药水发蓝 / 打雾)", "sku": "KYLIN-BG-SHADER-BLU", "tuning": "Shader (打雾专用)", "color": "Antique Blue (古法药水发蓝)", "usd": "250.00", "cny": "1780.00"},
                {"name": "Raw Brass (原色复古铜)", "sku": "KYLIN-BG-RAW-BRS", "tuning": "Liner (割线专用)", "color": "Polished Brass (抛光黄铜)", "usd": "250.00", "cny": "1780.00"},
            ]
        },
        {
            "name": "Kylin R07 Handcrafted Polished Brass Machine",
            "name_zh": "Kylin R07 经典手工抛光黄铜线圈机",
            "slug": "kylin-r07-polished-brass",
            "category": cat_map["machines"],
            "type": brass_pt,
            "description": "经典 R07 框架设计，精细镜面与拉丝双重黄铜质感，9 Wrap 纯手工红铜线圈，超稳定工频电磁响应。",
            "base_usd": "149.00",
            "base_cny": "1050.00",
            "material": "Handmade Cast Brass (纯黄铜失蜡铸造)",
            "variants": [
                {"name": "Polished Brass (镜面纯黄铜)", "sku": "KYLIN-R07-LINER-BRS", "tuning": "Liner (割线专用)", "color": "Polished Brass (抛光黄铜)", "usd": "149.00", "cny": "1050.00"},
                {"name": "Antique Vintage Patina (复古氧化铜)", "sku": "KYLIN-R07-VINTAGE", "tuning": "Liner (割线专用)", "color": "Antique Blue (古法药水发蓝)", "usd": "159.00", "cny": "1120.00"},
            ]
        },
        {
            "name": "Kylin Precision Stroke Cam Bearing Assembly",
            "name_zh": "Kylin 纯钢精密偏心轮轴承套件 (改装/升级)",
            "slug": "kylin-precision-stroke-cam",
            "category": cat_map["parts-and-cams"],
            "type": parts_pt,
            "description": "德国进口微型高速轴承 + 纯钢偏心轮，适配各类标准一体机及 Bishop 改装，出针平稳无晃动。",
            "base_usd": "38.00",
            "base_cny": "268.00",
            "variants": [
                {"name": "Titanium Eccentric Cam 3.5mm", "sku": "KYLIN-PART-CAM-35", "usd": "38.00", "cny": "268.00"},
                {"name": "Direct-Drive High-Impact Cam 4.2mm", "sku": "KYLIN-PART-CAM-42", "usd": "42.00", "cny": "298.00"},
                {"name": "Extreme Power Stroke Cam 5.0mm", "sku": "KYLIN-PART-CAM-50", "usd": "45.00", "cny": "318.00"},
            ]
        },
        {
            "name": "Kylin Precision Replacement Motor Units",
            "name_zh": "Kylin 精密微型马达动力模组",
            "slug": "kylin-precision-motors",
            "category": cat_map["parts-and-cams"],
            "type": parts_pt,
            "description": "德国 Faulhaber 原装空心杯与日本定制高扭矩微型马达，为专业纹身笔提供源源不断的澎湃动力与低震动输出。",
            "base_usd": "68.00",
            "base_cny": "480.00",
            "variants": [
                {"name": "Faulhaber Coreless 2610 Motor Unit", "sku": "KYLIN-PART-MOT-FH2610", "usd": "135.00", "cny": "960.00"},
                {"name": "Mabuchi High-Torque Custom Core", "sku": "KYLIN-PART-MOT-MABUCHI", "usd": "68.00", "cny": "480.00"},
            ]
        },
        {
            "name": "Kylin Power Batteries & Smart Charging Docks",
            "name_zh": "Kylin 无线锂电电源与双槽稳流充电底座",
            "slug": "kylin-power-battery-dock",
            "category": cat_map["power-and-accessories"],
            "type": power_pt,
            "description": "高密度聚合物锂电芯，支持 PD 协议快充，双路智能稳压芯片，彻底摆脱传统电源脚踏束缚。",
            "base_usd": "59.00",
            "base_cny": "420.00",
            "variants": [
                {"name": "T7max Wireless Li-Po Battery Pack 1800mAh", "sku": "KYLIN-PART-BAT-T7", "usd": "59.00", "cny": "420.00"},
                {"name": "Studio Dual-Slot Quick Charging Dock", "sku": "KYLIN-PART-DOCK-DUAL", "usd": "75.00", "cny": "530.00"},
            ]
        },
        {
            "name": "Kylin Studio Cables & Machine Hardware Kits",
            "name_zh": "Kylin 镀金勾线与手工线圈机淬火弹片五金配件套件",
            "slug": "kylin-cables-hardware",
            "category": cat_map["power-and-accessories"],
            "type": parts_pt,
            "description": "24K 镀金直角 RCA 超软耐折弯硅胶勾线、瑞典蓝钢手工淬火弹片及纯银触点黄铜接线柱，专业刺青师硬件升级首选。",
            "base_usd": "26.00",
            "base_cny": "185.00",
            "variants": [
                {"name": "90° 24K Gold-Plated Ultra-Flex RCA Cord 2.5m", "sku": "KYLIN-PART-RCA-GOLD", "usd": "28.00", "cny": "198.00"},
                {"name": "Hand-Tempered Swedish Blue Spring Set (x10)", "sku": "KYLIN-PART-SPR-SWEDEN", "usd": "32.00", "cny": "228.00"},
                {"name": "Carved Solid Brass Binding Post Pair", "sku": "KYLIN-PART-POST-BRASS", "usd": "26.00", "cny": "185.00"},
            ]
        },
    ]

    for p_info in products_catalog:
        prod, created = Product.objects.get_or_create(
            slug=p_info["slug"],
            defaults={
                "name": p_info["name"],
                "category": p_info["category"],
                "product_type": p_info["type"],
                "description": {
                    "blocks": [
                        {"type": "paragraph", "data": {"text": p_info["description"]}}
                    ]
                }
            }
        )

        ProductChannelListing.objects.update_or_create(
            product=prod,
            channel=usd_channel,
            defaults={
                "is_published": True,
                "visible_in_listings": True,
                "available_for_purchase_at": timezone.now(),
            }
        )
        ProductChannelListing.objects.update_or_create(
            product=prod,
            channel=cny_channel,
            defaults={
                "is_published": True,
                "visible_in_listings": True,
                "available_for_purchase_at": timezone.now(),
            }
        )

        # 录入变体
        for v_info in p_info["variants"]:
            variant, v_created = ProductVariant.objects.get_or_create(
                sku=v_info["sku"],
                product=prod,
                defaults={"name": v_info["name"]}
            )

            ProductVariantChannelListing.objects.update_or_create(
                variant=variant,
                channel=usd_channel,
                defaults={
                    "price_amount": Decimal(v_info["usd"]),
                    "discounted_price_amount": Decimal(v_info["usd"]),
                    "currency": "USD"
                }
            )
            ProductVariantChannelListing.objects.update_or_create(
                variant=variant,
                channel=cny_channel,
                defaults={
                    "price_amount": Decimal(v_info["cny"]),
                    "discounted_price_amount": Decimal(v_info["cny"]),
                    "currency": "CNY"
                }
            )

            # 关联变体属性 (行程 / 颜色 / 调校)
            attr_values_to_assign = {}
            if "stroke" in v_info and v_info["stroke"] in val_map["stroke-length"]:
                attr_values_to_assign[attr_map["stroke-length"].id] = [val_map["stroke-length"][v_info["stroke"]]]
            if "color" in v_info and v_info["color"] in val_map["color-finish"]:
                attr_values_to_assign[attr_map["color-finish"].id] = [val_map["color-finish"][v_info["color"]]]
            if "tuning" in v_info and v_info["tuning"] in val_map["tuning-type"]:
                attr_values_to_assign[attr_map["tuning-type"].id] = [val_map["tuning-type"][v_info["tuning"]]]

            if attr_values_to_assign:
                associate_attribute_values_to_instance(variant, attr_values_to_assign)

            # 库存
            Stock.objects.update_or_create(
                warehouse=warehouse,
                product_variant=variant,
                defaults={"quantity": 100}
            )

        print(f"  💎 产品已录入: {prod.name} ({len(p_info['variants'])} variants)")

    print("🎉 Kylin Tattoo 所有产品和规格变体注入成功！")


if __name__ == "__main__":
    seed()
