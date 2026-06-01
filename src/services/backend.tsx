import { Global_Data } from "@/config/config"
import axios, { isAxiosError } from "axios"



export async function Backend_Request(body: any, url: string) {
    let return_data
    await axios.post(Global_Data.server_ip + url,
        body,
      ).then(async (res)=>{

            return_data = {
              result: "ok",
              data: res.data.data
            }
      }).catch(async (error)=>{
        if (isAxiosError(error)){
          try {
            return_data = {
              result: "error 1",
              error: error.response?.data?.error || "Unknown error",
              data: error.response?.data?.data
            }
            return return_data
          } catch (error2) {
            return_data = {
              result: "error 2",
              error: String(error.message)
            }
            return return_data
          }
        }
        console.log("error.response: ", error.response.data, " url: ", url)
          return_data = {
            result: "error 3",
            error: error.response?.data?.error,
            data: error.response?.data?.data
          }
        return return_data
      })
    return return_data
  }

  export async function Backend_Request_File(body: any, url: string) {
    let return_data
    await axios.post(Global_Data.server_ip + url,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ).then(async (res)=>{
            return_data = {
              result: "ok",
              data: res.data.data
            }
      }).catch(async (error)=>{
        if (isAxiosError(error)){
          return_data = {
            result: "error",
            error: String(error.message)
          }
          return return_data
        }
        console.log("error.response: ", error.response.data, " url: ", url)
          return_data = {
            result: "error",
            error: error.response?.data.error || "Unknown error"
          }
        return return_data
      })
    return return_data
  }