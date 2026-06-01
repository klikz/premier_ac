import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { Backend_Request } from "@/services/backend"

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


export default function GsCodesReport() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 1),
    })

    const [reportData, setReportData] = useState([])

    function showErrorToast(text: string) {
        toast(text, {
            style: {
                backgroundColor: "rgba(31, 41, 55, 0.9)",
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

    async function getReport() {
        const date1 = date?.from
            ? format(date.from, "yyyy-MM-dd")
            : "";

        const date2 = date?.to
            ? format(date.to, "yyyy-MM-dd")
            : "";

        let data = {
            date1,
            date2
        }

        let result = await Backend_Request(data, "/api/tech/gscode/report")
        if (result.result == "ok"){
            setReportData(result.data)
        }else{
            showErrorToast(result.error)
        }

    }

    const columnHelper = createColumnHelper<any>();

    const columns = [
        columnHelper.accessor("modeli", {
            header: "Modeli",
        }),
        columnHelper.accessor("yuklangan", {
            header: "Yuklangan",
        }),
        columnHelper.accessor("ishlatilgan", {
            header: "Ishlatilgan",
        }),
        columnHelper.accessor("qoldiq", {
            header: "Qoldiq",
        }),
    ];



    function reportTable() {
        return (
            <Table>
                {/* HEADER */}
                <TableHeader className="bg-[rgba(0,0,0,0.2)]">
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

    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data: reportData,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div
                    style={{ display: 'flex', flex: 1, flexDirection: 'column', width: 'fit-content', padding: 10 }}>
                    {calendarPick()}
                </div>
                <div
                    style={{ display: 'flex', flex: 1, flexDirection: 'column', width: 'fit-content', padding: 10 }}>
                    <Button onClick={getReport} style={{ }}>Tasdiqlash</Button>
                </div>
            </div>
            <div className="rounded-[10px] overflow-hidden border">
                {reportTable()}
            </div>

        </div>
    )
}