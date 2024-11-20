import { useState } from "react";
import Nav from "../../components/back/Nav";
import Footer from "../../components/back/Footer";
import Aside from "../../components/back/Aside";
import Services from "../../components/back/Services";
import Categories from "../../components/back/Categories";
import Boncommande from "../../components/back/Boncommande";
import Categoriebdc from "../../components/back/Categoriebdc";
import Affmateriels from "../../components/back/Affmateriels";
import Users from "../../components/back/Users";
import Materiels from "../../components/back/Materiels";

function Dashboard({ handleLogout }) {
    const [activeComponent, setActiveComponent] = useState("Statistiques");

    const renderComponent = () => {
        switch (activeComponent) {
            case "Services":
                return <Services />;
            case "Materiels":
                return <Materiels />;
            case "Categories":
                return <Categories />;
            case "Affmateriels":
                return <Affmateriels />;
            case "Boncommande":
                return <Boncommande />;
            case "Categoriebdc":
                return <Categoriebdc />;
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
