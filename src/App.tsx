import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/home"
import UsersPage from "./pages/users"
import UserPage from "./pages/user_id"
import MainLayout from "./layouts/MainLayout"
import { Global_Data } from "./config/config";
import LoginPage from "./pages/login";
import T1 from "./pages/t1"
import T1Print from "./pages/t1_print"
import T2Print from "./pages/t2"
import T3Print from "./pages/t3_print"
import ModelsPage from "./pages/models"
import GsCodePgae from "./pages/gscode"
import PrintersPage from "./pages/printers"
import ModelsIdPage from "./pages/model_id"
import IchkiBlok from "./pages/ichki_blok"
import IchkiBlokPrint from "./pages/ichki_blok_print"
import RePrintPage from "./pages/re_print"
import LinesReport from "./pages/lines_report"
import GsCodesReport from "./pages/gscode_report"
import Dashboard from "./pages/dashboard"
import RejaPage from "./pages/reja"

export function App() {
  let isLogged = false;
  Global_Data.loadLocalData();
  isLogged = Global_Data.isAuth();
  
  if (!isLogged) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }else{
    return (
    <div style={{padding: 10}}>
      
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" />} />
            <Route index path="/home" element={<Home />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route path="/t1" element={<T1 />} />
            <Route path="/t1/:id" element={<T1Print />} />
            <Route path="/t2" element={<T2Print />} />
            <Route path="/t3" element={<T3Print />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/models/:id" element={<ModelsIdPage />} />
            <Route path="/gscode" element={<GsCodePgae />} />
            <Route path="/gscode/report" element={<GsCodesReport />} />
            <Route path="/printers" element={<PrintersPage />} />
            <Route path="/i1" element={<IchkiBlok />} />
            <Route path="/i1/:id" element={<IchkiBlokPrint />} />
            <Route path="/reprint" element={<RePrintPage />} />
            <Route path="/report" element={<LinesReport />} />
            <Route path="/reja" element={<RejaPage />} />
            
            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
        </Routes>
      </div>
      
      {/* <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div> */}
    </div>
  )

  }
  
  
}


export default App

// import { Routes, Route, Link } from "react-router-dom";
// import Home from "./pages/home";

// export default function App() {

//   const value = {
//     ripple: true,
//     appendTo: 'self',
//     cssTransition: false
// };

//   return (
//     <div>
//       {/* <nav style={{ display: "flex", gap: 10 }}>
//         <Link to="/">Home</Link>
//       </nav> */}

//       <Routes>
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </div>
//   );
// }

