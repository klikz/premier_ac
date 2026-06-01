import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Backend_Request } from "@/services/backend";

import { useDropzone } from 'react-dropzone';

import { Button } from "@/components/ui/button";

export default function ModelsIdPage() {

    const { id } = useParams();
    const [model, setModel] = useState<any>()

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
        if (result.result === "ok") {
            setModel(result.data.find(model => model.id === Number(id)))
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

        console.log("Sending file:", selectedFile);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);

        reader.onload = async () => {
            let result = await Backend_Request({ file64: reader.result, id: Number(id) }, "/api/tech/models/update")
            if (result.result === "ok") {
                showOkToast("Ma'lumot yangilandi");
                modelsGetAll();
            } else {
                showErrorToast(result.error);
            }
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
                        <p>Yangilash...</p>
                    ) : (
                        <div className="space-y-2">
                            <p>Yangilash...</p>

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

    

    useEffect(() => {
        modelsGetAll();
    }, []);
    return (
        <div style={{  }}>
            <div style={{ alignItems: 'end', display: 'flex', justifyContent: 'flex-end' }}>
                {fileUploader()}
            </div>
            <div>Seriya_raqami: {model?.seriya_raqami}</div>
            <div>Artikiul_raqami: {model?.artikiul_raqami}</div>
            <div>Modeli: {model?.modeli}</div>
            <div>Konditsioner_turi: {model?.konditsioner_turi}</div>
            <div>Model_nomi: {model?.model_nomi}</div>
            <div>Model_nomi: {model?.odoo_code}</div>
            <div>Rangi: {model?.rangi}</div>
            <div>Konditsioner_quvvati: {model?.konditsioner_quvvati}</div>
            <div>Sotuv_turi: {model?.sotuv_turi}</div>
            <div>Reg_No_GS1: {model?.reg_no_gs1}</div>
            <div>GS1_EAN13: {model?.gs1_ean13}</div>
            <div>GS1_Guvoxnoma_raqami: {model?.gs1_guvxnoma_raqami}</div>
            <div>GOST: {model?.gost}</div>
            <div>Maxalliy_sertifikat: {model?.maxalliy_sertifikat}</div>
            <div>EAC_Sertifikati: {model?.eac_sertifikati}</div>
            <div>CE_Sertifikat: {model?.ce_sertifikat}</div>
            <div>Ishlab_chiqaruvchi_mamlakat: {model?.ishlab_chiqaruvchi_mamlakat}</div>
            <div>Korxon_nomi: {model?.korxon_nomi}</div>
            <div>Manzil: {model?.manzil}</div>
            <div>Brend: {model?.brend}</div>
            <div>Netto: {model?.netto}</div>
            <div>Brutto: {model?.brutto}</div>
            <div>Qadoq_hajmi: {model?.qadoq_hajmi}</div>
            <div>Mahsulot_hajmi: {model?.mahsulot_hajmi}</div>
            <div>Tok_quvvati: {model?.tok_quvvati}</div>
            <div>Chastota: {model?.chastota}</div>
            <div>Istemol_quvvat: {model?.istemol_quvvat}</div>
            <div>Istemol_quvvat_diapazoni_sovutishda: {model?.istemol_quvvat_diapazoni_sovutishda}</div>
            <div>Istemol_quvvat_isitishda: {model?.istemol_quvvat_isitishda}</div>
            <div>Istemol_quvvat_diapazoni_isitishda: {model?.istemol_quvvat_diapazoni_isitishda}</div>
            <div>Tok_kuchi_sovutishda: {model?.tok_kuchi_sovutishda}</div>
            <div>Tok_kuchi_diapazoni_sovutishda_A: {model?.tok_kuchi_diapazoni_sovutishda_A}</div>
            <div>Maksimal_tok_kuchi_sovutishda: {model?.maksimal_tok_kuchi_sovutishda}</div>
            <div>Tok_kuchi_Isitishda: {model?.tok_kuchi_isitishda}</div>
            <div>Tok_kuchi_diapazoni_isitishda_A: {model?.tok_kuchi_diapazoni_isitishda_A}</div>
            <div>Maksimal_tok_kuchi_isitishda: {model?.maksimal_tok_kuchi_isitishda}</div>
            <div>Iqlim_sharoitlari: {model?.iqlim_sharoitlari}</div>
            <div>Sovutish_quvvati_btb: {model?.sovutish_quvvati_btb}</div>
            <div>Sovutish_quvvati_diapazon_btb: {model?.sovutish_quvvati_diapazon_btb}</div>
            <div>Sovutish_quvvati_kvt: {model?.sovutish_quvvati_kvt}</div>
            <div>Sovutish_quvvati_diapazon_kvt: {model?.sovutish_quvvati_diapazon_kvt}</div>
            <div>Isitish_quvvati_btb: {model?.isitish_quvvati_btb}</div>
            <div>Isitish_quvvati_diapazon_btb: {model?.isitish_quvvati_diapazon_btb}</div>
            <div>Isitish_quvvati_kvt: {model?.isitish_quvvati_kvt}</div>
            <div>Isitish_quvvati_diapazon_kvt: {model?.isitish_quvvati_diapazon_kvt}</div>
            <div>TEN: {model?.ten}</div>
            <div>Isitish_quvvati_ten_bilan_btu: {model?.isitish_quvvati_ten_bilan_btu}</div>
            <div>Isitish_quvvati_TEN_bilan_kvt: {model?.isitish_quvvati_TEN_bilan_kvt}</div>
            <div>Istemol_quvvati_TEN_bilan_kvt: {model?.istemol_quvvati_TEN_bilan_kvt}</div>
            <div>Istemol_tok_kuchi_TEN_bilan_A: {model?.istemol_tok_kuchi_TEN_bilan_A}</div>
            <div>TEN_quvvati_kvt: {model?.ten_quvvati_kvt}</div>
            <div>Maksimal_istemol_quvvati_Sovutishda: {model?.maksimal_istemol_quvvati_Sovutishda}</div>
            <div>Maksimal_istemol_quvvati_Isitishda: {model?.maksimal_istemol_quvvati_Isitishda}</div>
            <div>Xavo_unumdorligi_m3: {model?.xavo_unumdorligi_m3}</div>
            <div>Freon: {model?.freon}</div>
            <div>Freon_hajmi: {model?.freon_hajmi}</div>
            <div>Chiquvchi_bosim: {model?.chiquvchi_bosim}</div>
            <div>Kiruvchi_bosim: {model?.kiruvchi_bosim}</div>
            <div>Himoya_darajasi: {model?.himoya_darajasi}</div>
            <div>Energo_klass_sovutishda_SEER: {model?.energo_klass_sovutishda_SEER}</div>
            <div>Energo_klass_sovutishda_SCOP: {model?.energo_klass_sovutishda_SCOP}</div>
            <div>SEER_quvvat: {model?.seer_quvvat}</div>
            <div>SCOP_quvvat: {model?.scop_quvvat}</div>
            <div>SEER: {model?.seer}</div>
            <div>SCOP: {model?.scop}</div>
            <div>SCOP_xudud: {model?.scop_xudud}</div>
            <div>Yillik_sarf_SEER_kVt: {model?.yillik_sarf_seer_kv}</div>
            <div>Yillik_sarf_SCOP_kVt: {model?.yillik_sarf_scop_kv}</div>
            <div>Shovqin_darajasi_ichki_blok_dB: {model?.shovqin_darajasi_ichki_blok_db}</div>
            <div>Shovqin_darajasi_tashqi_blok_dB: {model?.shovqin_darajasi_tashqi_blok_db}</div>
            <div>Mos_keluvchi_tashqi_blok_va_ichki_blok_model: {model?.mos_keluvchi_tashqi_blok_va_ichki_blok_model}</div>
            <div>Quvvat_omili: {model?.quvvat_omili}</div>
            <div>Isitish: {model?.isitish}</div>
            <div>Sovutish_turi: {model?.sovutish_turi}</div>
            <div>Energostandart: {model?.energostandart}</div>
            <div>Qoshimcha: {model?.qoshimcha}</div>
            <div>Kafolat_taloni: {model?.kafolat_taloni}</div>
            <div>Model_tex_param_stiker: {model?.model_tex_param_stiker}</div>
            <div>Korobka_tex_param_stiker: {model?.korobka_tex_param_stiker}</div>
            <div>Energoeffektivnost: {model?.energoeffektivnost}</div>
            <div>Aksessuar: {model?.aksessuar}</div>
            <div>Aksessuar_stiker: {model?.aksessuar_stiker}</div>
            <div>Lenta: {model?.lenta}</div>
            <div>Kabel: {model?.kabel}</div>
            <div>Shlang: {model?.shlang}</div>
            <div>Dekor: {model?.dekor}</div>
            <div>Truba_1_diametr: {model?.truba_1_diametr}</div>
            <div>Truba_2_diametr: {model?.truba_2_diametr}</div>
            <div>Truba_uzunligi: {model?.truba_uzunligi}</div>
            <div>Kronshteyn: {model?.kronshteyn}</div>
            <div>Import code: {model?.import_code}</div>
            <div>Status: {String(model?.status)}</div>
        </div>
    )
}