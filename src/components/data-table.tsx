"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  downloadable?: boolean;
}

export function DataTable<TData>({ data, columns, downloadable }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // CSV Download
  const downloadCSV = () => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && col.id !== "actions");

    const headers = visibleColumns.map(
      (col) => col.columnDef.header as string
    );

    const rows = table.getRowModel().rows.map((row) =>
      visibleColumns.map((col) => {
        const cell = row.getAllCells().find((c) => c.column.id === col.id);
        return cell ? cell.getValue() : "";
      })
    );

    const csv = Papa.unparse({
      fields: headers,
      data: rows,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        {downloadable && downloadable? (
          <div className="text-right">
            <Button variant="default" size="sm" onClick={downloadCSV}>
              Download CSV
            </Button>
          </div>
        ): (
          <div>

          </div>
        )
        }
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-teal-400 dark:bg-gray-800 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-teal-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="
                        px-4 py-3
                        text-left
                        text-sm font-medium
                        text-gray-700 dark:text-gray-200
                        border-b border-gray-200 dark:border-gray-700
                        cursor-pointer
                        select-none
                        transition-colors duration-150
                        hover:bg-gray-200 dark:hover:bg-gray-700
                      "
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination + Download */}
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          
        </div>
      </div>
    </div>
  );
}