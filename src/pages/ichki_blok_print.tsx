import { Backend_Request } from "@/services/backend";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export default function IchkiBlokPrint() {

  const { id } = useParams();

  const inputRef = useRef(null)

  const [gsCodes, setGsCodes] = useState(null)

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

  const line_id = 7

  const [printers, setPrinters] = useState([])
  const [selectedPrinter, setSelectedPrinter] = useState(null)

  const [printEnable, setPrintEnable] = useState(false)

  const serialRef = useRef(null)

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

  async function getGsCodesCount() {
    let result = await Backend_Request({}, "/api/tech/gscode/count")
    console.log("gscode count: ", result)
    setGsCodes(0)
    setPrintEnable(false)
    if (result.result === "ok") {
      result.data.forEach((element: any) => {
        console.log("element: ", element.model_id, " id: ", id, " match: ", element.model_id == id)
        console.log("element count: ", element.count)
        if (element.model_id == id) {
          setGsCodes(element.count)
          if (element.count > 0){
            console.log("print enable: true")
            console.log("gs codes: ", element.count)
            setPrintEnable(true)
          }
        } 
      })
    } else {
      showErrorToast(result.error);
    }
  }

  async function printLabel() {
    if (inputRef.current.value > gsCodes) {
      showErrorToast("Print qilish uchun yetarli gsCode mavjud emas");
      return;
    }
    let data = {
      line_id: Number(line_id),
      model_id: Number(id),
      printer_id: Number(selectedPrinter.id),
      quantity: Number(inputRef.current.value)
    }

    let result = await Backend_Request(data, "/api/lines/ichki/print")
    if (result.result === "ok") {
      showOkToast("Product qo'shildi");
      getGsCodesCount()
    } else {
      showErrorToast(result.error);
      getGsCodesCount()
    }
  }

  async function rePrintLabel() {
    let data = {
      serial: serialRef.current.value,
      printer_id: Number(selectedPrinter.id)
    }

    let result = await Backend_Request(data, "/api/lines/ichki/reprint")
    if (result.result === "ok") {
      showOkToast("Qayta chiqarildi");
      
    } else {
      showErrorToast(result.error);
    }
    serialRef.current.value = ""
  }

  function headerButtons() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div >
          <div className="" style={{ alignItems: 'center', borderWidth: 2, borderStyle: 'solid', borderRadius: 10, padding: 10 }}>
            <div>
              <Button variant="ghost" style={{ margin: 0, padding: 0, marginRight: 15 }} onClick={() => navigate(`/t1`)} > {"<- Model tanlash"}  </Button>
            </div>
            <div style={{ marginRight: 15 }}>I1: Printerni tanlang</div>
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

        </div>
        <div style={{ alignItems: 'center', borderWidth: 2, borderStyle: 'solid', borderRadius: 10, padding: 10, marginLeft: 10 }}>
          <div>Model Nomi: {model?.model_nomi}</div>
          <div>Modeli: {model?.modeli}</div>
          <div>Rangi: {model?.rangi}</div>
        </div>
        <div style={{ alignItems: 'center', borderWidth: 2, borderStyle: 'solid', borderRadius: 10, padding: 10, marginLeft: 10 }}>
          <div>GsCode soni: {gsCodes}</div>
          <div>Printerdan chiqarish</div>
          <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: 120, flexDirection: 'row', display: 'flex', alignItems: 'center' }}>Soni:
              <Input
                style={{ width: 120, marginLeft: 5 }}
                ref={inputRef} id="input-demo-api-key" type="number" placeholder="2"

              />
            </div>
            <div>
              <Button disabled={!printEnable} onClick={printLabel} >Print</Button>
            </div>
          </div>

        </div>

      </div>

    )
  }

  useEffect(() => {
    modelsGetAll();
    printersGetAll();
    getGsCodesCount();
    inputRef.current.value = 2
  }, []);

  return (
    <div>
      {headerButtons()}
      <div style={{ marginTop: 10 }}>

        <Input
          style={{ width: 150, marginLeft: 5 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              rePrintLabel()
            }
          }}
          ref={serialRef} id="input-demo-api-key" type="text" placeholder="Qayta chiqarish"

        />
        <Button onClick={rePrintLabel} style={{marginLeft: 10}}>Print</Button>
      </div>
    </div>
  );
}
