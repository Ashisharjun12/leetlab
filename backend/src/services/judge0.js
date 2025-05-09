import axios from "axios"
import { _config } from "../config/config.js"

export const getJudge0LanguageId = (langguage)=>{
    const languageMap = {
        'PYTHON':71,
        'JAVA':62,
        'JAVASCRIPT':63
    }

    return languageMap[langguage.toUpperCase()]

}



export const submitBatch = async(submissions)=>{
    const {data } =  await axios.post(`${_config.JUDGE0_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })

    console.log("sub data:",data)
    return data
}



const sleep = (ms)=> new Promise((resolve)=>setTimeout(resolve , ms))




export const pollbatchResults =async (tokens)=>{
    while(true){
        const {data}= await axios.get(`${_config.JUDGE0_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(','),
                base64_encoded:false
            }
        })

        const results = data.submissions;

        const isAllDone = results.every((r)=>r.status.id !==1 && r.status.id !== 2)
        if(isAllDone) return results

        await sleep(1000)
    }

}