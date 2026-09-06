import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { KylinProduct } from '../types';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';

interface Props {
  products: KylinProduct[];
}

interface SpecRow {
  slug: string;
  name: string;
  nameZh: string;
  motor: string;
  strokeOptions: string[];
  material: string;
  voltage: string;
  weight: string;
  priceUsd: number;
}

const columnHelper = createColumnHelper<SpecRow>();

export const SpecsMatrix: React.FC<Props> = ({ products }) => {
  const { t, i18n } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);

  const isZh = i18n.language.startsWith('zh');

  const data = useMemo<SpecRow[]>(() => {
    return products.map(p => ({
      slug: p.slug,
      name: p.name,
      nameZh: p.nameZh,
      motor: p.motor || 'Mechanical Linkage',
      strokeOptions: p.strokeOptions || [],
      material: p.material || 'Specialty Alloy',
      voltage: p.voltage || 'Standard',
      weight: p.weight || '140g',
      priceUsd: p.startingPriceUsd,
    }));
  }, [products]);

  const columns = useMemo(
    () => [
      columnHelper.accessor(row => (isZh ? row.nameZh : row.name), {
        id: 'name',
        header: () => <span className="tracking-wider whitespace-nowrap">{t('compare.colProduct')}</span>,
        cell: info => (
          <Link
            to="/products/$slug"
            params={{ slug: info.row.original.slug }}
            className="flex items-center gap-2.5 group hover:text-[#c5a059] transition-colors min-w-[200px]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] shrink-0" />
            <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight group-hover:text-[#c5a059] transition-colors leading-snug">
              {info.getValue()}
            </span>
          </Link>
        ),
      }),
      columnHelper.accessor('motor', {
        header: () => <span className="tracking-wider whitespace-nowrap">{t('compare.colMotor')}</span>,
        cell: info => (
          <span className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] font-medium min-w-[180px] inline-block leading-relaxed">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('strokeOptions', {
        id: 'stroke',
        header: () => <span className="tracking-wider whitespace-nowrap">{t('compare.colStroke')}</span>,
        cell: info => {
          const rawOptions = info.getValue() as string[];
          const chips = rawOptions
            .flatMap(opt => opt.split(',').map(s => s.trim()))
            .filter(Boolean);

          return (
            <div className="flex flex-wrap gap-1.5 items-center min-w-[190px]">
              {chips.map((chip, idx) => (
                <span
                  key={idx}
                  className="whitespace-nowrap text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#c5a059]/10 text-[#c5a059] dark:text-[#dfbc74] border border-[#c5a059]/25 shadow-2xs"
                >
                  {chip}
                </span>
              ))}
            </div>
          );
        },
      }),
      columnHelper.accessor('material', {
        header: () => <span className="tracking-wider whitespace-nowrap">{t('compare.colMaterial')}</span>,
        cell: info => {
          const val = info.getValue();
          const display = isZh ? val : val.replace(/\s*\([^)]*[一-龥]+[^)]*\)/g, '').trim();
          return (
            <span className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] font-medium whitespace-nowrap min-w-[140px] inline-block">
              {display}
            </span>
          );
        },
      }),
      columnHelper.accessor('weight', {
        header: () => <span className="tracking-wider whitespace-nowrap">{t('compare.colWeight')}</span>,
        cell: info => (
          <span className="text-xs font-mono text-[#86868b] whitespace-nowrap inline-block">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('priceUsd', {
        id: 'price',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-bold tracking-wider hover:text-[#c5a059] transition-colors whitespace-nowrap"
          >
            <span>{t('compare.colPrice')}</span>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#c5a059]" />
          </button>
        ),
        cell: info => (
          <span className="font-mono font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums whitespace-nowrap">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),
    ],
    [isZh, t]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section id="compare" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c5a059] uppercase tracking-wider mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isZh ? '机型横向规格参数对比' : 'Benchmarking & Tolerances'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            {t('compare.heading')}
          </h2>
          <p className="mt-2 text-[14px] text-[#6e6e73] dark:text-[#86868b] max-w-xl leading-relaxed tracking-tight">
            {t('compare.subheading')}
          </p>
        </div>
      </div>

      {/* TanStack Table Container */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xs border border-black/5 dark:border-white/10">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[920px] text-left text-xs border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02]"
                >
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-4.5 text-[11px] font-bold text-[#86868b] uppercase tracking-wider select-none"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 text-xs font-normal">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
