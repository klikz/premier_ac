import { Backend_Request } from "@/services/backend";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Printer } from 'lucide-react';


export default function T3Print() {
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("serial", {
      header: "Serial",
    }),
    columnHelper.accessor("model", {
      header: "Modeli",
    }),
    columnHelper.accessor("model_nomi", {
      header: "Model nomi",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="icon" onClick={() => printLabel(row.original.serial, true)}>
            <Printer />
          </Button>
        );
      },
    }),
  ];

  function showOkToast(text: string) {
    toast(text, {
      // description: "Sunday, December 03, 2023 at 9:00 AM",
      style: {
        backgroundColor: "rgba(8, 113, 8, 0.5)",
        color: "white",
      },
      position: 'top-right'
      //   action: {
      //     label: "Undo",
      //     onClick: () => console.log("Undo"),
      //   },
    })
  }

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
  const line_id = 5
  const [lastProducts, setLastProducts] = useState([])
  const [printers, setPrinters] = useState([])
  const [selectedPrinter, setSelectedPrinter] = useState(null)

  async function printersGetAll() {
    let result = await Backend_Request({}, "/api/lines/printers/all")
    if (result.result === "ok") {
      let fltr = result.data.filter((val: any) => {
        if (val.line_id === Number(line_id)) {
          return true
        } else {
          return false
        }
      })
      setPrinters(fltr)
      setSelectedPrinter(fltr[0])
    } else {
      showErrorToast(result.error);
    }
  }

  const inputRef = useRef(null)


  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: lastProducts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function lastProductsTable() {
    return <Table style={{}}>

      {/* HEADER */}
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead
                key={header.id}
                className=""
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}

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
  }

  async function productsGetLast() {
    let result = await Backend_Request({
      line_id: Number(line_id)
    }, "/api/lines/last")
    console.log("last: ", result)
    if (result.result === "ok") {
      setLastProducts(result.data)
    } else {
      showErrorToast(result.error);
    }
  }

  async function printLabel(serial: string, status: boolean) {
    if (!serial || serial == "") {
      return;
    }
    let data = {
      serial: serial,
      printer_id: Number(selectedPrinter.id),
      reprint: status
    }
    
    inputRef.current.value = ""
    inputRef.current?.focus()
    let result = await Backend_Request(data, "/api/lines/t2/serialprint")
    if (result.result === "ok") {
      if (status) {
        showOkToast(serial + ": Qayta chiqarildi");
      } else {
        showOkToast(serial + ": Chiqarildi");
      }
      productsGetLast()
    } else {
      showErrorToast(serial + ": " + result.error);
      inputRef.current.value = ""
      inputRef.current?.focus()
    }
  }

  useEffect(() => {
    printersGetAll();
    productsGetLast();
    inputRef.current.focus()
  }, []);


  return (
    <div>
      <div style={{ marginBottom: 10 }}>T2: Printerni tanlang</div>
      <div>
        <RadioGroup
          value={selectedPrinter?.id}
          className="w-fit"
          orientation="vertical"
          style={{}}
          onValueChange={(value) => setSelectedPrinter(printers.find((printer) => printer.id === Number(value)))}>
          {printers.map((printer) => {
            return <div style={{
              alignItems: 'center',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
              padding: 5,
              background: 'rgba(0,0,0,0.05)'
            }} key={printer.id}
              className="flex items-center gap-3">
              <RadioGroupItem value={printer.id} id={printer.id} />
              <Label htmlFor={printer.id}>{printer.printer_name}</Label>
            </div>
          })}
        </RadioGroup>
      </div>

      <div style={{ width: "30%", marginTop: 20 }}>
        <Input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              printLabel(inputRef.current.value, false)
            }
          }}
          style={{borderWidth: 1.5}}
          ref={inputRef} id="input-demo-api-key" type="text" placeholder="Serial nomer" />
      </div>
      <div style={{borderWidth: 1.5, borderRadius: 10, marginTop: 10}}>
        {lastProductsTable()}
      </div>
    </div>
  )
} 