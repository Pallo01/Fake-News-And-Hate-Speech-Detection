import { useState} from "react";
import { createContext } from "react";
import Axios from "axios";
const MethodContext = createContext();


const MethodState = (props) => {
    const url = "http://localhost:5000/predict";
    const [results, setresults] = useState({});
    function calculatePercentage(result) {
        let models = Object.keys(result);
        let total = 0,
            totalReal = 0;
        models.forEach((i) => {
            if (result[i] === "1") {
                totalReal = totalReal + 1;
            }
            total = total + 1;
        });
        let percent = (totalReal / total) * 100;
        return Math.ceil(percent);
    }

    const predict = async (newsText) => {
        try {
            const response = await Axios.post(url, { text: newsText });
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
    return (
        <MethodContext.Provider value={{ predict,results,calculatePercentage}}>
            {props.children}
        </MethodContext.Provider>
    )

}
export { MethodState, MethodContext };