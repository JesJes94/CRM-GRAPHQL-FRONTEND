import React from 'react'
import useAuth from '../hooks/useAuth';
import { useQuery, gql } from '@apollo/client'
import Swal from 'sweetalert2'

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`

const Header = () => {

    const {handleSetAutenticado} = useAuth();

    const {data, loading, error} = useQuery(OBTENER_USUARIO)

    if(loading) return null

    if(!data.obtenerUsuario) {
        localStorage.removeItem('token');
        localStorage.removeItem('lastpath');
        handleSetAutenticado();
        return null
    }

    const {nombre, apellido} = data.obtenerUsuario

    const cerrarSesion = () => {

      Swal.fire({
        title: "¿Estás seguro de cerrar la sesión?",
        text: "Volverás a la página de inicio",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#075985",
        cancelButtonColor: "#991b1b",
        confirmButtonText: "Cerrar Sesión",
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          localStorage.removeItem('lastpath');
          handleSetAutenticado();
        }
      });
    }

  return (
    <div className=' flex justify-between mb-5'>
      <h1>Hola: {nombre} {apellido}</h1>

      <button 
        type='button'
        className=' bg-sky-800 w-auto text-white text-xs font-bold uppercase py-2 px-3 rounded-sm shadow-md hover:bg-sky-900 transition-colors'
        onClick={() => cerrarSesion()}
      >
        Cerrar Sesión
      </button>
    </div>
  )
}

export default Header
