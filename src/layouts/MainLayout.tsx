import { NavigationMenuAC } from "@/components/navigation";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div style={{margin: 0, padding: 0}}>
      <NavigationMenuAC />

      <div>
        <Outlet />
      </div>
    </div>
  );
}