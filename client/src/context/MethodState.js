import { useState} from "react";
import { createContext } from "react";
import Axios from "axios";
const MethodContext = createContext();


const MethodState = (props) => {
    const [results, setresults] = useState({});
    function calculatePercentage(result) {
        let models = Object.keys(result);
        let total = models.length
        let totalReal = 0;
        models.forEach((i) => {
            if (result[i] === "1") {
                totalReal = totalReal + 1;
            }
        });
        let percent = (totalReal / total) * 100;
        return Math.ceil(percent);
    }

    const predict = async (url,text) => {
        try {
            const response = await Axios.post(url, { text: text });
            let res = await response.data;
            if (res.status === "success") {
                setresults(res.result);
            }
            return res;
        } catch (err) {
            console.log(err);
            return {"status":"fail"};
        }
    };
    function countWords(text) {
        return text.split(/\s+/).filter((element) => {
          return element.length !== 0;
        }).length;
    }
    return (
        <MethodContext.Provider value={{ predict,results,calculatePercentage,countWords}}>
            {props.children}
        </MethodContext.Provider>
    )

}
export { MethodState, MethodContext };