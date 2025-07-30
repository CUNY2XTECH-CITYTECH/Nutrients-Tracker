import { Outlet } from "react-router-dom";
import { Header } from "./src/Componets/Header";
import { SideBar } from "./src/Componets/Sidebar";

export function Layout () {
    return (
        <>
            <Header/>
            <div className="content-container">
                <SideBar/>
                <main>
                    <Outlet/>
                </main>
            </div>
        </>
    )
}