import { Backend_Request } from "@/services/backend";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input"
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
import { ShieldBan, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function UserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [login, setLogin] = useState("");

  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState([]);

  const [open, setOpen] = useState(false);

  const columnHelper = createColumnHelper<any>();

  async function changePermission(route_id, status) {
    let data = {
      "route_id": route_id,
      "status": Boolean(status)
    }

    console.log("data: ", data)
    let result = await Backend_Request(data, "/api/user/permission/" + id)
    if (result.result === "error") {
      showErrorToast(result.error);
    } else {
      getUserData()
    }
  }

  const columns = [
    columnHelper.accessor("route", {
      header: "Route",
    }),
    columnHelper.accessor("comment", {
      header: "Comment",
    }),
    columnHelper.display({
      id: "actions",
      header: "Ruxsat",
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="icon" onClick={() => changePermission(row.original.id, !row.original.is_flag)}>
            {row.original.is_flag ? <ShieldCheck color="green" /> : <ShieldBan style={{ color: 'red' }} />}
          </Button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: permissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function permissionsTable() {
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

  async function getUserData() {
    let result = await Backend_Request("", "/api/user/" + id);
    console.log(result)
    if (result.result === "ok") {
      setPermissions(result.data.permissions);
      setLogin(result.data.user_info.login);
      setName(result.data.user_info.name);
    } else {
      showErrorToast(result.error);
    }
  }

  async function changePassword() {
    if (password === "" || password == null) {
      showErrorToast("password xato");
      return
    }
    let data = {
      id: Number(id),
      password: password,
      is_password_update: true
    }
    let result = await Backend_Request(data, "/api/user/update");
    if (result.result === "ok") {
      // showErrorToast("");
      setPassword("")
      // setRepeatPassword("")
      showOkToast("Password changed")
      setOpen(false)
      // handleClose()
    } else {
      showErrorToast(result.error);
    }

  }

  async function saveChanges() {
    let data = {
      id: Number(id),
      login: login,
      name: name,
      is_password_update: false
    }
    console.log(data);

    if (
      login === "" ||
      name === ""
    ) {
      showErrorToast("ma'lumotlar to'liq kiritilmadi");
      return
    }

    if (/^[A-Za-z][A-Za-z0-9]*$/.test(login) === false) {
      showErrorToast("login da faqat xarflar va sonlar kiritilishi shart a-z A-Z");
      return;
    }


    let result = await Backend_Request(data, "/api/user/update");
    if (result.result === "ok") {
      getUserData()
      showOkToast("ma'lumotlar saqlandi")
    } else {
      showErrorToast(result.error);
    }

  }

  function passwordDialog() {
    return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Password ni yangilash</DialogTitle>
          <DialogDescription>
            {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
          </DialogDescription>
        </DialogHeader>
        <input onChange={(e) => setPassword(e.target.value)} placeholder="Password kiriting" />
        {/* <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup> */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={changePassword}>Save changes</Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  }

  async function deleteUser() {
    let data = {
      user_id: Number(id)
    }
    console.log(data)
    let result = await Backend_Request(data, "/api/user/delete");
    if (result.result === "ok") {
      showOkToast("Foydalanuvchi o'chirildi")
      navigate("/users");
    } else {
      showErrorToast(result.error);
    }
  }

  function deleteUserDialog() {
    return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Delete</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Foydalanuvchini o'chirish</DialogTitle>
          <DialogDescription>
            {login} ni o'chirishni tasdiqlaysizmi?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Bekor</Button>
          </DialogClose>
          <Button onClick={deleteUser}>Tasdiqlash</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'row', width: '50%' }}>
            <Input style={{ marginRight: 5 }} onChange={(e) => setLogin(e.target.value)} value={login} placeholder="login" />
            <Input onChange={(e) => setName(e.target.value)} value={name} placeholder="user name" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10 }}>
            {passwordDialog()}
            <Button onClick={saveChanges} style={{ marginLeft: 10 }} variant="outline" >Save</Button>
          </div>
        </div>
        <div>
          <Button onClick={()=>setOpen(true)} style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }} variant="outline" >Delete</Button>
        </div>
      </div>

      <div style={{ borderWidth: 1, borderRadius: 10, marginTop: 10 }}>
        {permissionsTable()}
      </div>
      {deleteUserDialog()}
    </div>
  );
}