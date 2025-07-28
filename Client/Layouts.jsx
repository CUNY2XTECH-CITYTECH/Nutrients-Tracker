import { Outlet } from "react-router-dom";
import { Header } from "./src/Componets/Header";

export function Layout () {
    return (
        <>
            <Header/>
            <main>
                <Outlet/>
            </main>
        </>
    )
}