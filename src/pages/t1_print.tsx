import { Backend_Request } from "@/services/backend";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Printer } from 'lucide-react';

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

export default function T1Print() {

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
          <Button variant="outline" size="icon" onClick={() => rePrintLabel(row.original)}>
            <Printer />
          </Button>
        );
      },
    }),
  ];

  const { id } = useParams();

  const inputRef = useRef(null)

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

  const [model, setModel] = useState(null)
  const navigate = useNavigate();

  const [lastProducts, setLastProducts] = useState([])
  const line_id = 4

  // const [copy, setCopy] = useState(2)

  const [printers, setPrinters] = useState([])
  const [selectedPrinter, setSelectedPrinter] = useState(null)

  async function modelsGetAll() {
    let result = await Backend_Request({}, "/api/tech/models/all")
    if (result.result === "ok") {
      result.data.reduce((acc, data) => {
        if (data.id == id) {
          setModel(data)
        }

        return acc;
      }, [])
    } else {
      showErrorToast(result.error);
    }
  }

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

  async function productsGetLast() {
    let result = await Backend_Request({
      line_id: Number(line_id)
    }, "/api/lines/last")
    if (result.result === "ok") {
      setLastProducts(result.data)
    } else {
      showErrorToast(result.error);
    }
  }
  async function printLabel() {
    let data = {
      line_id: Number(line_id),
      model_id: Number(id),
      printer_id: Number(selectedPrinter.id),
      copy: Number(inputRef.current.value)
    }
    console.log(data)
    let result = await Backend_Request(data, "/api/lines/t1/serialprint")
    if (result.result === "ok") {
      productsGetLast()
      showOkToast("Product qo'shildi");
    } else {
      showErrorToast(result.error);
    }

  }

  async function rePrintLabel(rowData) {
    let data = {
      serial: rowData.serial,
      printer_id: Number(selectedPrinter.id)
    }

    let result = await Backend_Request(data, "/api/lines/t1/serialreprint")
    if (result.result === "ok") {
      showOkToast("Qayta chiqarildi");
    } else {
      showErrorToast(result.error);
    }
  }

  function headerButtons() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div >
          <div className="" style={{ alignItems: 'center', borderWidth: 2, borderStyle: 'solid', borderRadius: 10, padding: 10 }}>
            <div>
              <Button variant="ghost" style={{ margin: 0, padding: 0, marginRight: 15 }} onClick={() => navigate(`/t1`)} > {"<- Model tanlash"}  </Button>
            </div>
            <div style={{ marginRight: 15 }}>T1: Printerni tanlang</div>
            <div>
              <RadioGroup
                value={selectedPrinter?.id}
                // className="w-fit"
                orientation="vertical"
                style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
                onValueChange={(value) => setSelectedPrinter(printers.find((printer) => printer.id === Number(value)))}>
                {printers.map((printer) => {
                  return <div style={{ alignItems: 'center', borderWidth: 1, borderStyle: 'solid', borderRadius: 10, padding: 5, display: 'flex', flex: 1, background: 'rgba(0,0,0,0.05)' }} key={printer.id} className="flex items-center gap-3">
                    <RadioGroupItem value={printer.id} id={printer.id} />
                    <Label htmlFor={printer.id}>{printer.printer_name}</Label>
                  </div>
                })}
              </RadioGroup>
            </div>
          </div>
          <div style={{ alignItems: 'center', borderWidth: 2, borderStyle: 'solid', borderRadius: 10, padding: 10, marginTop: 5 }}>

            <div>Model Nomi: {model?.model_nomi}</div>
            <div>Modeli: {model?.modeli}</div>
            <div>Rangi: {model?.rangi}</div>
            <div style={{ width: 100, flexDirection: 'row', display: 'flex', alignItems: 'center' }}>Copy:
              <Input
                style={{width: 100}}
                onKeyDown={(e) => { if (e.key === "Enter") { rePrintLabel(inputRef.current?.value || '') } }}
                ref={inputRef} id="input-demo-api-key" type="number" placeholder="2" 
                max={3}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, marginLeft: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Button style={{ flex: 1, height: '100%' }} onClick={printLabel}>Print</Button>
        </div>

      </div>

    )
  }

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

  useEffect(() => {
    modelsGetAll();
    printersGetAll();
    productsGetLast();
    inputRef.current.value = 2
  }, []);

  return (
    <div>
      {headerButtons()}
      <div style={{ alignItems: 'center', borderWidth: 2, borderStyle: 'solid', borderRadius: 10, marginTop: 10 }}>

        {lastProductsTable()}
      </div>
    </div>
  );
}
