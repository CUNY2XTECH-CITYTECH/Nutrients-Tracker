import { Outlet } from "react-router-dom";
import { Header } from "./src/Components/Header";
import { SideBar } from "./src/Components/Sidebar";

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