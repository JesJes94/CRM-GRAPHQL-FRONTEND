import { useContext } from "react";
import PedidosContext from "../context/PedidosContext";

export default function usePedidos() {
    return useContext(PedidosContext);
}