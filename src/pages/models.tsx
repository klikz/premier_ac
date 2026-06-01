import { Backend_Request } from "@/services/backend"
import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import { useDropzone } from 'react-dropzone';

import { Button } from "@/components/ui/button";


import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
    getFilteredRowModel,
} from "@tanstack/react-table";

export default function ModelsPage() {

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

        console.log("Sending file:", selectedFile);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);

        reader.onload = async () => {
            let result = await Backend_Request({ file64: reader.result }, "/api/tech/models/add")
            if (result.result === "ok") {
                showOkToast("Ma'lumot qo'shildi");
                modelsGetAll();
            } else {
                showErrorToast(result.error);
            }
            reader.onerror = (error) => {
                showErrorToast(String(error));
            };
        };

        // axios upload here
        // const formData = new FormData();
        // formData.append("file", selectedFile);
        // await api.post("/upload", formData);

        setSelectedFile(null);
    };

    function fileUploader() {
        return (
            <div>
                {!selectedFile ? <div
                    {...getRootProps()}
                    className="cursor-pointer"
                    style={{
                        borderWidth: 1.5,
                        borderRadius: 10,
                        padding: 5
                    }}
                >
                    <input {...getInputProps()} />

                    {isDragActive ? (
                        <p>Excel file yuklash...</p>
                    ) : (
                        <div className="space-y-2">
                            <p>Excel file yuklash...</p>

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
                        className="w-full"
                        onClick={handleSend}
                    >
                        {selectedFile.name}: Yuklash
                    </Button>
                )}

            </div>
        )
    }


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
        columnHelper.accessor("rangi", {
            header: "Rangi",
        }),
    ];

    const navigate = useNavigate()
    const [models, setModels] = useState([])


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
            style: {
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                color: "white",
                justifyContent: 'center',
            },
            position: 'top-center'
        })
    }

    async function modelsGetAll() {
        let result = await Backend_Request({}, "/api/tech/models/all")
        console.log("result: ", result.data)
        if (result.result === "ok") {
            setModels(result.data)
        } else {
            showErrorToast(result.error);
        }
    }

    const [globalFilter, setGlobalFilter] = useState("");


    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data: models,
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

            return (
                modeli.includes(search) ||
                modelNomi.includes(search) ||
                seriya.includes(search)
            );
        },
    });

    function pageHeader() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div>
                    <input
                        placeholder="Search..."
                        style={{ borderWidth: 1.5, borderRadius: 10, padding: 5 }}
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm mb-4"
                    />
                </div>
                <div>
                    {fileUploader()}

                </div>

            </div>
        )
    }

    useEffect(() => {
        modelsGetAll();
    }, []);

    function modelsTable() {
        return <Table>

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
                    <TableRow className="cursor-pointer"
                        key={row.id}
                        onClick={() => navigate(`/models/${row.original.id}`)}
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

    return (
        <div>
            {pageHeader()}
            <div style={{borderWidth: 1.5, borderRadius: 10}}>
            {modelsTable()}

            </div>
        </div>
    )
}