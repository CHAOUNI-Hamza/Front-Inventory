import { useState } from "react";
import Nav from "../../components/back/Nav";
import Footer from "../../components/back/Footer";
import Aside from "../../components/back/Aside";
import Articles from "../../components/back/Articles";
import Equipes from "../../components/back/Equipes";
import Laboratoires from "../../components/back/Laboratoires";
import Livres from "../../components/back/Livres";
import Doctorants from "../../components/back/Doctorants";
import Users from "../../components/back/Users";
import Statistiques from "../../components/back/Statistiques";

function Dashboard({ handleLogout }) {
    const [activeComponent, setActiveComponent] = useState("Statistiques");

    const renderComponent = () => {
        switch (activeComponent) {
            case "Articles":
                return <Articles />;
            case "Statistiques":
                return <Statistiques />;
            case "Equipes":
                return <Equipes />;
            case "Doctorants":
                return <Doctorants />;
            case "Laboratoires":
                return <Laboratoires />;
            case "Livres":
                return <Livres />;
            case "Users":
            default:
                return <Users />;
        }
    };

    return (
        <div className="wrapper">
            <Nav handleLogout={handleLogout}/>

            <Aside setActiveComponent={setActiveComponent} activeComponent={activeComponent} />

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">FLSHM</h1>
                            </div>
                            {/*<div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active">Starter Page</li>
                                </ol>
    </div>*/}
                        </div>
                    </div>
                </div>

                <div className="content">
                    <div className="container-fluid">
                        {renderComponent()}
                    </div>
                </div>
            </div>

            <aside className="control-sidebar control-sidebar-dark">
                <div className="p-3">
                    <h5>Title</h5>
                    <p>Sidebar content</p>
                </div>
            </aside>

            <Footer />
        </div>
    );
}

export default Dashboard;
