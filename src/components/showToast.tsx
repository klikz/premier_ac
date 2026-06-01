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
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                color: "white",
                justifyContent: 'center',
            },
            position: 'top-center'
        })
}