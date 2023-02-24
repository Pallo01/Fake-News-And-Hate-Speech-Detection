import React from 'react'
function Alert(props) {
    return (
        <div style={{height: '50px',marginTop:"56px"}} className="fixed-top ">
        {props.alert && <div className={`alert alert-danger alert-dismissible fade show `} role="alert">
           <strong>Invalid Input</strong>: Enter atleast 10 Words for prediction, Currently entered {props.alert.msg} words.
        </div>}
        </div>
    )
}

export default Alert