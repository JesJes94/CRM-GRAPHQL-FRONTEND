import { Outlet, Navigate, useNavigate} from 'react-router-dom'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import useAuth from '../hooks/useAuth'
import { useQuery, gql } from '@apollo/client'


const RutaProtegida = () => {

    const { autenticado } = useAuth();


  return (
    <>
        {
            autenticado ?  (
                <div className='bg-gray-200 min-h-screen'>
                    <div className=' md:flex min-h-screen'>

                    <Sidebar />

                    <main className='w-full md:w-3/4 xl:w-4/5 p-5'>
                        <Header />

                        <Outlet />
                    </main>

                    </div>
                </div>
            ) : <Navigate to = '/'/>
        }
    </>
  )
}

export default RutaProtegida
