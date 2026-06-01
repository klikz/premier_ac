import { Backend_Request } from "@/services/backend";
import { useEffect, useState } from "react";

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
                backgroundColor: "rgba(255, 0, 0, 0.5)",
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

        useEffect(() => {
          modelsGetAll();
        }, []);

  return (
    <div style={{borderWidth: 1.5, borderRadius: 10}}>
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
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id}
                  onClick={() => navigate(`/i1/${row.original.id}`)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
  );
}
