"use client"
// import { Button } from "@/components/ui/button";
import { Backend_Request } from "@/services/backend";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";

type Person = {
  id: number
  login: string
  name: string
  role: string
  role_id: number
  status: boolean
}

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const newUserNameRef = useRef(null)
  const newUserLoginRef = useRef(null)
  const newUserPasswordRef = useRef(null)
  const newUserPassword2Ref = useRef(null)

  const columnHelper = createColumnHelper<Person>();

  const columns = [
    columnHelper.accessor("login", {
      header: "Login",
    }),
    columnHelper.accessor("name", {
      header: "Name",
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


  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    let result = await Backend_Request("", "/api/user/getall");
    if (result.result === "ok") {
      setUsers(result.data);
    } else {
      // showErrorToast(result.error);
    }
  }

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });


  function usersTable() {
    return (
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
        <TableBody className="cursor-pointer">
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => navigate(`/user/${row.original.id}`)}
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

  async function addUser() {
    console.log("newuserName: ", newUserNameRef.current?.value);
    console.log("newuserLogin: ", newUserLoginRef.current?.value);
    console.log("newuserPassword: ", newUserPasswordRef.current?.value);
    console.log("newuserPassword2: ", newUserPassword2Ref.current?.value);
    if (!newUserNameRef.current?.value || !newUserLoginRef.current?.value || !newUserPasswordRef.current?.value || !newUserPassword2Ref.current?.value) {
      showErrorToast("Ma'lumotlarni to'liq kiriting");
      return;
    }
    if (newUserPasswordRef.current?.value !== newUserPassword2Ref.current?.value) {
      showErrorToast("Password mos kelmadi");
      return;
    }

    if (/^[A-Za-z][A-Za-z0-9]*$/.test(newUserLoginRef.current?.value) === false) {
      showErrorToast("login da faqat xarflar kiritilishi shart a-z A-Z");
      return
    }

    let data = {
      login: newUserLoginRef.current.value,
      name: newUserNameRef.current.value,
      password: newUserPasswordRef.current.value,
      role_id: Number(1),
    }
    let result = await Backend_Request(data, "/api/user/create");
    console.log(result);
    if (result.result === "ok") {
      showOkToast("Kiritildi")
      setOpen(false)
      fetchUsers();
      return
    } else {
      showErrorToast(result.error);
      return
    }

  }
    const [open, setOpen] = useState(false)

  function addUserDialog() {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" style={{ borderWidth: 1.5, marginTop: 10 }}>Yangi foydalanuvchi kiritish</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Yangi foydalanuvchi kiritish</DialogTitle>
            <DialogDescription>
              Foydalanuvchi ma'lumotlarini kiriting. Saqlash tugmasini bosing.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Login</Label>
              <Input ref={newUserLoginRef} id="name-1" name="name" defaultValue="" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Ismi</Label>
              <Input ref={newUserNameRef} id="username-1" name="username" defaultValue="" />
            </Field>
            <Field>
              <Label htmlFor="password-1">Password</Label>
              <Input ref={newUserPasswordRef} id="password-1" name="password" defaultValue="" />
            </Field>
            <Field>
              <Label htmlFor="password-2">Password qayta kiriting</Label>
              <Input ref={newUserPassword2Ref} id="password-2" name="password-2" defaultValue="" />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Bekor qilish</Button>
            </DialogClose>
            <Button onClick={addUser}>Kiritish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div>
      <div style={{ borderWidth: 1.5, borderRadius: 10 }}>
        {usersTable()}
      </div>
      {addUserDialog()}
    </div>

  )
}