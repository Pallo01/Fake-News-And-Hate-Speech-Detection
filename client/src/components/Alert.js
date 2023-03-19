import React from 'react'
function Alert(props) {
    return (
        <div style={{height: '50px',marginTop:"56px"}} className="fixed-top ">
        {props.alert && <div className={`alert alert-${props.alert.label} alert-dismissible fade show `} role="alert">
           <strong>{props.alert.msg}</strong>: {props.alert.text}
        </div>}
        </div>
    )
}

export default Alert