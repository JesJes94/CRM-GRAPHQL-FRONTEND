import { useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { useQuery, gql  } from '@apollo/client';
import { useLocation } from 'react-router-dom'
import Spinner from '../components/Spinner';

const MEJORES_VENDEDORES = gql`
    query MejoresVendedores {
        mejoresVendedores {
            total
            vendedor {
                nombre
                email
            }
        }
    }
`

const MejoresVendedores = () => {

    const {pathname} = useLocation();
    localStorage.setItem('lastpath', pathname);  

    const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_VENDEDORES);

    useEffect( () => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if(loading) return <Spinner />

    const { mejoresVendedores } = data;

    const vendedorGrafica = []

    mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        }
    })

  return (
    <div>
      <h2 className=' text-gray-800 text-2xl'>Mejores Vendedores</h2>

      <BarChart
          className=' mt-10'
          width={500}
          height={300}
          data={vendedorGrafica}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#16a34a" activeBar={<Rectangle fill="yellow" stroke="green" />} />
        </BarChart>
    </div>
  )
}

export default MejoresVendedores
