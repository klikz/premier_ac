import { Backend_Request } from "@/services/backend";
import { useEffect, useState } from "react";

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

import { ShowErrorToast } from "@/components/showToast";


export default function Dashboard() {
  const columnHelper = createColumnHelper<any>();

  // const [t1, setT1] = useState([])
  // const [t2, setT2] = useState([])
  const [count, setCount] = useState(0)
  const [t3, setT3] = useState([])

  async function getReja() {
    let result = await Backend_Request({}, "/api/lines/reja")
    console.log(result)
    if (result.result === "ok") {
      // setT1(result.data.t1)
      // setT2(result.data.t2)
      setCount(result.data)
    } else {
      ShowErrorToast(result.error);
    }
  }

  async function getAllData() {
    let result = await Backend_Request({}, "/api/lines/dashboard")
    console.log(result)
    if (result.result === "ok") {
      // setT1(result.data.t1)
      // setT2(result.data.t2)
      setT3(result.data.t3)
    } else {
      ShowErrorToast(result.error);
    }
  }

  const columns = [
    columnHelper.accessor("model_name", {
      header: "Модель номи",
    }),
    columnHelper.accessor("count", {
      header: "Сони",
    }),
  ];

  // const tableT1 = useReactTable({
  //   data: t1,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });
  //   const tableT2 = useReactTable({
  //   data: t2,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });
  const tableT3 = useReactTable({
    data: t3,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function t3Table() {  return (    <div      style={{        width: "100%",        overflowX: "auto",        borderRadius: 20,        background: "white",      }}    >      <Table        style={{          width: "100%",        }}      >        {/* HEADER */}        <TableHeader>          {tableT3.getHeaderGroups().map((hg) => (            <TableRow              key={hg.id}              style={{                background:                  "linear-gradient(90deg, #166534 0%, #16a34a 100%)",              }}            >              {hg.headers.map((header) => (                <TableHead                  key={header.id}                  style={{                    width: `${100 / hg.headers.length}%`,                    fontSize: 26,                    color: "white",                    fontWeight: "bold",                    padding: "22px 18px",                    borderBottom: "2px solid #16a34a",                    textAlign: "center",                    letterSpacing: 1,                  }}                >                  {flexRender(                    header.column.columnDef.header,                    header.getContext()                  )}                </TableHead>              ))}            </TableRow>          ))}        </TableHeader>        {/* BODY */}        <TableBody>          {tableT3.getRowModel().rows.map((row, index) => (            <TableRow              key={row.id}              style={{                backgroundColor:                  index % 2 === 0 ? "#f8fafc" : "#f3f4f6",              }}            >              {row.getVisibleCells().map((cell) => (                <TableCell                  key={cell.id}                  style={{                    width: `${100 / row.getVisibleCells().length}%`,                    fontSize: 28,                    padding: "20px 18px",                    color: "#0f172a",                    fontWeight: 600,                    borderBottom: "1px solid #e5e7eb",                    textAlign: "center",                  }}                >                  {flexRender(                    cell.column.columnDef.cell,                    cell.getContext()                  )}                </TableCell>              ))}            </TableRow>          ))}        </TableBody>      </Table>    </div>  )}// function t1Table() {
  //   return <Table style={{}}>

  //     {/* HEADER */}
  //     <TableHeader>
  //       {tableT1.getHeaderGroups().map((hg) => (
  //         <TableRow key={hg.id}>
  //           {hg.headers.map((header) => (
  //             <TableHead
  //               key={header.id}
  //               className=""
  //             >
  //               {flexRender(
  //                 header.column.columnDef.header,
  //                 header.getContext()
  //               )}

  //             </TableHead>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableHeader>

  //     {/* BODY */}
  //     <TableBody>
  //       {tableT1.getRowModel().rows.map((row) => (
  //         <TableRow
  //           key={row.id}
  //         >
  //           {row.getVisibleCells().map((cell) => (
  //             <TableCell key={cell.id}>
  //               {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //             </TableCell>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableBody>

  //   </Table>
  // }
  //   function t2Table() {
  //   return <Table style={{}}>

  //     {/* HEADER */}
  //     <TableHeader>
  //       {tableT2.getHeaderGroups().map((hg) => (
  //         <TableRow key={hg.id}>
  //           {hg.headers.map((header) => (
  //             <TableHead
  //               key={header.id}
  //               className=""
  //             >
  //               {flexRender(
  //                 header.column.columnDef.header,
  //                 header.getContext()
  //               )}

  //             </TableHead>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableHeader>

  //     {/* BODY */}
  //     <TableBody>
  //       {tableT2.getRowModel().rows.map((row) => (
  //         <TableRow
  //           key={row.id}
  //         >
  //           {row.getVisibleCells().map((cell) => (
  //             <TableCell key={cell.id}>
  //               {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //             </TableCell>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableBody>

  //   </Table>
  // }
  // function t3Table() {
  //   return <Table style={{}}>

  //     {/* HEADER */}
  //     <TableHeader>
  //       {tableT3.getHeaderGroups().map((hg) => (
  //         <TableRow key={hg.id}>
  //           {hg.headers.map((header) => (
  //             <TableHead
  //               style={{ backgroundColor: '#686868', fontSize: 30 }}
  //               key={header.id}
  //               className="text-white"
  //             >
  //               {flexRender(
  //                 header.column.columnDef.header,
  //                 header.getContext()
  //               )}

  //             </TableHead>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableHeader>

  //     {/* BODY */}
  //     <TableBody>
  //       {tableT3.getRowModel().rows.map((row) => (
  //         <TableRow
  //           key={row.id}
  //         >
  //           {row.getVisibleCells().map((cell) => (
  //             <TableCell style={{ fontSize: 30 }} key={cell.id}>
  //               {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //             </TableCell>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableBody>

  //   </Table>
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      getAllData();
      getReja();
    }, 3000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: 20, boxSizing: "border-box", background: "#f4f7fb", fontFamily: "Arial",
      }}  >
      {/* HEADER */}
      <div style={{ fontSize: 50, fontWeight: "bold", marginBottom: 5, color: "#1e293b", alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        Кондиционер ишлаб чиқариш линияси
      </div>
      {/* TOP CARDS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 25, }}    >

        {/* PLAN */}
        <div style={{ flex: 1, borderRadius: 20, padding: 30, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", boxShadow: "0 10px 25px rgba(16,185,129,0.25)", }}      >
          <div style={{ fontSize: 42, opacity: 0.9, }}        >
            Режа
          </div>
          <div style={{ fontSize: 150, fontWeight: "bold", marginTop: 0, alignContent: 'center', display: 'flex', justifyContent: 'center' }}        >
            {count}
          </div>
        </div>
        {/* DONE */}
        <div style={{ flex: 1, borderRadius: 20, padding: 30, background: "linear-gradient(135deg, #4b5563 0%, #1f2937 100%)", color: "white", boxShadow: "0 10px 25px rgba(31,41,55,0.25)", }}      >
          <div style={{ fontSize: 42, opacity: 0.9, }}        >
            Бажарилди
          </div>
          <div style={{ fontSize: 150, fontWeight: "bold", marginTop: 0, alignContent: 'center', display: 'flex', justifyContent: 'center' }}        >
            {t3.reduce((acc, item) => acc + item.count, 0)}
          </div>
        </div>
      </div>
      {/* TABLE BLOCK */}
      <div style={{ background: "white", borderRadius: 20, padding: 25, boxShadow: "0 8px 20px rgba(0,0,0,0.08)", }}    >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, }}      >
          <div style={{ fontSize: 48, fontWeight: "bold", color: "#1e293b", }}        >
            Ишлаб чиқарилган моделлар
          </div>
          <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "8px 16px", borderRadius: 12, fontWeight: "bold", }}        >
            {t3.length} модель
          </div>
        </div>
        <div style={{ borderRadius: 15, overflow: "hidden", }}      >
          {t3Table()}
        </div>
      </div>
    </div>)

  // return (
  //   <div>

  //       <div style={{borderWidth: 1.5, borderRadius: 10, marginTop: 10}}>
  //         <div style={{margin: 10, fontSize: 22}}>T3 Liniya. Bugungi reja: {count} Bajarildi: {t3.reduce((acc, item) => acc + item.count, 0)}</div>
  //         {t3Table()}
  //       </div>
  //   </div>
  // )
} 