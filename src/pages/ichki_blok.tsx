import { Backend_Request } from "@/services/backend";
import { useEffect, useRef, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useVirtualizer } from "@tanstack/react-virtual";

import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("model_nomi", {
    header: "Model Nomi",
  }),
  columnHelper.accessor("modeli", {
    header: "Modeli",
  }),
  columnHelper.accessor("seriya_raqami", {
    header: "Seriya raqami",
  }),
  columnHelper.accessor("gs1_ean13", {
    header: "GS1 Code",
  }),
  columnHelper.accessor("rangi", {
    header: "Rangi",
  }),
  columnHelper.accessor("gscode_count", {
    header: "GsCode soni",
  }),
];


export default function IchkiBlok() {

  function showErrorToast(text: string) {
    toast(text, {
      // description: "Sunday, December 03, 2023 at 9:00 AM",
      style: {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        color: "white",
        justifyContent: 'center',
      },
      position: 'top-center'
      //   action: {
      //     label: "Undo",
      //     onClick: () => console.log("Undo"),
      //   },
    })
  }

  const [models, setModels] = useState([])
  const navigate = useNavigate();

  async function modelsGetAll() {
    let result = await Backend_Request({}, "/api/tech/models/all")
    console.log("result.data", result.data);
    if (result.result === "ok") {
      const modelsMap = result.data.reduce((acc: any, curr: any) => {
        if (curr.seriya_raqami[6] == "I") {
          acc.push(curr);
        }
        return acc;
      }, []);
      // console.log("modelsMap", modelsMap);
      setModels(modelsMap)
    } else {
      showErrorToast(result.error);
    }
  }

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: models,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 40,
  overscan: 10,
});


  useEffect(() => {
    modelsGetAll();
  }, []);

  return (
    <div
        ref={parentRef}
        style={{
          height: "90vh",
          overflow: "auto",
          borderWidth: 1.5,
          borderRadius: 10,
        }}
      >
      <Table>

        {/* HEADER */}
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {/* sorting indicator */}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* BODY */}
        <TableBody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
    const row = rows[virtualRow.index];

    return (
      <TableRow
        key={row.id}
        onClick={() => navigate(`/i1/${row.original.id}`)}
        className="cursor-pointer"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transform: `translateY(${virtualRow.start}px)`,
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  })}
</TableBody>

      </Table>
    </div>
  );
}
