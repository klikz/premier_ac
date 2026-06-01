import { Global_Data } from "@/config/config";
import { Backend_Request } from "@/services/backend";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage(){

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    // const [errorText, setErrorText] = useState('')

    // function showOkToast(text: string) {
    //     toast(text, {
    //         // description: "Sunday, December 03, 2023 at 9:00 AM",
    //         style: {
    //             backgroundColor: "rgba(8, 113, 8, 0.5)",
    //             color: "white",
    //         },
    //         position: 'top-right'
    //         //   action: {
    //         //     label: "Undo",
    //         //     onClick: () => console.log("Undo"),
    //         //   },
    //     })
    // }

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

    async function handleLogin() {

      let data = {
        login,
        password
      }

      console.log("data: ", data)
        const result = await Backend_Request(data, "/user/login");
        console.log("result: ", result)
        if (result && result.result === "ok") {
            Global_Data.setUserData(true, 
                result.data.token, 
                result.data.role, 
                result.data.id, 
                result.data.login, 
                result.data.name, 
                result.data.role_id);
                await Global_Data.loadLocalData()
                window.location.href = "/main"
            
          // window.location.reload();
        }else{
          showErrorToast(result.error)
        }
        
      };


    return (
       <div style={styles.container}>
      <div 
            style={styles.card} onSubmit={handleLogin}>
        <h2 style={styles.title}>Login</h2>

        <input
          style={styles.input}
          

        //   type="email"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <input
          style={styles.input}
          
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

          <button style={styles.button} type="submit" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  },
  card: {
    background: "#fff",
    padding: "36px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "300px",
  },
  title: {
    textAlign: "center",
    marginBottom: "6px",
    color: "#111827",
    fontSize: "20px",
    fontWeight: 700,
  },
  input: {
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    color: "#111827",
    outlineColor: "#16a34a",
  },
  button: {
    padding: "11px",
    borderRadius: "8px",
    border: "none",
    background: "#16a34a",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};