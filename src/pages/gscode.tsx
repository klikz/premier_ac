import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner";
import { Backend_Request } from "@/services/backend";

import { useDropzone } from 'react-dropzone';

import { Button } from "@/components/ui/button";

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
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
    getFilteredRowModel,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function GsCodePgae() {
    const [gscodeInfo, setGsCodeInfo] = useState([])

    const [models, setModels] = useState([])
    const [selectedModel, setSelectedModel] = useState(null)
    const [selectedModelInfo, setSelectedModelInfo] = useState([])
    const [showInfo, setShowInfo] = useState(false)

    const [errorCodesString, setErrorCodesString] = useState(null)

    const [selectedModelName, setSelectedModelName] = useState("Modelni tanlang")

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

    async function modelsGetAll() {
        let result = await Backend_Request({}, "/api/tech/models/all")
        console.log("modelsGetAll result: ", result)
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

    async function gsCodeCount() {
        let result = await Backend_Request({}, "/api/tech/gscode/count")
        console.log("gsCodeCount result: ", result)
        if (result.result === "ok") {
            setGsCodeInfo(result.data)
        } else {
            showErrorToast(result.error);
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,
        multiple: false,
    });


    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const handleSend = () => {
        if (!selectedFile) return;

        console.log()

        console.log("Sending file:", selectedFile);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);

        reader.onload = async () => {
            let result = await Backend_Request({ file64: reader.result, model_id: selectedModel.id }, "/api/tech/gscode/upload")
            if (result.result === "ok") {
                showOkToast("Ma'lumot qo'shildi");
                gsCodeCount()
            } else {
                showErrorToast("Yuklashda muammo: " + result.error);
                arrayToString(result.data)
            }
            reader.onerror = (error) => {
                showErrorToast(String(error));
            };
        };
        // gsCodeCount();
        setSelectedFile(null);
    };

    function arrayToString(array: string[]) {
        const temp = array.join("\n");
        setErrorCodesString(temp);
        // let temp = ""
        // for (let i = 0; i < array.length; i++) {
        //     temp += array[i] + "\n"
        // }
        // setErrorCodesString(temp)
    }

    function fileUploader() {
        return (
            <div style={{height: 35}}>
                {!selectedFile ? <div
                    {...getRootProps()}
                    className="cursor-pointer"
                    style={{
                        borderWidth: 1.5,
                        borderRadius: 10,
                        padding: 5,
                        height: 35,
                        width: 200
                    }}
                >
                    <input {...getInputProps()} />

                    {isDragActive ? (
                        <p>GsCode yuklash...</p>
                    ) : (
                        <div className="">
                            <p>GsCode yuklash...</p>

                            {selectedFile && (
                                null
                            )}
                        </div>
                    )}
                </div> : null}


                {!selectedFile ? (
                    null
                ) : (
                    <Button
                        type="button"
                        // className="w-50"
                        style={{width: 200}}
                        
                        onClick={handleSend}
                    >
                        {selectedFile.name.length > 15
                            ? `${selectedFile.name.slice(0, 15)}...`
                            : selectedFile.name} Yuklash
                    </Button>
                )}

            </div>
        )
    }

    function dropDownModels() {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button style={{padding: 10, height: 35, borderWidth: 1.5, width: 200}} variant="outline">{selectedModelName}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent style={{width: 500}} align="start">
                    <DropdownMenuGroup>
                        {models.reduce((acc, model) => {
                            acc.push(
                                <DropdownMenuItem key={model.seriya_raqami} onClick={()=>{
                                    setSelectedModelName(model.modeli)
                                    setSelectedModelInfo([model])
                                    setShowInfo(true)
                                    setSelectedModel(model)}}>
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

    const columnHelper = createColumnHelper<any>();

    const columns = [
        columnHelper.accessor("brand", {
            header: "Brand",
        }),
        columnHelper.accessor("modeli", {
            header: "Modeli",
        }),
        columnHelper.accessor("model_nomi", {
            header: "Model Nomi",
        }),
        columnHelper.accessor("seriya_raqami", {
            header: "Seriya raqami",
        }),
        columnHelper.accessor("gs1_ean13", {
            header: "GS1 Code",
        }),
        columnHelper.accessor("count", {
            header: "Soni",
        }),
    ];

    const modelInfoColumns = [
        columnHelper.accessor("brend", {
            header: "Brand",
        }),
        columnHelper.accessor("modeli", {
            header: "Modeli",
        }),
        columnHelper.accessor("model_nomi", {
            header: "Model Nomi",
        }),
        columnHelper.accessor("seriya_raqami", {
            header: "Seriya raqami",
        }),
        columnHelper.accessor("gs1_ean13", {
            header: "GS1 Code",
        }),
        columnHelper.accessor("odoo_code", {
            header: "Odoo code",
        }),
    ];

    const [globalFilter, setGlobalFilter] = useState("");

    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data: gscodeInfo,
        columns,

        state: {
            sorting,
            globalFilter,
        },

        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        globalFilterFn: (row, _columnId, filterValue) => {
            const search = String(filterValue).toLowerCase();
            const modeli = String(row.original.modeli || "").toLowerCase();
            const modelNomi = String(row.original.model_nomi || "").toLowerCase();
            const seriya = String(row.original.seriya_raqami || "").toLowerCase();
            const brand = String(row.original.brand || "").toLowerCase();

            return (
                modeli.includes(search) ||
                modelNomi.includes(search) ||
                seriya.includes(search) ||
                brand.includes(search)
            );
        },
    });

    const table2 = useReactTable({
        data: selectedModelInfo,
        columns: modelInfoColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    function searchInput(){
        return       <input
                        placeholder="Qidirish..."
                        style={{ borderWidth: 1.5, borderRadius: 10, padding: 5 }}
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm mb-4"
                    />
    }

    function gscodeCountTable() {
        return <div style={{borderWidth: 1.5, borderRadius: 10}}>
            <Table >

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
        </Table></div>
    }

    function modelInfoTable() {
        return <div style={{borderWidth: 1.5, borderRadius: 10}}>
            <Table >

            {/* HEADER */}
            <TableHeader>
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
        </Table></div>
    }

    useEffect(() => {
        modelsGetAll()
        gsCodeCount()
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div>
                    {searchInput()}
                    <Button onClick={()=>window.location.href = "/gscode/report"} variant="ghost">Report</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {dropDownModels()}
                    <div style={{ width: 10 }}></div>
                    {fileUploader()}
                </div>
            </div>
                {showInfo && <div>
                    <div>Tanlangan model haqida ma'lumot</div>
                    {modelInfoTable()}
                </div>}
            <div>
                <div style={{marginTop: 10}}>
                    Yuklangan GS Code ro'yhati
                </div>
                {gscodeCountTable()}
            </div>
           {errorCodesString && <div style={{fontSize: 8, whiteSpace: 'pre-line'}}>
                <div>
                    Muammoli gscode ro'yhati:
                </div>
               {errorCodesString}
            </div>}
        </div>
    )
}