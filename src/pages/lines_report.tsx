import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { Backend_Request } from "@/services/backend"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


export default function LinesReport() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 1),
    })

    const [lines, setLines] = useState([])
    const [selectedLine, setSelectedLine] = useState(null)
    const [models, setModels] = useState([])
    const [selectedModel, setSelectedModel] = useState(null)

    const [reportData, setReportData] = useState([])
    const [count, setCount] = useState(0)
    const [shortInfo, setShortInfo] = useState([])

    const [reportLoaded, setReportLoaded] = useState(false)

    function showErrorToast(text: string) {
        toast(text, {
            style: {
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                color: "white",
                justifyContent: 'center',
            },
            position: 'top-center'
        })
    }

    function calendarPick() {
        return (
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker-range"
                            style={{ width: '100%' }}
                        >
                            <CalendarIcon />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "dd-MM-yyyy")} :{" "}
                                        {format(date.to, "dd-MM-yyyy")}
                                    </>
                                ) : (
                                    format(date.from, "dd-MM-yyyy")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        )
    }

    async function linesGetAll() {
        let result = await Backend_Request({}, "/api/lines/all")
        if (result.result === "ok") {
            setLines(result.data)
        } else {
            showErrorToast(result.error);
        }
    }

    async function modelsGetAll() {
        let result = await Backend_Request({}, "/api/tech/models/all")
        if (result.result === "ok") {
            const modelsMap = result.data.reduce((acc: any, curr: any) => {
                if (curr.seriya_raqami[6] == "T") {
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


    function dropDownLines() {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button style={{ padding: 10, height: 35, borderWidth: 1.5 }} variant="outline">{selectedLine?.name || "Liniyani tanlang"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-50" align="start">
                    <DropdownMenuGroup>
                        {lines.reduce((acc, line) => {
                            acc.push(
                                <DropdownMenuItem key={line.id} onClick={() => {
                                    setSelectedLine(line)
                                }}>
                                    {line.name}
                                </DropdownMenuItem>
                            )
                            return acc
                        }, [] as React.ReactNode[])}

                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    function dropDownModels() {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button style={{ padding: 10, height: 35, borderWidth: 1.5 }} variant="outline">{selectedModel?.modeli || "Modelni tanlang"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent style={{ width: 500 }} align="start">
                    <DropdownMenuGroup>
                        {models.reduce((acc, model) => {
                            acc.push(
                                <DropdownMenuItem key={model.seriya_raqami} onClick={() => {
                                    setSelectedModel(model)
                                }}>
                                    {model.modeli} - {model.model_nomi} - {model.rangi} - {model.gs1_ean13}
                                </DropdownMenuItem>
                            )
                            return acc
                        }, [] as React.ReactNode[])}

                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    async function getReport() {
        const date1 = date?.from
            ? format(date.from, "yyyy-MM-dd")
            : "";

        const date2 = date?.to
            ? format(date.to, "yyyy-MM-dd")
            : "";

        let data = {
            date1,
            date2,
            line_id: selectedLine?.id,
            model_id: selectedModel?.id
        }

        let result = await Backend_Request(data, "/api/lines/report")
        console.log("result", result)
        if (result.result == "ok"){
            setReportData(result.data.detailed)
            setCount(result.data.count)
            setShortInfo(result.data.short_table)
            console.log("shortInfo", result.data.short_table)
            setReportLoaded(true)
        }else{
            showErrorToast(result.error)
            setReportLoaded(false)
        }
        // console.log(result)

    }

    // const columnHelper = createColumnHelper<any>();

    // const columns = [
    //     columnHelper.accessor("serial", {
    //         header: "Serial",
    //     }),
    //     columnHelper.accessor("model", {
    //         header: "Modeli",
    //     }),
    //     columnHelper.accessor("model_nomi", {
    //         header: "Model Nomi",
    //     }),
    //     columnHelper.accessor("line_name", {
    //         header: "Liniya nomi",
    //     }),
    //     columnHelper.accessor("odoo_code", {
    //         header: "Odoo code",
    //     }),
    // ];

    const columnHelper2 = createColumnHelper<any>();

    const columns2 = [
        columnHelper2.accessor("line_name", {
            header: "Liniya Nomi",
        }),
        columnHelper2.accessor("model_name", {
            header: "Modeli",
        }),
        columnHelper2.accessor("count", {
            header: "Soni",
        })
    ];

    function exportToExcel(fileName = "report.xlsx") {
        // console.log(reportData)
        const exportData = reportData.map((item) => ({
            Serial: item.serial,
            Modeli: item.model,
            ModelNomi: item.model_nomi,
            LiniyaNomi: item.line_name,
            OdooCode: item.odoo_code,
            Vaqt: item.time,
            GS1: item.gs1,
            GsCode: item.gs_code
        }));
        // console.log(exportData)
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const fileData = new Blob(
            [excelBuffer],
            {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }
        );

  saveAs(fileData, fileName);
}



    // function reportTable() {
    //     return (
    //         <Table>

    //             {/* HEADER */}
    //             <TableHeader className="bg-[rgba(0,0,0,0.2)]">
    //                 {table.getHeaderGroups().map((hg) => (
    //                     <TableRow key={hg.id}>
    //                         {hg.headers.map((header) => (
    //                             <TableHead
    //                                 key={header.id}
    //                                 onClick={header.column.getToggleSortingHandler()}
    //                                 className="cursor-pointer select-none"
                                    
    //                             >
    //                                 {flexRender(
    //                                     header.column.columnDef.header,
    //                                     header.getContext()
    //                                 )}

    //                                 {/* sorting indicator */}
    //                                 {{
    //                                     asc: " 🔼",
    //                                     desc: " 🔽",
    //                                 }[header.column.getIsSorted() as string] ?? null}
    //                             </TableHead>
    //                         ))}
    //                     </TableRow>
    //                 ))}
    //             </TableHeader>

    //             {/* BODY */}
    //             <TableBody>
    //                 {table.getRowModel().rows.map((row) => (
    //                     <TableRow
    //                         key={row.id}
    //                         // onClick={() => navigate(`/t1/${row.original.id}`)}
    //                         // className="cursor-pointer"
    //                     >
    //                         {row.getVisibleCells().map((cell) => (
    //                             <TableCell key={cell.id}>
    //                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //                             </TableCell>
    //                         ))}
    //                     </TableRow>
    //                 ))}
    //             </TableBody>

    //         </Table>
    //     )
    // }

    // const [sorting, setSorting] = useState<SortingState>([]);
    // const table = useReactTable({
    //     data: reportData,
    //     columns,
    //     state: { sorting },
    //     onSortingChange: setSorting,
    //     getCoreRowModel: getCoreRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    // });

    const table2 = useReactTable({
        data: shortInfo,
        columns: columns2,
        getCoreRowModel: getCoreRowModel(),
    });


    function shortInfoTable() {
        return (
            <Table>

                {/* HEADER */}
                <TableHeader className="bg-[rgba(0,0,0,0.2)]">
                    {table2.getHeaderGroups().map((hg) => (
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
                    {table2.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            // onClick={() => navigate(`/t1/${row.original.id}`)}
                            // className="cursor-pointer"
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
        )
    }



    useEffect(() => {
        linesGetAll()
        modelsGetAll()
    }, []);
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                    style={{ display: 'flex', flex: 1, flexDirection: 'column', width: 'fit-content', padding: 10 }}>
                    {calendarPick()}
                    <div style={{ marginTop: 10 }}></div>
                    {dropDownLines()}

                </div>
                <div
                    style={{ display: 'flex', flex: 1, flexDirection: 'column', width: 'fit-content', padding: 10 }}>
                    {dropDownModels()}
                    <Button onClick={getReport} style={{ marginTop: 10 }}>Tasdiqlash</Button>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'end', alignItems: 'end', marginRight: 10}}>
                {count > 0 && `Soni: ${count}`}
            </div>
            <div className="rounded-[10px] overflow-hidden border">
                    {reportLoaded && shortInfoTable()}
            </div>

            <Button onClick={() => exportToExcel()}>Excel</Button>
        </div>
    )
}