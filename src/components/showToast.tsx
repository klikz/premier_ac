import { toast } from "sonner";

export function ShowOKToast(text: string){
        toast(text, {
            style: {
                backgroundColor: "rgba(8, 113, 8, 0.5)",
                color: "white",
            },
            position: 'top-right'
        })
}

export function ShowErrorToast(text: string) {
        toast(text, {
            style: {
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                color: "white",
                justifyContent: 'center',
            },
            position: 'top-center'
        })
}