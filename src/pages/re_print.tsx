import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Backend_Request } from "@/services/backend"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner";
import { Button } from "@/components/ui/button"

export default function RePrintPage() {

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

    const t1_id = 4
    const t2_id = 5
    const t3_id = 6

    const [t1Printers, setT1Printers] = useState([])
    const [selectedT1Printer, setSelectedT1Printer] = useState(null)
    const [t2Printers, setT2Printers] = useState([])
    const [selectedT2Printer, setSelectedT2Printer] = useState(null)
    const [t3Printers, setT3Printers] = useState([])
    const [selectedT3Printer, setSelectedT3Printer] = useState(null)

    async function printersGetAll() {

        const t1 = [];
        const t2 = [];
        const t3 = [];

        let result = await Backend_Request({}, "/api/lines/printers/all")
        if (result.result === "ok") {
            result.data.forEach((item) => {
                switch (item.line_id) {
                    case t1_id:
                        t1.push(item);
                        break;
                    case t2_id:
                        t2.push(item);
                        break;
                    case t3_id:
                        t3.push(item);
                        break;
                }
            })
            setT1Printers(t1);
            setSelectedT1Printer(t1[0]);
            setT2Printers(t2);
            setSelectedT2Printer(t2[0]);
            setT3Printers(t3);
            setSelectedT3Printer(t3[0]);
        } else {
            showErrorToast(result.error);
        }
    }

    const t1InputRef = useRef(null);
    const t2InputRef = useRef(null);
    const t3InputRef = useRef(null);

    async function T1Print() {
        let data = {
            serial: t1InputRef.current.value,
            printer_id: Number(selectedT1Printer.id)
        }
        let result = await Backend_Request(data, "/api/lines/t1/serialreprint")
        if (result.result === "ok") {
            showOkToast("T1 Qayta chiqarildi");
            t1InputRef.current.value = "";
            t1InputRef.current.focus();
        } else {
            showErrorToast(t1InputRef.current.value + ": " + result.error);
            t1InputRef.current.value = "";
            t1InputRef.current.focus();
        }
    }

    async function T2Print() {
        let data = {
            serial: t2InputRef.current.value,
            printer_id: Number(selectedT2Printer.id),
            reprint: true
        }

        let result = await Backend_Request(data, "/api/lines/t2/serialprint")
        if (result.result === "ok") {
            showOkToast(t2InputRef.current.value + ": Qayta chiqarildi");
            t2InputRef.current.value = ""
            t2InputRef.current?.focus()
        } else {
            showErrorToast(t2InputRef.current.value + ": " + result.error);
            t2InputRef.current.value = ""
            t2InputRef.current?.focus()
        }
    }

      async function T3Print() {
    let data = {
      serial: t3InputRef.current.value,
      printer_id: Number(selectedT3Printer.id),
      reprint: true
    }

    let result = await Backend_Request(data, "/api/lines/t3/serialprint")
    if (result.result === "ok") {
      showOkToast(t3InputRef.current.value + ": Qayta chiqarildi");
      t3InputRef.current.value = ""
      t3InputRef.current?.focus()
    } else {
      showErrorToast(t3InputRef.current.value + ": " + result.error);
      t3InputRef.current.value = ""
      t3InputRef.current?.focus()
    }
  }

    useEffect(() => {
        printersGetAll();
    }, []);
    return (
        <div>
            <div style={{marginBottom: 5}}>
            Serial nomer bo'yicha qayta chiqarish

            </div>
            <div style={{ borderWidth: 1, borderColor: 'black', borderRadius: 10, padding: 5, width: 'fit-content' }}>
                T1 Liniya
                <div style={{ alignItems: 'start', justifyContent: 'start', display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <RadioGroup
                            value={selectedT1Printer?.id}
                            orientation="vertical"
                            style={{}}
                            onValueChange={(value) => setSelectedT1Printer(t1Printers.find((printer) => printer.id === Number(value)))}>
                            {t1Printers.map((printer) => {
                                return <div style={{
                                    display: 'flex', width: 200, flexDirection: 'row',
                                    borderWidth: 1, borderColor: 'black', borderStyle: 'solid', borderRadius: 10,
                                    padding: 5, marginLeft: 5, height: 30, background: 'rgba(0,0,0,0.05)'
                                }}
                                    key={printer.id} >
                                    <RadioGroupItem style={{}} value={printer.id} id={printer.id} />
                                    <Label style={{ width: 200, }} htmlFor={printer.id}>{printer.printer_name}</Label>
                                </div>
                            })}
                        </RadioGroup>
                    </div>
                    <div style={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <Input
                                style={{ borderWidth: 1, borderColor: 'black', height: 30 }}
                                ref={t1InputRef} id="t1input" type="text" placeholder="T1 Serial nomer" />
                        </div>
                        <div>
                            <Button onClick={T1Print} style={{ width: '100%', marginTop: 5, borderRadius: 10, borderWidth: 1, borderColor: 'black' }} >Print</Button>
                        </div>
                    </div>
                </div>

            </div>


            <div style={{ borderWidth: 1, borderColor: 'black', borderRadius: 10, padding: 5, width: 'fit-content', marginTop: 15 }}>
                T2 Liniya
                <div style={{ alignItems: 'start', justifyContent: 'start', display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <RadioGroup
                            value={selectedT2Printer?.id}
                            orientation="vertical"
                            style={{}}
                            onValueChange={(value) => setSelectedT2Printer(t2Printers.find((printer) => printer.id === Number(value)))}>
                            {t2Printers.map((printer) => {
                                return <div style={{
                                    display: 'flex', width: 200, flexDirection: 'row',
                                    borderWidth: 1, borderColor: 'black', borderStyle: 'solid', borderRadius: 10,
                                    padding: 5, marginLeft: 5, height: 30, background: 'rgba(0,0,0,0.05)'
                                }}
                                    key={printer.id} >
                                    <RadioGroupItem style={{}} value={printer.id} id={printer.id} />
                                    <Label style={{ width: 200, }} htmlFor={printer.id}>{printer.printer_name}</Label>
                                </div>
                            })}
                        </RadioGroup>
                    </div>
                    <div style={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <Input
                                style={{ borderWidth: 1, borderColor: 'black', height: 30 }}
                                ref={t2InputRef} id="t2input" type="text" placeholder="T2 Serial nomer" />
                        </div>
                        <div>
                            <Button onClick={T2Print} style={{ width: '100%', marginTop: 5, borderRadius: 10, borderWidth: 1, borderColor: 'black' }} >Print</Button>
                        </div>
                    </div>
                </div>

            </div>

                        <div style={{ borderWidth: 1, borderColor: 'black', borderRadius: 10, padding: 5, width: 'fit-content', marginTop: 15 }}>
                T3 Liniya
                <div style={{ alignItems: 'start', justifyContent: 'start', display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <RadioGroup
                            value={selectedT3Printer?.id}
                            orientation="vertical"
                            style={{}}
                            onValueChange={(value) => setSelectedT3Printer(t3Printers.find((printer) => printer.id === Number(value)))}>
                            {t3Printers.map((printer) => {
                                return <div style={{
                                    display: 'flex', width: 200, flexDirection: 'row',
                                    borderWidth: 1, borderColor: 'black', borderStyle: 'solid', borderRadius: 10,
                                    padding: 5, marginLeft: 5, height: 30, background: 'rgba(0,0,0,0.05)'
                                }}
                                    key={printer.id} >
                                    <RadioGroupItem style={{}} value={printer.id} id={printer.id} />
                                    <Label style={{ width: 200, }} htmlFor={printer.id}>{printer.printer_name}</Label>
                                </div>
                            })}
                        </RadioGroup>
                    </div>
                    <div style={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <Input
                                style={{ borderWidth: 1, borderColor: 'black', height: 30 }}
                                ref={t3InputRef} id="t3input" type="text" placeholder="T3 Serial nomer" />
                        </div>
                        <div>
                            <Button onClick={T3Print} style={{ width: '100%', marginTop: 5, borderRadius: 10, borderWidth: 1, borderColor: 'black' }} >Print</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}