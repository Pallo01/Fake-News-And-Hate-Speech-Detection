import React from 'react'
import { Link,useLocation } from "react-router-dom";


export default function Navbar() {
    const location = useLocation();
    return (
        <>
            <nav style={{ backgroundColor: "rgb(205 216 218)" }} className="navbar fixed-top navbar-expand-lg navbar-light" >
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">FN & HS Detection</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/latestNews">LatestNews<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/datasetNews">DatasetNews<span className="sr-only">(current)</span></Link>
                            </li>
                        </ul>
                    </div>
                    <div className="nav navbar-nav navbar-right" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <Link className="nav-link" target="_blank"
                                to="/detectFakeNews">Detect News</Link>
                            <Link className="nav-link" target="_blank"
                                to="/detectHateSpeech">Detect Speech</Link>
                            {location.pathname==="/detectFakeNews" && <Link className="nav-link" target="_blank"
                                to="https://github.com/Pallo01/Fake-News-And-Hate-Speech-Detection/blob/main/fn_modelTraining.ipynb">NoteBook</Link>}
                            {location.pathname==="/detectHateSpeech" && <Link className="nav-link" target="_blank"
                                to="https://github.com/Pallo01/Fake-News-And-Hate-Speech-Detection/blob/main/hs_modelTraining.ipynb">NoteBook</Link>}
                            {location.pathname!=="/detectFakeNews" && location.pathname!=="/detectHateSpeech" && <Link className="nav-link" target="_blank"
                                to="https://github.com/Pallo01/Fake-News-And-Hate-Speech-Detection">Source Code</Link>}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
